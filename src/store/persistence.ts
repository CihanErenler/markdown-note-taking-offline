import { migrateLegacy } from "../domain/migrateLegacy";
import { seedData } from "../domain/seed";
import type { NotesData } from "../domain/types";

export const STORAGE_KEY = "notedock:v2";

export interface Database {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
}

export interface TextStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const isNotesData = (value: any): value is NotesData =>
  Array.isArray(value?.folders) &&
  Array.isArray(value?.notes) &&
  Array.isArray(value?.tags);

const readDatabase = async (db: Database | null) => {
  try {
    return (await db?.get(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
};

const readText = (storage: TextStorage | null, key: string) => {
  try {
    const raw = storage?.getItem(key);
    return raw == null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
};

/*
 * Where the data comes from, in order:
 * 1. IndexedDB (current)
 * 2. localStorage "notedock:v2" (earlier version, moved to IndexedDB on first save)
 * 3. the original three localStorage keys (migrated)
 * 4. the first-run sample notes
 * Old localStorage keys are never deleted, so nothing is lost if this goes wrong.
 */
export const loadInitialData = async (
  db: Database | null,
  oldStorage: TextStorage | null,
  now = new Date().toISOString()
): Promise<NotesData> => {
  const current = await readDatabase(db);
  if (isNotesData(current)) return current;

  const previous = readText(oldStorage, STORAGE_KEY);
  if (isNotesData(previous)) return previous;

  const fileData = readText(oldStorage, "fileData");
  if (fileData) {
    return migrateLegacy(
      {
        fileData,
        code: readText(oldStorage, "code"),
        tags: readText(oldStorage, "tags"),
      },
      now
    );
  }

  return seedData(now);
};

export const saveData = async (db: Database | null, data: NotesData) => {
  try {
    await db?.set(STORAGE_KEY, data);
    return true;
  } catch {
    return false;
  }
};
