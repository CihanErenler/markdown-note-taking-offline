import tagColors from "../colors";
import {
  addTagToNote,
  createFolder,
  createNote,
  createTag,
  findFolderByName,
  findTagByName,
} from "./notes";
import { IMAGE_PREFIX } from "./notes";
import type { NotesData } from "./types";

export interface ImportFile {
  path: string;
  content: string;
}

const DEFAULT_FOLDER = "Imported";
const NOTE_EXTENSION = /\.(md|markdown|txt)$/i;
const TAGS_BLOCK = /^---\r?\n(tags:[^\n]*)\r?\n---\r?\n\n?/;

const safeName = (name: string) => name.replace(/[\\/:*?"<>|]/g, "-").trim() || "Untitled";

export const exportFiles = (data: NotesData): ImportFile[] => {
  const usedPaths = new Set<string>();
  const files: ImportFile[] = [];

  for (const note of data.notes) {
    const folder = data.folders.find((f) => f.id === note.folderId);
    const folderName = safeName(folder?.name ?? DEFAULT_FOLDER);

    let path = `${folderName}/${safeName(note.title)}.md`;
    let copy = 2;
    while (usedPaths.has(path)) {
      path = `${folderName}/${safeName(note.title)} (${copy}).md`;
      copy++;
    }
    usedPaths.add(path);

    const tagNames = note.tagIds
      .map((id) => data.tags.find((t) => t.id === id)?.name)
      .filter(Boolean);
    const header = tagNames.length > 0 ? `---\ntags: ${tagNames.join(", ")}\n---\n\n` : "";

    files.push({ path, content: header + note.content });
  }

  return files;
};

const splitTags = (text: string) => {
  const match = text.match(TAGS_BLOCK);
  if (!match) return { tagNames: [], content: text };

  const tagNames = match[1]
    .slice("tags:".length)
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return { tagNames, content: text.slice(match[0].length) };
};

const isHiddenPath = (parts: string[]) =>
  parts.some((part) => part.startsWith(".") || part === "__MACOSX");

/*
 * Adds the notes found in `files` to the data. The folder is the directory the
 * file was in (files without one go to "Imported"). Folders and tags that
 * already exist by name are reused. `count` is how many notes were added.
 */
export const importFiles = (
  data: NotesData,
  files: ImportFile[],
  makeId: () => string,
  now: string
) => {
  let result = data;
  let count = 0;

  for (const file of files) {
    const parts = file.path.split("/").filter(Boolean);
    if (parts.length === 0 || isHiddenPath(parts)) continue;

    const fileName = parts[parts.length - 1];
    if (!NOTE_EXTENSION.test(fileName)) continue;

    const folderName = parts.length > 1 ? parts[parts.length - 2] : DEFAULT_FOLDER;
    let folder = findFolderByName(result, folderName);
    if (!folder) {
      folder = { id: makeId(), name: folderName };
      result = createFolder(result, folder);
    }

    const title = fileName.replace(NOTE_EXTENSION, "").trim() || "Untitled";
    const { tagNames, content } = splitTags(file.content);
    const noteId = makeId();
    result = createNote(result, { id: noteId, folderId: folder.id, title, content, now });

    for (const tagName of tagNames) {
      let tag = findTagByName(result, tagName);
      if (!tag) {
        const color = tagColors[result.tags.length % tagColors.length];
        tag = { id: makeId(), name: tagName, color };
        result = createTag(result, tag);
      }
      result = addTagToNote(result, noteId, tag.id);
    }
    count++;
  }

  return { data: result, count };
};

const EXPORTED_IMAGE = new RegExp(`${IMAGE_PREFIX}([\\w-]+)`, "g");
const ATTACHMENT_LINK = /\]\((?:\.{1,2}\/)*attachments\/([^)\s]+)\)/g;

export const linkImagesForExport = (content: string, fileNames: Map<string, string>) =>
  content.replace(EXPORTED_IMAGE, (link, id: string) => {
    const fileName = fileNames.get(id);
    return fileName ? `../attachments/${fileName}` : link;
  });

export const attachmentNames = (content: string) =>
  Array.from(content.matchAll(ATTACHMENT_LINK), (match) => match[1]);

export const linkImagesFromImport = (content: string, ids: Map<string, string>) =>
  content.replace(ATTACHMENT_LINK, (link, fileName: string) => {
    const id = ids.get(fileName);
    return id ? `](${IMAGE_PREFIX}${id})` : link;
  });
