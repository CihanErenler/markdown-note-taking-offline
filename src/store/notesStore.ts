import { create } from "zustand";
import { v4 as uuid } from "uuid";
import * as ops from "../domain/notes";
import { importFiles, type ImportFile } from "../domain/exportImport";
import type { Folder, Note, NotesData, View } from "../domain/types";

interface NotesState {
  data: NotesData;
  view: View;
  selectedNoteId: string | null;
  editedNoteId: string | null;

  selectFolder: (id: string) => void;
  selectTag: (id: string) => void;
  selectAll: () => void;
  selectTrash: () => void;
  selectNote: (id: string) => void;
  openNote: (id: string) => void;

  createFolder: (name: string) => string | null;
  renameFolder: (id: string, name: string) => boolean;
  deleteFolder: (id: string) => void;

  createNote: (title: string, folderId?: string, content?: string) => string | null;
  newNote: (template?: { title: string; content: string }) => string | null;
  renameNote: (id: string, title: string) => boolean;
  deleteNote: (id: string) => void;
  moveNote: (noteId: string, folderId: string) => void;
  togglePin: (noteId: string) => void;
  duplicateNote: (noteId: string) => string | null;
  restoreVersion: (noteId: string, versionIndex: number) => void;
  restoreFromTrash: (noteId: string) => void;
  deleteForever: (noteId: string) => void;
  emptyTrash: () => void;
  restoreNote: (note: Note, index: number) => void;
  restoreFolder: (folder: Folder, index: number, removedNotes: ops.RemovedNote[]) => void;
  setContent: (text: string) => void;

  createTag: (name: string, color: string) => string | null;
  updateTag: (id: string, name: string, color: string) => boolean;
  deleteTag: (id: string) => void;
  addTagToNote: (noteId: string, tagId: string) => void;
  removeTagFromNote: (noteId: string, tagId: string) => void;

  importFiles: (files: ImportFile[]) => number;
}

const now = () => new Date().toISOString();

export const visibleNotes = (data: NotesData, view: View) => {
  if (!view) return [];
  if (view.type === "trash") return [];
  if (view.type === "all") return data.notes;
  if (view.type === "tag") return ops.notesWithTag(data, view.id);
  return ops.notesInFolder(data, view.id);
};

export const selectVisibleNotes = (s: NotesState) => visibleNotes(s.data, s.view);
export const selectSelectedNote = (s: NotesState) =>
  ops.getNote(s.data, s.selectedNoteId);
export const selectEditorText = (s: NotesState) =>
  selectSelectedNote(s)?.content ?? "";

const viewExists = (data: NotesData, view: View) => {
  if (!view) return false;
  if (view.type === "all" || view.type === "trash") return true;
  if (view.type === "folder") return data.folders.some((f) => f.id === view.id);
  return data.tags.some((t) => t.id === view.id);
};

const firstFolderView = (data: NotesData): View =>
  data.folders[0] ? { type: "folder", id: data.folders[0].id } : null;

/*
 * Puts new data in the store and fixes the selection: the view must still
 * exist, and the selected note must still be on screen. If not, select the
 * first note that is.
 */
const reconcile = (state: NotesState, data: NotesData, view: View = state.view) => {
  const nextView = viewExists(data, view) ? view : firstFolderView(data);
  const visible = visibleNotes(data, nextView);
  const keepNote = visible.some((n) => n.id === state.selectedNoteId);

  return {
    data,
    view: nextView,
    ...(keepNote ? {} : { selectedNoteId: visible[0]?.id ?? null }),
  };
};

const initialSelection = (data: NotesData) => {
  const folderWithNotes = data.folders.find((f) =>
    data.notes.some((n) => n.folderId === f.id)
  );
  const folder = folderWithNotes ?? data.folders[0];
  const view: View = folder ? { type: "folder", id: folder.id } : null;
  return { view, selectedNoteId: visibleNotes(data, view)[0]?.id ?? null };
};

const switchView = (state: NotesState, view: View) => ({
  view,
  selectedNoteId: visibleNotes(state.data, view)[0]?.id ?? null,
});

