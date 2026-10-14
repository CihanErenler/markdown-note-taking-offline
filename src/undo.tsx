import { toast } from "react-toastify";
import { useNotesStore } from "./store";

const showUndo = (message: string, undo: () => void) => {
  toast(
    ({ closeToast }) => (
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <button
          className="font-semibold underline"
          onClick={() => {
            undo();
            closeToast?.();
          }}
        >
          Undo
        </button>
      </div>
    ),
    { autoClose: 8000 }
  );
};

export const deleteNoteById = (noteId: string) => {
  const { data, deleteNote, restoreNote } = useNotesStore.getState();
  const index = data.notes.findIndex((note) => note.id === noteId);
  if (index < 0) return;

  const note = data.notes[index];
  deleteNote(note.id);
  showUndo(`"${note.title}" deleted`, () => restoreNote(note, index));
};

export const deleteSelectedNote = () => {
  const { selectedNoteId } = useNotesStore.getState();
  if (selectedNoteId) deleteNoteById(selectedNoteId);
};

export const deleteFolderById = (folderId: string) => {
  const { data, deleteFolder, restoreFolder } = useNotesStore.getState();
  const folderIndex = data.folders.findIndex((folder) => folder.id === folderId);
  if (folderIndex < 0) return;

  const folder = data.folders[folderIndex];
  const removedNotes = data.notes
    .map((note, index) => ({ note, index }))
    .filter(({ note }) => note.folderId === folderId);

  deleteFolder(folderId);
  showUndo(`Folder "${folder.name}" deleted`, () =>
    restoreFolder(folder, folderIndex, removedNotes)
  );
};

export const deleteCurrentFolder = () => {
  const view = useNotesStore.getState().view;
  if (view?.type === "folder") deleteFolderById(view.id);
};
