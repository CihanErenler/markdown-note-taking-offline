import {
  emptyData,
  createFolder,
  renameFolder,
  deleteFolder,
  createNote,
  renameNote,
  updateNoteContent,
  deleteNote,
  createTag,
  addTagToNote,
  removeTagFromNote,
  getNote,
  notesInFolder,
  notesWithTag,
  findTagByName,
  searchNotes,
  snippet,
  moveNote,
  wikiLinkTitles,
  backlinksTo,
  linkifyWikiLinks,
  updateTag,
  deleteTag,
  countWords,
  readingMinutes,
  timeAgo,
  withPinnedFirst,
  togglePin,
  restoreNote,
  restoreFolder,
  matchingSnippet,
  trashNote,
  trashFolder,
  restoreFromTrash,
  removeFromTrash,
  emptyTrash,
  purgeOldTrash,
  restoreVersion,
  extractHeadings,
  slugify,
  unlinkedMentions,
  findImageIds,
  duplicateNote,
} from "./notes";

const T0 = "2024-01-01T00:00:00.000Z";
const T1 = "2024-01-02T00:00:00.000Z";

const seeded = () => {
  let data = emptyData();
  data = createFolder(data, { id: "f1", name: "Work" });
  data = createFolder(data, { id: "f2", name: "Home" });
  data = createNote(data, { id: "n1", folderId: "f1", title: "A", now: T0 });
  data = createNote(data, { id: "n2", folderId: "f1", title: "B", now: T0 });
  data = createNote(data, { id: "n3", folderId: "f2", title: "C", now: T0 });
  data = createTag(data, { id: "t1", name: "Urgent", color: "red" });
  return data;
};

test("operations do not mutate their input", () => {
  const data = seeded();
  const snapshot = JSON.stringify(data);

  createFolder(data, { id: "x", name: "X" });
  renameFolder(data, "f1", "Renamed");
  deleteFolder(data, "f1");
  createNote(data, { id: "x", folderId: "f1", title: "X", now: T1 });
  renameNote(data, "n1", "Renamed", T1);
  updateNoteContent(data, "n1", "body", T1);
  deleteNote(data, "n1");
  createTag(data, { id: "x", name: "X", color: "blue" });
  addTagToNote(data, "n1", "t1");
  removeTagFromNote(data, "n1", "t1");

  expect(JSON.stringify(data)).toBe(snapshot);
});

test("new folders and notes are prepended and names are trimmed", () => {
  const data = seeded();
  expect(data.folders.map((f) => f.id)).toEqual(["f2", "f1"]);
  expect(notesInFolder(data, "f1").map((n) => n.id)).toEqual(["n2", "n1"]);

  const renamed = renameFolder(data, "f1", "  Office  ");
  expect(renamed.folders.find((f) => f.id === "f1")?.name).toBe("Office");
});

test("deleting a folder deletes its notes and leaves others alone", () => {
  const data = deleteFolder(seeded(), "f1");

  expect(data.folders.map((f) => f.id)).toEqual(["f2"]);
  expect(data.notes.map((n) => n.id)).toEqual(["n3"]);
});

test("editing a note updates only that note and bumps updatedAt", () => {
  let data = updateNoteContent(seeded(), "n1", "# hello", T1);
  data = renameNote(data, "n1", " Renamed ", T1);

  expect(getNote(data, "n1")).toMatchObject({
    title: "Renamed",
    content: "# hello",
    createdAt: T0,
    updatedAt: T1,
  });
  expect(getNote(data, "n2")?.updatedAt).toBe(T0);
});

test("deleting a note removes it", () => {
  const data = deleteNote(seeded(), "n1");
  expect(getNote(data, "n1")).toBeNull();
  expect(data.notes).toHaveLength(2);
});

test("a tag is stored once, on the note, and tag queries derive from it", () => {
  let data = addTagToNote(seeded(), "n1", "t1");
  data = addTagToNote(data, "n1", "t1"); // adding twice is a no-op
  data = addTagToNote(data, "n3", "t1");

  expect(getNote(data, "n1")?.tagIds).toEqual(["t1"]);
  expect(notesWithTag(data, "t1").map((n) => n.id).sort()).toEqual(["n1", "n3"]);

  data = removeTagFromNote(data, "n1", "t1");
  expect(notesWithTag(data, "t1").map((n) => n.id)).toEqual(["n3"]);
});