export const createNotesStore = (initialData: NotesData) => {
  const store = create<NotesState>((set, get) => ({
    data: initialData,
    ...initialSelection(initialData),
    editedNoteId: null,

    selectFolder: (id) => set((s) => switchView(s, { type: "folder", id })),
    selectTag: (id) => set((s) => switchView(s, { type: "tag", id })),
    selectAll: () => set((s) => switchView(s, { type: "all" })),
    selectTrash: () => set((s) => switchView(s, { type: "trash" })),
    selectNote: (id) => set({ selectedNoteId: id }),

    openNote: (id) => {
      const note = ops.getNote(get().data, id);
      if (note) {
        set({ view: { type: "folder", id: note.folderId }, selectedNoteId: id });
      }
    },

    createFolder: (name) => {
      if (!name.trim()) return null;
      const id = uuid();
      set((s) => ({
        data: ops.createFolder(s.data, { id, name }),
        view: { type: "folder", id },
        selectedNoteId: null,
      }));
      return id;
    },

    renameFolder: (id, name) => {
      if (!name.trim()) return false;
      set((s) => ({ data: ops.renameFolder(s.data, id, name) }));
      return true;
    },

    deleteFolder: (id) =>
      set((s) => {
        const index = s.data.folders.findIndex((f) => f.id === id);
        if (index < 0) return s;

        const data = ops.trashFolder(s.data, id, now());
        let view = s.view;
        if (view?.type === "folder" && view.id === id) {
          const next = data.folders[Math.min(index, data.folders.length - 1)];
          view = next ? { type: "folder", id: next.id } : null;
        }
        return reconcile(s, data, view);
      }),

    createNote: (title, folderId, content = "") => {
      const view = get().view;
      const wantedId = folderId ?? (view?.type === "folder" ? view.id : undefined);
      const folder = get().data.folders.find((f) => f.id === wantedId);
      if (!folder || !title.trim()) return null;
      const id = uuid();
      set((s) => ({
        data: ops.createNote(s.data, {
          id,
          folderId: folder.id,
          title,
          content,
          now: now(),
        }),
        view: { type: "folder", id: folder.id },
        selectedNoteId: id,
      }));
      return id;
    },

    newNote: (template) => {
      const { view, data, selectedNoteId, createNote } = get();
      const folderId =
        view?.type === "folder"
          ? view.id
          : ops.getNote(data, selectedNoteId)?.folderId ?? data.folders[0]?.id;
      return createNote(template?.title ?? "Untitled", folderId, template?.content);
    },

    renameNote: (id, title) => {
      if (!title.trim()) return false;
      set((s) => ({ data: ops.renameNote(s.data, id, title, now()) }));
      return true;
    },

    deleteNote: (id) =>
      set((s) => {
        const visible = visibleNotes(s.data, s.view);
        const index = visible.findIndex((n) => n.id === id);
        const data = ops.trashNote(s.data, id, now());
        if (s.selectedNoteId !== id) return reconcile(s, data);

        const remaining = visible.filter((n) => n.id !== id);
        const next = index === 0 ? remaining[0] : remaining[index - 1];
        return { ...reconcile(s, data), selectedNoteId: next?.id ?? null };
      }),

    moveNote: (noteId, folderId) =>
      set((s) => reconcile(s, ops.moveNote(s.data, noteId, folderId))),

    duplicateNote: (noteId) => {
      if (!ops.getNote(get().data, noteId)) return null;
      const id = uuid();
      set((s) => ({
        data: ops.duplicateNote(s.data, noteId, id, now()),
        selectedNoteId: id,
      }));
      return id;
    },

    togglePin: (noteId) => set((s) => ({ data: ops.togglePin(s.data, noteId) })),

    restoreVersion: (noteId, versionIndex) =>
      set((s) => ({ data: ops.restoreVersion(s.data, noteId, versionIndex, now()) })),

    restoreFromTrash: (noteId) =>
      set((s) => {
        const data = ops.restoreFromTrash(s.data, noteId, uuid);
        const note = ops.getNote(data, noteId);
        if (!note) return s;
        return {
          data,
          view: { type: "folder", id: note.folderId },
          selectedNoteId: noteId,
        };
      }),

    deleteForever: (noteId) =>
      set((s) => ({ data: ops.removeFromTrash(s.data, [noteId]) })),

    emptyTrash: () => set((s) => ({ data: ops.emptyTrash(s.data) })),

    restoreNote: (note, index) =>
      set((s) => {
        if (!s.data.folders.some((f) => f.id === note.folderId)) return s;
        return {
          data: ops.removeFromTrash(ops.restoreNote(s.data, note, index), [note.id]),
          view: { type: "folder", id: note.folderId },
          selectedNoteId: note.id,
        };
      }),

    restoreFolder: (folder, index, removedNotes) =>
      set((s) => ({
        data: ops.removeFromTrash(
          ops.restoreFolder(s.data, folder, index, removedNotes),
          removedNotes.map(({ note }) => note.id)
        ),
        view: { type: "folder", id: folder.id },
        selectedNoteId: removedNotes[0]?.note.id ?? null,
      })),

    setContent: (text) =>
      set((s) => {
        if (!s.selectedNoteId) return s;
        const startsSession = s.editedNoteId !== s.selectedNoteId;
        return {
          data: ops.updateNoteContent(s.data, s.selectedNoteId, text, now(), startsSession),
          editedNoteId: s.selectedNoteId,
        };
      }),

    createTag: (name, color) => {
      if (!name.trim() || ops.findTagByName(get().data, name)) return null;
      const id = uuid();
      set((s) => ({ data: ops.createTag(s.data, { id, name, color }) }));
      return id;
    },

    updateTag: (id, name, color) => {
      const sameName = ops.findTagByName(get().data, name);
      if (!name.trim() || (sameName && sameName.id !== id)) return false;
      set((s) => ({ data: ops.updateTag(s.data, id, name, color) }));
      return true;
    },

    deleteTag: (id) => set((s) => reconcile(s, ops.deleteTag(s.data, id))),

    addTagToNote: (noteId, tagId) =>
      set((s) => ({ data: ops.addTagToNote(s.data, noteId, tagId) })),

    removeTagFromNote: (noteId, tagId) =>
      set((s) => reconcile(s, ops.removeTagFromNote(s.data, noteId, tagId))),

    importFiles: (files) => {
      const result = importFiles(get().data, files, uuid, now());
      if (result.count === 0) return 0;
      set((s) => reconcile(s, result.data));
      return result.count;
    },
  }));

  store.subscribe((state, previous) => {
    const changedNote = state.selectedNoteId !== previous.selectedNoteId;
    if (changedNote && state.editedNoteId !== null) store.setState({ editedNoteId: null });
  });

  return store;
};
