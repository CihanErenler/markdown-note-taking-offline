import { IoCloseCircle } from "react-icons/io5";
import { useNotesStore } from "../../store";

interface TagProps {
  id: string;
  tagName: string;
  color: string;
}

const Tag = ({ id, tagName, color }: TagProps) => {
  const noteId = useNotesStore((s) => s.selectedNoteId);
  const removeTagFromNote = useNotesStore((s) => s.removeTagFromNote);

  return (
    <span className="flex h-[22px] min-w-fit select-none items-center gap-1.5 rounded-full bg-accent-soft pl-2 pr-1 text-[11px] font-medium text-text">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {tagName}
      <button
        onClick={() => noteId && removeTagFromNote(noteId, id)}
        aria-label={`Remove tag ${tagName}`}
        className="grid place-items-center rounded-full text-mute hover:text-danger"
      >
        <IoCloseCircle size={16} />
      </button>
    </span>
  );
};

export default Tag;