test("deleting a note drops it from tag results with no extra bookkeeping", () => {
  let data = addTagToNote(seeded(), "n1", "t1");
  data = deleteNote(data, "n1");
  expect(notesWithTag(data, "t1")).toEqual([]);
});

test("findTagByName ignores case and surrounding whitespace", () => {
  const data = seeded();
  expect(findTagByName(data, "  URGENT ")?.id).toBe("t1");
  expect(findTagByName(data, "missing")).toBeNull();
});

test("snippet is the first line of text without markdown markers", () => {
  expect(snippet("\n### Hello **world**\nmore")).toBe("Hello world");
  expect(snippet("- [x] Xavier")).toBe("Xavier");
  expect(snippet("")).toBe("");
});

test("search matches titles and content, ignoring case and blanks", () => {
  let data = seeded();
  data = updateNoteContent(data, "n2", "Buy MILK", T1);

  expect(searchNotes(data, "milk").map((n) => n.id)).toEqual(["n2"]);
  expect(searchNotes(data, "c").map((n) => n.id)).toEqual(["n3"]);
  expect(searchNotes(data, "  ")).toEqual([]);
});

test("moving a note changes its folder only", () => {
  const data = seeded();
  const moved = moveNote(data, "n1", "f2");

  expect(getNote(moved, "n1")?.folderId).toBe("f2");
  expect(getNote(moved, "n1")?.updatedAt).toBe(T0);
});

const withLinks = () => {
  let data = seeded();
  data = updateNoteContent(data, "n1", "See [[B]] and [[Missing]]", T1);
  data = updateNoteContent(data, "n3", "```\n[[B]]\n```\nOutside [[b]]", T1);
  return data;
};

test("wikiLinkTitles lists the titles inside double brackets", () => {
  expect(wikiLinkTitles("a [[One]] b [[ Two ]] [single]")).toEqual(["One", "Two"]);
});

test("backlinks are the other notes that link to a note, ignoring case", () => {
  const data = withLinks();

  expect(backlinksTo(data, "n2").map((n) => n.id).sort()).toEqual(["n1", "n3"]);
  expect(backlinksTo(data, "n1")).toEqual([]);
});

test("linkify points existing titles at the note and leaves code blocks alone", () => {
  const data = withLinks();

  expect(linkifyWikiLinks(data, getNote(data, "n1")?.content ?? "")).toBe(
    "See [B](#note:n2) and [Missing](#missing)"
  );
  expect(linkifyWikiLinks(data, getNote(data, "n3")?.content ?? "")).toBe(
    "```\n[[B]]\n```\nOutside [b](#note:n2)"
  );
});

test("renaming a note updates the links that point at it", () => {
  const renamed = renameNote(withLinks(), "n2", "Bee", T1);

  expect(getNote(renamed, "n1")?.content).toBe("See [[Bee]] and [[Missing]]");
});

test("updating a tag changes its name and colour", () => {
  const data = updateTag(seeded(), "t1", "  Soon ", "blue");

  expect(data.tags.find((t) => t.id === "t1")).toEqual({ id: "t1", name: "Soon", color: "blue" });
});

test("deleting a tag also removes it from every note", () => {
  let data = addTagToNote(seeded(), "n1", "t1");
  data = addTagToNote(data, "n3", "t1");

  const result = deleteTag(data, "t1");

  expect(result.tags.find((t) => t.id === "t1")).toBeUndefined();
  expect(result.notes.every((n) => n.tagIds.length === 0)).toBe(true);
});

test("word count and reading time", () => {
  expect(countWords("")).toBe(0);
  expect(countWords("  one two\nthree  ")).toBe(3);
  expect(readingMinutes(0)).toBe(1);
  expect(readingMinutes(401)).toBe(3);
});

