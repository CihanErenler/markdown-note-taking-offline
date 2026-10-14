import { useState } from "react";
import type { KeyboardEvent } from "react";
import { BsCheck2, BsPencil, BsPlusLg } from "react-icons/bs";
import TagEditor from "./TagEditor";
import tagColors from "../../colors";
import { findTagByName } from "../../domain/notes";
import { useNotesStore } from "../../store";
import type { Note } from "../../domain/types";

interface TagPickerProps {
  note: Note;
  onClose: () => void;
}

const TagPicker = ({ note, onClose }: TagPickerProps) => {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const data = useNotesStore((s) => s.data);
  const createTag = useNotesStore((s) => s.createTag);
  const addTagToNote = useNotesStore((s) => s.addTagToNote);
  const removeTagFromNote = useNotesStore((s) => s.removeTagFromNote);

  const name = query.trim();
  const shownTags = data.tags.filter((tag) =>
    tag.name.toLowerCase().includes(name.toLowerCase())
  );
  const exactMatch = findTagByName(data, name);
  const canCreate = name !== "" && !exactMatch;

  const toggle = (tagId: string) => {
    if (note.tagIds.includes(tagId)) {
      removeTagFromNote(note.id, tagId);
    } else {
      addTagToNote(note.id, tagId);
    }
  };

  const create = () => {
    const color = tagColors[data.tags.length % tagColors.length];
    const id = createTag(name, color);
    if (id) addTagToNote(note.id, id);
    setQuery("");
  };

  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Enter" || name === "") return;
    if (exactMatch) {
      toggle(exactMatch.id);
      setQuery("");
    } else {
      create();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (editingId) {
      setEditingId(null);
    } else {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Tags"
      onKeyDown={handleKeyDown}
      className="popover left-0 top-8 w-72 origin-top-left"
    >
      <div className="border-b border-line p-2">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Find or create a tag"
          aria-label="Find or create a tag"
          className="field h-8"
        />
      </div>

      <ul className="max-h-72 overflow-y-auto p-1">
        {shownTags.map((tag) => (
          <li key={tag.id}>
            {editingId === tag.id ? (
              <TagEditor tag={tag} onDone={() => setEditingId(null)} />
            ) : (
              <div className="group flex items-center rounded-md hover:bg-paper">
                <button
                  onClick={() => toggle(tag.id)}
                  aria-pressed={note.tagIds.includes(tag.id)}
                  className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm"
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 truncate">{tag.name}</span>
                  {note.tagIds.includes(tag.id) && <BsCheck2 size={16} />}
                </button>
                <button
                  onClick={() => setEditingId(tag.id)}
                  aria-label={`Edit tag ${tag.name}`}
                  className="mr-1 grid h-6 w-6 place-items-center rounded text-mute opacity-0 hover:text-text focus:opacity-100 group-hover:opacity-100"
                >
                  <BsPencil size={12} />
                </button>
              </div>
            )}
          </li>
        ))}

        {canCreate && (
          <li>
            <button
              onClick={create}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-paper"
            >
              <BsPlusLg size={11} />
              <span className="truncate">Create "{name}"</span>
            </button>
          </li>
        )}

        {shownTags.length === 0 && !canCreate && (
          <li className="px-2 py-3 text-center text-sm text-mute">
            No tags yet. Type a name to create one.
          </li>
        )}
      </ul>
    </div>
  );
};

export default TagPicker;
