import { memo, useCallback, useRef, useState } from "react";
import type { DragEvent } from "react";
import { BsPinFill, BsThreeDots } from "react-icons/bs";
import NoteActions from "./NoteActions";
import Highlight from "./Highlight";
import { matchingSnippet, timeAgo } from "../../domain/notes";
import { useNotesStore, useUiStore } from "../../store";
import type { Note } from "../../domain/types";
import { NOTE_DRAG_TYPE } from "../Folders/Folder";

interface NoteRowProps {
  note: Note;
  showFolder: boolean;
  query: string;
}

const NoteRow = ({ note, showFolder, query }: NoteRowProps) => {
  const selectNote = useNotesStore((s) => s.selectNote);
  const selected = useNotesStore((s) => s.selectedNoteId === note.id);
  const folderName = useNotesStore((s) =>
    showFolder ? s.data.folders.find((f) => f.id === note.folderId)?.name : undefined
  );
  const setSidebar = useUiStore((s) => s.setSidebar);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const open = () => {
    selectNote(note.id);
    if (window.matchMedia("(max-width: 1023px)").matches) setSidebar(false);
  };

  const startDrag = (e: DragEvent) => {
    e.dataTransfer.setData(NOTE_DRAG_TYPE, note.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const preview = matchingSnippet(note.content, query) || "No additional text";

  return (
    <li className="group relative">
      <button
        draggable
        data-note-id={note.id}
        onDragStart={startDrag}
        onClick={open}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(true);
        }}
        className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
          selected
            ? "border-accent/30 bg-accent-soft"
            : "border-transparent hover:border-line hover:bg-surface"
        }`}
      >
        <span className="flex items-center gap-1.5">
          {note.pinned && <BsPinFill size={11} className="shrink-0 text-mute" />}
          <span className="block truncate text-sm font-medium">
            <Highlight text={note.title} query={query} />
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-mute">
          <Highlight text={preview} query={query} />
        </span>
        <span className="mt-1 flex items-center gap-2 text-xs text-mute">
          <span>{timeAgo(note.updatedAt)}</span>
          {folderName && <span className="truncate font-medium">{folderName}</span>}
        </span>
      </button>
      <button
        ref={menuButton}
        aria-label={`Actions for ${note.title}`}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md border border-line bg-surface text-mute hover:text-text focus:opacity-100 group-hover:opacity-100 ${
          menuOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <BsThreeDots size={14} />
      </button>
      {menuOpen && <NoteActions note={note} buttonRef={menuButton} onClose={closeMenu} />}
    </li>
  );
};

export default memo(NoteRow);
