import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { BsFiles, BsDownload, BsFolderSymlink, BsPencil, BsPin, BsPinFill, BsTrash } from "react-icons/bs";
import { downloadNoteHtml } from "../../exportNote";
import { createNoteAndFocus, useNotesStore, useUiStore } from "../../store";
import { deleteNoteById } from "../../undo";
import type { Note } from "../../domain/types";

interface NoteActionsProps {
  note: Note;
  buttonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}

const Item = ({ icon, onClick, danger = false, children }: {
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) => (
  <button
    role="menuitem"
    className={`menu-item flex items-center gap-2 ${danger ? "text-danger" : ""}`}
    onClick={onClick}
  >
    {icon}
    {children}
  </button>
);

const NoteActions = ({ note, buttonRef, onClose }: NoteActionsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const data = useNotesStore((s) => s.data);
  const selectNote = useNotesStore((s) => s.selectNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const duplicateNote = useNotesStore((s) => s.duplicateNote);
  const moveNote = useNotesStore((s) => s.moveNote);
  const requestTitleFocus = useUiStore((s) => s.requestTitleFocus);

  const otherFolders = data.folders.filter((folder) => folder.id !== note.folderId);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !buttonRef.current?.contains(target)) onClose();
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [buttonRef, onClose]);

  const run = (action: () => void) => () => {
    onClose();
    action();
  };

  return (
    <div ref={ref} role="menu" aria-label={`Actions for ${note.title}`} className="popover right-2 top-9 w-52 py-1">
      <Item
        icon={note.pinned ? <BsPinFill size={13} /> : <BsPin size={13} />}
        onClick={run(() => togglePin(note.id))}
      >
        {note.pinned ? "Unpin" : "Pin to top"}
      </Item>
      <Item
        icon={<BsPencil size={13} />}
        onClick={run(() => {
          selectNote(note.id);
          requestTitleFocus();
        })}
      >
        Rename
      </Item>
      <Item icon={<BsFiles size={13} />} onClick={run(() => duplicateNote(note.id))}>
        Duplicate
      </Item>
      <Item icon={<BsDownload size={13} />} onClick={run(() => downloadNoteHtml(note, data))}>
        Export as HTML
      </Item>

      {otherFolders.length > 0 && (
        <div className="my-1 border-t border-line pt-1">
          <p className="px-3 py-1 text-xs text-mute">Move to folder</p>
          <div className="max-h-40 overflow-y-auto">
            {otherFolders.map((folder) => (
              <Item
                key={folder.id}
                icon={<BsFolderSymlink size={13} />}
                onClick={run(() => moveNote(note.id, folder.id))}
              >
                <span className="truncate">{folder.name}</span>
              </Item>
            ))}
          </div>
        </div>
      )}

      <div className="mt-1 border-t border-line pt-1">
        <Item danger icon={<BsTrash size={13} />} onClick={run(() => deleteNoteById(note.id))}>
          Delete
        </Item>
      </div>
    </div>
  );
};

export default NoteActions;
