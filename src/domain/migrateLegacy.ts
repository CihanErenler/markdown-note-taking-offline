import { emptyData } from "./notes";
import type { Folder, Note, NotesData } from "./types";

/*
 * Converts the original localStorage layout into NotesData.
 *
 * Legacy layout (three separate keys):
 *   fileData: folder tree { items: [{ id, name, items: [{ id, name }] }] }
 *   code:     [{ dataId, title, code, tags, createdAt, updatedAt }]
 *   tags:     [{ id, name, color, items: [noteId] }]
 *
 * Tag membership was saved on both the note and the tag, so the two lists are
 * merged. Content whose note is not in the folder tree is dropped.
 */
interface LegacyFile {
  id: string;
  name: string;
}

interface LegacyFolder {
  id: string;
  name: string;
  items?: LegacyFile[];
}

interface LegacyContent {
  dataId: string;
  code?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface LegacyTag {
  id: string;
  name: string;
  color: string;
  items?: string[];
}

interface LegacyData {
  fileData?: { items?: LegacyFolder[] } | null;
  code?: LegacyContent[] | null;
  tags?: LegacyTag[] | null;
}

export const migrateLegacy = (
  { fileData, code, tags }: LegacyData,
  now: string
): NotesData => {
  if (!fileData || !Array.isArray(fileData.items)) return emptyData();

  const contentById = new Map((code ?? []).map((entry) => [entry.dataId, entry]));
  const legacyTags = Array.isArray(tags) ? tags : [];
  const tagIds = new Set(legacyTags.map((tag) => tag.id));

  const folders: Folder[] = [];
  const notes: Note[] = [];

  for (const folder of fileData.items) {
    folders.push({ id: folder.id, name: folder.name });

    for (const file of folder.items ?? []) {
      const entry = contentById.get(file.id);
      const fromNote = entry?.tags ?? [];
      const fromTags = legacyTags
        .filter((tag) => tag.items?.includes(file.id))
        .map((tag) => tag.id);

      notes.push({
        id: file.id,
        folderId: folder.id,
        title: file.name,
        content: entry?.code ?? "",
        tagIds: [...new Set([...fromNote, ...fromTags])].filter((id) =>
          tagIds.has(id)
        ),
        createdAt: toIso(entry?.createdAt, now),
        updatedAt: toIso(entry?.updatedAt, now),
      });
    }
  }

  return {
    folders,
    notes,
    tags: legacyTags.map(({ id, name, color }) => ({ id, name, color })),
  };
};

const toIso = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date.toISOString();
};
