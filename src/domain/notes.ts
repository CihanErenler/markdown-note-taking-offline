import type { Folder, Note, NotesData, Tag } from "./types";

/*
 * Pure data model and operations for notes, folders and tags.
 * A note belongs to one folder (folderId) and carries its own tags (tagIds).
 * Everything else (notes in a folder, counts) is worked out from those.
 * Functions never change their input and never read the clock or make ids:
 * the caller passes `id` and `now` in. New items go first, so array order is
 * display order (newest first).
 */

export const emptyData = (): NotesData => ({ folders: [], notes: [], tags: [] });

const changeNote = (
  data: NotesData,
  noteId: string,
  changes: Partial<Note>
): NotesData => ({
  ...data,
  notes: data.notes.map((note) =>
    note.id === noteId ? { ...note, ...changes } : note
  ),
});

export const getNote = (data: NotesData, noteId: string | null) =>
  data.notes.find((note) => note.id === noteId) ?? null;

export const notesInFolder = (data: NotesData, folderId: string) =>
  data.notes.filter((note) => note.folderId === folderId);

export const notesWithTag = (data: NotesData, tagId: string) =>
  data.notes.filter((note) => note.tagIds.includes(tagId));

export const findTagByName = (data: NotesData, name: string) => {
  const wanted = name.trim().toLowerCase();
  return data.tags.find((tag) => tag.name.toLowerCase() === wanted) ?? null;
};

export const findFolderByName = (data: NotesData, name: string) => {
  const wanted = name.trim().toLowerCase();
  return data.folders.find((folder) => folder.name.toLowerCase() === wanted) ?? null;
};

export const findNoteByTitle = (data: NotesData, title: string) => {
  const wanted = title.trim().toLowerCase();
  return data.notes.find((note) => note.title.toLowerCase() === wanted) ?? null;
};

