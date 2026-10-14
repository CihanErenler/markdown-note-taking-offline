import { useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Tag from "./Tag";
import TagPicker from "./TagPicker";
import { useNotesStore } from "../../store";
import type { Note } from "../../domain/types";

const Tags = ({ note }: { note: Note }) => {
  const [open, setOpen] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const tags = useNotesStore((s) => s.data.tags);
  const noteTags = tags.filter((tag) => note.tagIds.includes(tag.id));

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!row.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={row} className="relative mt-1 flex flex-wrap items-center gap-1.5">
      {noteTags.map(({ id, name, color }) => (
        <Tag key={id} id={id} tagName={name} color={color} />
      ))}
      <button
        aria-label="Add tag"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-[22px] items-center gap-1 rounded-full border border-dashed border-mute/60 px-2 text-[11px] font-medium text-mute transition-colors hover:border-accent hover:text-accent"
      >
        <BsPlusLg size={9} />
        {noteTags.length === 0 && "Add tag"}
      </button>
      {open && <TagPicker note={note} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Tags;
