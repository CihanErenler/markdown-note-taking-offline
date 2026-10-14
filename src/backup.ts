import {
  attachmentNames,
  exportFiles,
  linkImagesForExport,
  linkImagesFromImport,
  type ImportFile,
} from "./domain/exportImport";
import { findImageIds } from "./domain/notes";
import type { NotesData } from "./domain/types";
import { extensionFor, IMAGE_FILE, loadImage, mimeFor, saveImage } from "./images";

export const downloadBackup = async (data: NotesData) => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();

  const fileNames = new Map<string, string>();
  const imageIds = new Set(data.notes.flatMap((note) => findImageIds(note.content)));
  for (const id of imageIds) {
    const image = await loadImage(id);
    if (!image) continue;
    const fileName = `${id}.${extensionFor(image.type)}`;
    fileNames.set(id, fileName);
    zip.file(`attachments/${fileName}`, image);
  }

  for (const file of exportFiles(data)) {
    zip.file(file.path, linkImagesForExport(file.content, fileNames));
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `notedown-backup-${new Date().toISOString().slice(0, 10)}.zip`;
  link.click();
  URL.revokeObjectURL(link.href);
  markBackupDone();
};

const fileName = (path: string) => path.split("/").pop() ?? path;

/*
 * Reads the chosen files. Notes come back as text. Images are stored in the
 * database only when a note links to them from an "attachments" folder, and the
 * link in the note is changed to point at the stored copy.
 */
export const readImportFiles = async (fileList: FileList) => {
  const notes: ImportFile[] = [];
  const images = new Map<string, Blob>();

  const addImage = (name: string, data: Blob) => {
    images.set(name, new Blob([data], { type: mimeFor(name) }));
  };

  for (const file of Array.from(fileList)) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const { default: JSZip } = await import("jszip");
      const zip = await JSZip.loadAsync(file);
      for (const entry of Object.values(zip.files)) {
        if (entry.dir) continue;
        if (IMAGE_FILE.test(entry.name)) {
          addImage(fileName(entry.name), await entry.async("blob"));
        } else {
          notes.push({ path: entry.name, content: await entry.async("string") });
        }
      }
    } else if (IMAGE_FILE.test(file.name)) {
      addImage(file.name, file);
    } else {
      notes.push({ path: file.name, content: await file.text() });
    }
  }

  const storedIds = new Map<string, string>();
  for (const note of notes) {
    for (const name of attachmentNames(note.content)) {
      const image = images.get(name);
      if (image && !storedIds.has(name)) storedIds.set(name, await saveImage(image));
    }
  }

  return notes.map((note) => ({
    ...note,
    content: linkImagesFromImport(note.content, storedIds),
  }));
};

const LAST_BACKUP_KEY = "notedock:lastBackup";

export const readLastBackup = () => {
  try {
    return Number(localStorage.getItem(LAST_BACKUP_KEY)) || null;
  } catch {
    return null;
  }
};

export const markBackupDone = () => {
  try {
    localStorage.setItem(LAST_BACKUP_KEY, String(Date.now()));
  } catch {
    // Storage is blocked: the reminder simply will not be remembered.
  }
};
