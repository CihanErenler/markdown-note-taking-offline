import { useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { MdFolder } from "react-icons/md";
import Row from "../Sidebar/Row";
import FolderOptions from "../Sidebar/FolderOptions";
import { useNotesStore } from "../../store";
import type { Folder as FolderType } from "../../domain/types";

export const NOTE_DRAG_TYPE = "application/x-notedock-note";

const Folder = ({ folder }: { folder: FolderType }) => {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const selectFolder = useNotesStore((s) => s.selectFolder);
  const moveNote = useNotesStore((s) => s.moveNote);
  const selected = useNotesStore(
    (s) => s.view?.type === "folder" && s.view.id === folder.id
  );
  const count = useNotesStore(
    (s) => s.data.notes.filter((n) => n.folderId === folder.id).length
  );

  const handleDragOver = (e: DragEvent) => {
    if (!e.dataTransfer.types.includes(NOTE_DRAG_TYPE)) return;
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const noteId = e.dataTransfer.getData(NOTE_DRAG_TYPE);
    if (noteId) moveNote(noteId, folder.id);
  };

  return (
    <Row
      selected={selected}
      highlighted={dragOver}
      onClick={() => selectFolder(folder.id)}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      icon={<MdFolder size={16} />}
      count={count}
      actions={
        <>
          <button
            ref={menuButton}
            aria-label={`Options for ${folder.name}`}
            onClick={() => setOpen((o) => !o)}
            className={`absolute right-1 grid h-6 w-6 place-items-center rounded hover:bg-black/10 focus:opacity-100 group-hover:opacity-100 ${
              open ? "opacity-100" : "opacity-0"
            }`}
          >
            <IoEllipsisHorizontal />
          </button>
          {open && (
            <FolderOptions folderId={folder.id} buttonRef={menuButton} onClose={close} />
          )}
        </>
      }
    >
      {folder.name}
    </Row>
  );
};

export default Folder;
