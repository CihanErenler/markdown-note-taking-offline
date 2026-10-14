import { useEffect, useRef } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { useNotesStore, useUiStore } from "../../store";
import type { Note } from "../../domain/types";

const TitleField = ({ note }: { note: Note }) => {
  const input = useRef<HTMLInputElement>(null);
  const renameNote = useNotesStore((s) => s.renameNote);
  const focusTitle = useUiStore((s) => s.focusTitle);
  const clearTitleFocus = useUiStore((s) => s.clearTitleFocus);

  useEffect(() => {
    if (!focusTitle) return;
    input.current?.focus();
    input.current?.select();
    clearTitleFocus();
  }, [focusTitle, note.id, clearTitleFocus]);

  const commit = (e: FocusEvent<HTMLInputElement>) => {
    if (!renameNote(note.id, e.target.value)) e.target.value = note.title;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      e.currentTarget.value = note.title;
      e.currentTarget.blur();
    }
  };

  return (
    <input
      key={note.id}
      ref={input}
      defaultValue={note.title}
      onBlur={commit}
      onKeyDown={onKeyDown}
      aria-label="Note title"
      className="-mx-1 w-full truncate rounded bg-transparent px-1 font-display tracking-tight text-lg font-semibold leading-tight outline-none hover:bg-surface focus:bg-surface focus:ring-2 focus:ring-accent/30"
    />
  );
};

export default TitleField;
