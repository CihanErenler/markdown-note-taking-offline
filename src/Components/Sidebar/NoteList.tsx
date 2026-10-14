import { useState } from "react";
import type { KeyboardEvent } from "react";
import { BsPlusLg } from "react-icons/bs";
import NoteRow from "./NoteRow";
import TrashList from "./TrashList";
import TemplateMenu from "./TemplateMenu";
import Button from "../Button";
import { searchNotes, withPinnedFirst } from "../../domain/notes";
import {
  useNotesStore,
  useUiStore,
  selectVisibleNotes,
  openModalFor,
  createNoteAndFocus,
} from "../../store";

interface EmptyProps {
  message: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const Empty = ({ message, hint, actionLabel, onAction }: EmptyProps) => (
  <div className="px-4 pt-10 text-center">
    <p className="text-sm text-mute">{message}</p>
    {hint && <p className="mt-1 text-xs text-mute">{hint}</p>}
    {actionLabel && (
      <Button variant="secondary" className="mx-auto mt-4" action={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

const NoteList = () => {
  const [query, setQuery] = useState("");
  const data = useNotesStore((s) => s.data);
  const view = useNotesStore((s) => s.view);
  const selectedNoteId = useNotesStore((s) => s.selectedNoteId);
  const selectNote = useNotesStore((s) => s.selectNote);
  const viewNotes = useNotesStore(selectVisibleNotes);
  const listWidth = useUiStore((s) => s.listWidth);
  const trashCount = useNotesStore((s) => s.data.trash?.length ?? 0);
  const emptyTrash = useNotesStore((s) => s.emptyTrash);
  const inTrash = view?.type === "trash";

  const searching = query.trim() !== "";
  const notes = withPinnedFirst(searching ? searchNotes(data, query) : viewNotes);
  const hasFolders = data.folders.length > 0;

  const title = searching
    ? "Search results"
    : view?.type === "all"
    ? "All files"
    : view?.type === "folder"
    ? data.folders.find((f) => f.id === view.id)?.name
    : view?.type === "tag"
    ? data.tags.find((t) => t.id === view.id)?.name
    : inTrash
    ? "Trash"
    : "Notes";

  const showFolder = searching || view?.type !== "folder";

  const moveSelection = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();

    const current = notes.findIndex((note) => note.id === selectedNoteId);
    const next = notes[current + (e.key === "ArrowDown" ? 1 : -1)];
    if (!next) return;

    selectNote(next.id);
    document.querySelector<HTMLElement>(`[data-note-id="${next.id}"]`)?.focus();
  };

  return (
    <section
      style={{ width: listWidth }}
      className="flex h-screen shrink-0 flex-col bg-paper"
    >
      <div className="px-4 pb-3 pt-5">
        <h2 className="truncate font-display text-xl font-semibold leading-tight tracking-tight">
          {title}
        </h2>
        <p className="text-xs text-mute">
          {inTrash ? trashCount : notes.length}{" "}
          {(inTrash ? trashCount : notes.length) === 1 ? "note" : "notes"}
        </p>
      </div>
      <div className="px-3 pb-2">
        {inTrash ? (
          <Button
            variant="secondary"
            className="h-8 w-full text-sm"
            disabled={trashCount === 0}
            action={emptyTrash}
          >
            Empty trash
          </Button>
        ) : (
          <div className="flex gap-px" title="New note (Alt+N)">
            <Button
              variant="small"
              className="flex-1 whitespace-nowrap"
              disabled={!hasFolders}
              action={() => createNoteAndFocus()}
            >
              <BsPlusLg size={11} />
              New note
            </Button>
            <TemplateMenu disabled={!hasFolders} />
          </div>
        )}
      </div>
      <div className={inTrash ? "hidden" : "px-3 pb-2"}>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search all files"
          aria-label="Search all files"
          className="field h-9"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4" onKeyDown={moveSelection}>
        {inTrash ? (
          <TrashList />
        ) : notes.length > 0 ? (
          <ul className="space-y-0.5">
            {notes.map((note) => (
              <NoteRow key={note.id} note={note} showFolder={showFolder} query={query} />
            ))}
          </ul>
        ) : searching ? (
          <Empty
            message={`No notes match "${query.trim()}"`}
            hint="Check the spelling or try a shorter word."
            actionLabel="Clear search"
            onAction={() => setQuery("")}
          />
        ) : !hasFolders ? (
          <Empty
            message="Create a folder to start writing"
            actionLabel="Create a folder"
            onAction={() => openModalFor("create-folder")}
          />
        ) : (
          <Empty
            message="Nothing here yet"
            actionLabel="New note"
            onAction={() => createNoteAndFocus()}
          />
        )}
      </div>
    </section>
  );
};

export default NoteList;
