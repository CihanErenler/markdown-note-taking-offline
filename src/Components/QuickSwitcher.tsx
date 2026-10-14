import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { getCommands } from "../commands";
import { searchNotes } from "../domain/notes";
import { useNotesStore, useUiStore } from "../store";

const LIMIT = 8;

interface Item {
  id: string;
  title: string;
  detail: string;
  run: () => void;
}

const QuickSwitcher = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const data = useNotesStore((s) => s.data);
  const openNote = useNotesStore((s) => s.openNote);
  const close = useUiStore((s) => s.closeSwitcher);

  const commandMode = query.startsWith(">");

  const getItems = (): Item[] => {
    if (commandMode) {
      const wanted = query.slice(1).trim().toLowerCase();
      return getCommands()
        .filter((command) => command.label.toLowerCase().includes(wanted))
        .map((command) => ({
          id: command.id,
          title: command.label,
          detail: "Command",
          run: command.run,
        }));
    }

    const notes = query.trim() ? searchNotes(data, query) : data.notes;
    return notes.map((note) => ({
      id: note.id,
      title: note.title,
      detail: data.folders.find((f) => f.id === note.folderId)?.name ?? "",
      run: () => openNote(note.id),
    }));
  };

  const items = getItems().slice(0, LIMIT);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const pick = (item?: Item) => {
    if (!item) return;
    close();
    item.run();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      pick(items[active]);
    }
  };

  return (
    <div
      className="backdrop items-start pt-[15vh]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-label="Search notes"
        className="w-full max-w-lg animate-pop overflow-hidden rounded-xl bg-surface shadow-2xl"
      >
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search notes, or type > for commands"
          aria-label="Search notes or run a command"
          className="h-12 w-full border-b border-line bg-transparent px-4 text-sm outline-none"
        />
        <ul className="max-h-80 overflow-y-auto p-2">
          {items.map((item, i) => (
            <li key={item.id}>
              <button
                onClick={() => pick(item)}
                onMouseMove={() => setActive(i)}
                className={`w-full rounded-md px-3 py-2 text-left ${
                  i === active ? "bg-accent-soft" : ""
                }`}
              >
                <span className="block truncate text-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs text-mute">{item.detail}</span>
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-mute">
              {commandMode ? "No commands match" : "No notes found"}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default QuickSwitcher;