test("timeAgo gives short relative times, then a date", () => {
  const now = new Date("2024-06-10T12:00:00.000Z").getTime();
  const ago = (ms: number) => new Date(now - ms).toISOString();

  expect(timeAgo(ago(10 * 1000), now)).toBe("Just now");
  expect(timeAgo(ago(5 * 60 * 1000), now)).toBe("5m ago");
  expect(timeAgo(ago(3 * 60 * 60 * 1000), now)).toBe("3h ago");
  expect(timeAgo(ago(2 * 24 * 60 * 60 * 1000), now)).toBe("2d ago");
  expect(timeAgo(ago(30 * 24 * 60 * 60 * 1000), now)).toMatch(/May/);
});

test("pinned notes come first and keep their order", () => {
  const data = togglePin(seeded(), "n3");

  expect(withPinnedFirst(data.notes).map((n) => n.id)).toEqual(["n3", "n2", "n1"]);
  expect(getNote(togglePin(data, "n3"), "n3")?.pinned).toBe(false);
});

test("a deleted note comes back at the same place", () => {
  const data = seeded();
  const note = data.notes[1];

  const restored = restoreNote(deleteNote(data, note.id), note, 1);

  expect(restored.notes.map((n) => n.id)).toEqual(data.notes.map((n) => n.id));
});

test("a deleted folder comes back with its notes in their old places", () => {
  const data = seeded();
  const folder = data.folders[1];
  const removed = data.notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => note.folderId === folder.id);

  const restored = restoreFolder(deleteFolder(data, folder.id), folder, 1, removed);

  expect(restored).toEqual(data);
});

test("matchingSnippet shows the line with the match", () => {
  const content = "first line\nthe needle is here";

  expect(matchingSnippet(content, "NEEDLE")).toBe("the needle is here");
  expect(matchingSnippet(content, "missing")).toBe("first line");
  expect(matchingSnippet(content, "")).toBe("first line");
});

test("a link can show its own words and still point at the note", () => {
  let data = seeded();
  data = updateNoteContent(data, "n1", "[[B|click here to read more]] and [[Missing|nothing]]", T1);

  expect(wikiLinkTitles(getNote(data, "n1")?.content ?? "")).toEqual(["B", "Missing"]);
  expect(backlinksTo(data, "n2").map((n) => n.id)).toEqual(["n1"]);
  expect(linkifyWikiLinks(data, getNote(data, "n1")?.content ?? "")).toBe(
    "[click here to read more](#note:n2) and [nothing](#missing)"
  );
});

test("renaming a note keeps the words of links that point at it", () => {
  let data = seeded();
  data = updateNoteContent(data, "n1", "[[B|read more]]", T1);

  const renamed = renameNote(data, "n2", "Bee", T1);

  expect(getNote(renamed, "n1")?.content).toBe("[[Bee|read more]]");
});

const T_LATER = "2024-01-02T01:00:00.000Z";

test("trashing a note keeps it for restoring, with the name of its folder", () => {
  const data = trashNote(seeded(), "n1", T1);

  expect(getNote(data, "n1")).toBeNull();
  expect(data.trash?.[0]).toMatchObject({ folderName: "Work", deletedAt: T1 });
  expect(data.trash?.[0].note.id).toBe("n1");
});

test("trashing a folder trashes its notes and restoring brings the folder back", () => {
  let data = trashFolder(seeded(), "f1", T1);
  expect(data.folders.map((f) => f.id)).toEqual(["f2"]);
  expect(data.trash?.map((item) => item.note.id).sort()).toEqual(["n1", "n2"]);

  let id = 0;
  data = restoreFromTrash(data, "n1", () => `new${++id}`);

  expect(data.folders.map((f) => f.name)).toEqual(["Work", "Home"]);
  expect(getNote(data, "n1")?.folderId).toBe("new1");
  expect(data.trash?.map((item) => item.note.id)).toEqual(["n2"]);
});

test("a trashed note goes back to its old folder when that folder still exists", () => {
  const data = restoreFromTrash(trashNote(seeded(), "n1", T1), "n1", () => "unused");

  expect(getNote(data, "n1")?.folderId).toBe("f1");
  expect(data.folders).toHaveLength(2);
});