const stripMarkdown = (line: string) =>
  line
    .replace(/^\s*(#+|>|[-*+]\s+(\[[ xX]\]\s*)?)\s*/, "")
    .replace(/[*_`]/g, "");

export const countWords = (content: string) =>
  content.split(/\s+/).filter(Boolean).length;

export const readingMinutes = (words: number) => Math.max(1, Math.ceil(words / 200));

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const timeAgo = (isoDate: string, now = Date.now()) => {
  const age = now - new Date(isoDate).getTime();

  if (age < MINUTE) return "Just now";
  if (age < HOUR) return `${Math.floor(age / MINUTE)}m ago`;
  if (age < DAY) return `${Math.floor(age / HOUR)}h ago`;
  if (age < 7 * DAY) return `${Math.floor(age / DAY)}d ago`;
  return new Date(isoDate).toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const withPinnedFirst = (notes: Note[]) => [
  ...notes.filter((note) => note.pinned),
  ...notes.filter((note) => !note.pinned),
];

export const togglePin = (data: NotesData, noteId: string) => {
  const note = getNote(data, noteId);
  return note ? changeNote(data, noteId, { pinned: !note.pinned }) : data;
};

const insertAt = <T>(items: T[], item: T, index: number) => [
  ...items.slice(0, index),
  item,
  ...items.slice(index),
];

export const restoreNote = (data: NotesData, note: Note, index: number): NotesData => ({
  ...data,
  notes: insertAt(data.notes, note, index),
});

export interface RemovedNote {
  note: Note;
  index: number;
}

export const restoreFolder = (
  data: NotesData,
  folder: Folder,
  folderIndex: number,
  removedNotes: RemovedNote[]
): NotesData => {
  let result: NotesData = {
    ...data,
    folders: insertAt(data.folders, folder, folderIndex),
  };
  for (const { note, index } of removedNotes) {
    result = restoreNote(result, note, index);
  }
  return result;
};

export const snippet = (content: string, max = 90) => {
  const line = content
    .split("\n")
    .map(stripMarkdown)
    .find((text) => text.trim());
  return line ? line.trim().slice(0, max) : "";
};

export const matchingSnippet = (content: string, query: string, max = 90) => {
  const wanted = query.trim().toLowerCase();
  const line = content.split("\n").find((text) => text.toLowerCase().includes(wanted));
  if (!wanted || !line) return snippet(content, max);

  const start = Math.max(0, line.toLowerCase().indexOf(wanted) - 20);
  return line.slice(start, start + max).trim();
};

export const searchNotes = (data: NotesData, query: string) => {
  const wanted = query.trim().toLowerCase();
  if (!wanted) return [];
  return data.notes.filter(
    (note) =>
      note.title.toLowerCase().includes(wanted) ||
      note.content.toLowerCase().includes(wanted)
  );
};

export const createFolder = (
  data: NotesData,
  { id, name }: Folder
): NotesData => ({
  ...data,
  folders: [{ id, name: name.trim() }, ...data.folders],
});

export const renameFolder = (
  data: NotesData,
  folderId: string,
  name: string
): NotesData => ({
  ...data,
  folders: data.folders.map((folder) =>
    folder.id === folderId ? { ...folder, name: name.trim() } : folder
  ),
});

export const deleteFolder = (data: NotesData, folderId: string): NotesData => ({
  ...data,
  folders: data.folders.filter((folder) => folder.id !== folderId),
  notes: data.notes.filter((note) => note.folderId !== folderId),
});

interface NewNote {
  id: string;
  folderId: string;
  title: string;
  content?: string;
  now: string;
}

export const createNote = (
  data: NotesData,
  { id, folderId, title, content = "", now }: NewNote
): NotesData => ({
  ...data,
  notes: [
    {
      id,
      folderId,
      title: title.trim(),
      content,
      tagIds: [],
      createdAt: now,
      updatedAt: now,
    },
    ...data.notes,
  ],
});

export const renameNote = (
  data: NotesData,
  noteId: string,
  title: string,
  now: string
): NotesData => {
  const oldTitle = getNote(data, noteId)?.title;
  const newTitle = title.trim();
  const renamed = changeNote(data, noteId, { title: newTitle, updatedAt: now });
  if (!oldTitle) return renamed;

  return {
    ...renamed,
    notes: renamed.notes.map((note) => ({
      ...note,
      content: renameWikiLinks(note.content, oldTitle, newTitle),
    })),
  };
};

const VERSION_GAP_MS = 5 * 60 * 1000;
const MAX_VERSIONS = 10;

const addVersion = (note: Note) => {
  const versions = note.versions ?? [];
  return [{ content: note.content, savedAt: note.updatedAt }, ...versions].slice(0, MAX_VERSIONS);
};

/*
 * Saves the new text. At the start of an editing session the text being
 * replaced is first kept as a version, so history gets one entry per session
 * instead of one per keystroke. A session starts when the caller says so (the
 * note was just opened) or when the note had been left alone for five minutes.
 */
export const updateNoteContent = (
  data: NotesData,
  noteId: string,
  content: string,
  now: string,
  startsSession = false
) => {
  const note = getNote(data, noteId);
  if (!note) return data;

  const idleTime = new Date(now).getTime() - new Date(note.updatedAt).getTime();
  const sessionStarted = startsSession || idleTime > VERSION_GAP_MS;
  const alreadyKept = note.versions?.[0]?.content === note.content;
  const startsNewSession =
    note.content !== content && note.content.trim() !== "" && sessionStarted && !alreadyKept;

  return changeNote(data, noteId, {
    content,
    updatedAt: now,
    ...(startsNewSession ? { versions: addVersion(note) } : {}),
  });
};

export const restoreVersion = (
  data: NotesData,
  noteId: string,
  versionIndex: number,
  now: string
) => {
  const note = getNote(data, noteId);
  const version = note?.versions?.[versionIndex];
  if (!note || !version) return data;

  return changeNote(data, noteId, {
    content: version.content,
    updatedAt: now,
    versions: addVersion(note),
  });
};

const uniqueTitle = (data: NotesData, base: string) => {
  let title = base;
  let copy = 2;
  while (findNoteByTitle(data, title)) {
    title = `${base} ${copy}`;
    copy++;
  }
  return title;
};

export const duplicateNote = (
  data: NotesData,
  noteId: string,
  newId: string,
  now: string
): NotesData => {
  const index = data.notes.findIndex((note) => note.id === noteId);
  if (index < 0) return data;

  const { pinned, versions, ...original } = data.notes[index];
  const copy: Note = {
    ...original,
    id: newId,
    title: uniqueTitle(data, `${original.title} copy`),
    createdAt: now,
    updatedAt: now,
  };
  return { ...data, notes: insertAt(data.notes, copy, index + 1) };
};

export const moveNote = (data: NotesData, noteId: string, folderId: string) =>
  changeNote(data, noteId, { folderId });

export const deleteNote = (data: NotesData, noteId: string): NotesData => ({
  ...data,
  notes: data.notes.filter((note) => note.id !== noteId),
});

const TRASH_DAYS = 30;

export const trashNote = (data: NotesData, noteId: string, now: string): NotesData => {
  const note = getNote(data, noteId);
  if (!note) return data;

  const folderName = data.folders.find((f) => f.id === note.folderId)?.name ?? "Restored";
  return {
    ...deleteNote(data, noteId),
    trash: [{ note, folderName, deletedAt: now }, ...(data.trash ?? [])],
  };
};

export const trashFolder = (data: NotesData, folderId: string, now: string): NotesData => {
  const folder = data.folders.find((f) => f.id === folderId);
  if (!folder) return data;

  const trashed = data.notes
    .filter((note) => note.folderId === folderId)
    .map((note) => ({ note, folderName: folder.name, deletedAt: now }));
  return {
    ...deleteFolder(data, folderId),
    trash: [...trashed, ...(data.trash ?? [])],
  };
};

export const removeFromTrash = (data: NotesData, noteIds: string[]): NotesData => ({
  ...data,
  trash: (data.trash ?? []).filter((item) => !noteIds.includes(item.note.id)),
});

export const emptyTrash = (data: NotesData): NotesData => ({ ...data, trash: [] });

export const purgeOldTrash = (data: NotesData, now: string): NotesData => {
  const limit = new Date(now).getTime() - TRASH_DAYS * 24 * 60 * 60 * 1000;
  return {
    ...data,
    trash: (data.trash ?? []).filter((item) => new Date(item.deletedAt).getTime() > limit),
  };
};

/*
 * Brings a trashed note back into the folder it came from. If that folder was
 * deleted too, a folder with the same name is created again.
 */
export const restoreFromTrash = (
  data: NotesData,
  noteId: string,
  makeId: () => string
): NotesData => {
  const item = (data.trash ?? []).find((entry) => entry.note.id === noteId);
  if (!item) return data;

  let result = removeFromTrash(data, [noteId]);
  let folder = result.folders.find((f) => f.id === item.note.folderId);
  folder ??= findFolderByName(result, item.folderName) ?? undefined;
  if (!folder) {
    folder = { id: makeId(), name: item.folderName };
    result = createFolder(result, folder);
  }

  return { ...result, notes: [{ ...item.note, folderId: folder.id }, ...result.notes] };
};

export const createTag = (data: NotesData, { id, name, color }: Tag): NotesData => ({
  ...data,
  tags: [...data.tags, { id, name: name.trim(), color }],
});

export const addTagToNote = (data: NotesData, noteId: string, tagId: string) => {
  const note = getNote(data, noteId);
  if (!note || note.tagIds.includes(tagId)) return data;
  return changeNote(data, noteId, { tagIds: [...note.tagIds, tagId] });
};

export const removeTagFromNote = (
  data: NotesData,
  noteId: string,
  tagId: string
) => {
  const note = getNote(data, noteId);
  if (!note) return data;
  return changeNote(data, noteId, {
    tagIds: note.tagIds.filter((id) => id !== tagId),
  });
};

export const updateTag = (
  data: NotesData,
  tagId: string,
  name: string,
  color: string
): NotesData => ({
  ...data,
  tags: data.tags.map((tag) =>
    tag.id === tagId ? { ...tag, name: name.trim(), color } : tag
  ),
});

export const deleteTag = (data: NotesData, tagId: string): NotesData => ({
  ...data,
  tags: data.tags.filter((tag) => tag.id !== tagId),
  notes: data.notes.map((note) => ({
    ...note,
    tagIds: note.tagIds.filter((id) => id !== tagId),
  })),
});

/*
 * Wiki links: [[Note title]] points at the note with that title.
 * [[Note title|some words]] points at the same note but shows "some words".
 */

const WIKI_LINK = /\[\[([^\]\n]+)\]\]/g;

const parseWikiLink = (inner: string) => {
  const [target, ...labelParts] = inner.split("|");
  const label = labelParts.join("|").trim();
  return { target: target.trim(), label };
};

export const wikiLinkTitles = (content: string) =>
  Array.from(content.matchAll(WIKI_LINK), (match) => parseWikiLink(match[1]).target);

const renameWikiLinks = (content: string, oldTitle: string, newTitle: string) =>
  content.replace(WIKI_LINK, (link, inner: string) => {
    const { target, label } = parseWikiLink(inner);
    if (target.toLowerCase() !== oldTitle.toLowerCase()) return link;
    return label ? `[[${newTitle}|${label}]]` : `[[${newTitle}]]`;
  });

export const backlinksTo = (data: NotesData, noteId: string) => {
  const target = getNote(data, noteId);
  if (!target) return [];
  const wanted = target.title.toLowerCase();

  return data.notes.filter(
    (note) =>
      note.id !== noteId &&
      wikiLinkTitles(note.content).some((title) => title.toLowerCase() === wanted)
  );
};

/*
 * Turns wiki links into normal markdown links so the preview can render them.
 * Links to an existing note become "#note:<id>", the rest become "#missing".
 * Fenced code blocks are left alone.
 */
export const linkifyWikiLinks = (data: NotesData, content: string) => {
  const parts = content.split("```");

  const linked = parts.map((part, index) => {
    const isCode = index % 2 === 1;
    if (isCode) return part;

    return part.replace(WIKI_LINK, (_link, inner: string) => {
      const { target, label } = parseWikiLink(inner);
      const note = findNoteByTitle(data, target);
      const text = label || target;
      return note ? `[${text}](#note:${note.id})` : `[${text}](#missing)`;
    });
  });

  return linked.join("```");
};

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");

export const extractHeadings = (content: string): Heading[] => {
  const headings: Heading[] = [];
  let inCode = false;

  for (const line of content.split("\n")) {
    if (line.startsWith("```")) inCode = !inCode;
    const match = inCode ? null : /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const text = match[2].replace(/[*_`]/g, "");
      headings.push({ level: match[1].length, text, id: slugify(text) });
    }
  }

  return headings;
};

/* Notes that mention this note's title in plain text without linking to it. */
export const unlinkedMentions = (data: NotesData, noteId: string) => {
  const target = getNote(data, noteId);
  if (!target || target.title.trim().length < 3) return [];

  const wanted = target.title.toLowerCase();
  const linked = new Set(backlinksTo(data, noteId).map((note) => note.id));

  return data.notes.filter(
    (note) =>
      note.id !== noteId &&
      !linked.has(note.id) &&
      note.content.replace(WIKI_LINK, "").toLowerCase().includes(wanted)
  );
};

export const IMAGE_PREFIX = "notedock-image:";
const IMAGE_ID = new RegExp(`${IMAGE_PREFIX}([\\w-]+)`, "g");

export const findImageIds = (content: string) =>
  Array.from(new Set(Array.from(content.matchAll(IMAGE_ID), (match) => match[1])));
