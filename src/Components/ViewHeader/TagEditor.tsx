import { useState } from "react";
import { toast } from "react-toastify";
import tagColors from "../../colors";
import { useNotesStore } from "../../store";
import type { Tag } from "../../domain/types";

interface TagEditorProps {
  tag: Tag;
  onDone: () => void;
}

const TagEditor = ({ tag, onDone }: TagEditorProps) => {
  const [name, setName] = useState(tag.name);
  const [color, setColor] = useState(tag.color);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateTag = useNotesStore((s) => s.updateTag);
  const deleteTag = useNotesStore((s) => s.deleteTag);
  const noteCount = useNotesStore(
    (s) => s.data.notes.filter((note) => note.tagIds.includes(tag.id)).length
  );

  const save = () => {
    if (updateTag(tag.id, name, color)) {
      onDone();
    } else {
      toast.warn("Enter a name that no other tag uses");
    }
  };

  const remove = () => {
    deleteTag(tag.id);
    toast.success(`Tag "${tag.name}" deleted`);
  };

  return (
    <div className="space-y-2 rounded-md bg-paper p-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        aria-label="Tag name"
        className="field h-8"
      />
      <div className="flex flex-wrap gap-1.5">
        {tagColors.map((option) => (
          <button
            key={option}
            aria-label={`Color ${option}`}
            aria-pressed={color === option}
            onClick={() => setColor(option)}
            className={`h-5 w-5 rounded-full ${
              color === option ? "ring-2 ring-text ring-offset-2 ring-offset-paper" : ""
            }`}
            style={{ backgroundColor: option }}
          />
        ))}
      </div>

      {confirmDelete ? (
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-danger">
            Remove from {noteCount} {noteCount === 1 ? "note" : "notes"}?
          </span>
          <span className="flex gap-1">
            <button className="rounded px-2 py-1 text-mute hover:text-text" onClick={() => setConfirmDelete(false)}>
              Keep
            </button>
            <button className="rounded bg-danger px-2 py-1 text-white" onClick={remove}>
              Delete
            </button>
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs">
          <button className="rounded px-2 py-1 text-danger hover:bg-surface" onClick={() => setConfirmDelete(true)}>
            Delete tag
          </button>
          <span className="flex gap-1">
            <button className="rounded px-2 py-1 text-mute hover:text-text" onClick={onDone}>
              Cancel
            </button>
            <button className="rounded bg-accent px-2 py-1 text-white" onClick={save}>
              Save
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

export default TagEditor;