test("trash can be emptied, cleared of chosen notes, and purged after 30 days", () => {
  let data = trashNote(seeded(), "n1", T0);
  data = trashNote(data, "n2", "2024-02-20T00:00:00.000Z");

  expect(purgeOldTrash(data, "2024-02-21T00:00:00.000Z").trash?.map((i) => i.note.id)).toEqual(["n2"]);
  expect(removeFromTrash(data, ["n1"]).trash?.map((i) => i.note.id)).toEqual(["n2"]);
  expect(emptyTrash(data).trash).toEqual([]);
});

test("a new editing session keeps the old text as a version, and restoring keeps the current one", () => {
  let data = updateNoteContent(seeded(), "n1", "first draft", T0);
  data = updateNoteContent(data, "n1", "second draft", T_LATER);

  expect(getNote(data, "n1")?.versions?.map((v) => v.content)).toEqual(["first draft"]);

  data = restoreVersion(data, "n1", 0, T_LATER);
  expect(getNote(data, "n1")?.content).toBe("first draft");
  expect(getNote(data, "n1")?.versions?.[0].content).toBe("second draft");
});

test("typing within five minutes does not add versions", () => {
  let data = updateNoteContent(seeded(), "n1", "one", T0);
  data = updateNoteContent(data, "n1", "one two", "2024-01-01T00:01:00.000Z");
  data = updateNoteContent(data, "n1", "one two three", "2024-01-01T00:02:00.000Z");

  expect(getNote(data, "n1")?.versions ?? []).toHaveLength(0);
});

test("headings are listed with ids and code blocks are skipped", () => {
  const content = "# Title\n```\n# not a heading\n```\n## Second *part*\ntext";

  expect(extractHeadings(content)).toEqual([
    { level: 1, text: "Title", id: "title" },
    { level: 2, text: "Second part", id: "second-part" },
  ]);
  expect(slugify("Hello, World!")).toBe("hello-world");
});

test("unlinked mentions are notes that name this one without linking to it", () => {
  let data = seeded();
  data = renameNote(data, "n2", "Budget", T1);
  data = updateNoteContent(data, "n1", "see the budget soon", T1);
  data = updateNoteContent(data, "n3", "linked [[Budget]] only", T1);

  expect(unlinkedMentions(data, "n2").map((n) => n.id)).toEqual(["n1"]);
});

test("image ids are found inside note text", () => {
  const content = "![a](notedock-image:abc-123) text ![b](notedock-image:def) ![a](notedock-image:abc-123)";

  expect(findImageIds(content)).toEqual(["abc-123", "def"]);
});

test("duplicating a note copies it right after the original with a unique title", () => {
  let data = addTagToNote(seeded(), "n1", "t1");
  data = updateNoteContent(data, "n1", "body", T1);

  const once = duplicateNote(data, "n1", "copy1", T_LATER);
  const twice = duplicateNote(once, "n1", "copy2", T_LATER);

  expect(once.notes.map((n) => n.id)).toEqual(["n3", "n2", "n1", "copy1"]);
  expect(getNote(once, "copy1")).toMatchObject({
    title: "A copy",
    content: "body",
    tagIds: ["t1"],
    folderId: "f1",
    createdAt: T_LATER,
  });
  expect(getNote(twice, "copy2")?.title).toBe("A copy 2");
});

test("a session flag keeps the old text as a version right away", () => {
  let data = updateNoteContent(seeded(), "n1", "first", T0);
  data = updateNoteContent(data, "n1", "second", "2024-01-01T00:00:30.000Z", true);

  expect(getNote(data, "n1")?.versions?.map((v) => v.content)).toEqual(["first"]);
});

test("text that is already the latest version is not kept again", () => {
  let data = updateNoteContent(seeded(), "n1", "X", T0);
  data = updateNoteContent(data, "n1", "Y", "2024-01-01T00:00:30.000Z", true);
  data = updateNoteContent(data, "n1", "X", "2024-01-01T00:01:00.000Z");
  data = updateNoteContent(data, "n1", "Z", "2024-01-01T00:01:30.000Z", true);

  expect(getNote(data, "n1")?.versions?.map((v) => v.content)).toEqual(["X"]);
});
