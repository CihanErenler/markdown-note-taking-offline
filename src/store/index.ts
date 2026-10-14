import { get as readFromDatabase, set as writeToDatabase } from "idb-keyval";
import { createNotesStore } from "./notesStore";
import { createUiStore, type ModalMode } from "./uiStore";
import { purgeOldTrash } from "../domain/notes";
import { loadInitialData, saveData, type Database } from "./persistence";

export * from "./notesStore";

const database: Database = { get: readFromDatabase, set: writeToDatabase };
const oldStorage = typeof localStorage === "undefined" ? null : localStorage;
const SAVE_DELAY_MS = 2000;

const initialData = purgeOldTrash(
  await loadInitialData(database, oldStorage),
  new Date().toISOString()
);

export const useNotesStore = createNotesStore(initialData);
export const useUiStore = createUiStore();

saveData(database, initialData).then((saved) => {
  if (!saved) useUiStore.getState().setSaveStatus("failed");
});

navigator.storage?.persist?.();

// Typing changes the data on every keystroke, so writes wait until the user
// stops for a moment. A waiting write is done right away when the page is hidden.
let pendingSave: ReturnType<typeof setTimeout> | null = null;

const saveNow = async () => {
  if (pendingSave === null) return;
  clearTimeout(pendingSave);
  pendingSave = null;
  const saved = await saveData(database, useNotesStore.getState().data);
  if (pendingSave === null) {
    useUiStore.getState().setSaveStatus(saved ? "saved" : "failed");
  }
};

useNotesStore.subscribe((state, previous) => {
  if (state.data === previous.data) return;
  if (pendingSave !== null) clearTimeout(pendingSave);
  pendingSave = setTimeout(saveNow, SAVE_DELAY_MS);
  useUiStore.getState().setSaveStatus("saving");
});

window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveNow();
});

const currentFolder = () => {
  const { data, view } = useNotesStore.getState();
  return view?.type === "folder"
    ? data.folders.find((f) => f.id === view.id) ?? null
    : null;
};

export const openModalFor = (mode: ModalMode) => {
  const { openModal } = useUiStore.getState();
  const folder = currentFolder();

  if (mode === "create-folder") return openModal(mode);
  if (mode === "edit-folder" && folder) return openModal(mode, folder.name);
};

export const createNoteAndFocus = (template?: { title: string; content: string }) => {
  if (useNotesStore.getState().newNote(template)) {
    useUiStore.getState().requestTitleFocus();
  }
};
