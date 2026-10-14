import { useEffect, useRef } from "react";
import ShortcutKey from "./ShortcutKey";
import InnerModal from "./InnerModal";
import { useUiStore } from "../store";

const mod = /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl";

interface ShortcutGroup {
  title: string;
  items: [label: string, keys: string[]][];
}

const groups: ShortcutGroup[] = [
  {
    title: "Writing",
    items: [
      ["Search notes", [mod, "K"]],
      ["Edit only", ["Ctrl", "Alt", "1"]],
      ["Preview only", ["Ctrl", "Alt", "2"]],
      ["Toggle sidebar", ["Ctrl", "Alt", "H"]],
      ["Focus mode", ["Ctrl", "Alt", "F"]],
    ],
  },
  {
    title: "Files and folders",
    items: [
      ["New note", ["Alt", "N"]],
      ["New folder", ["Ctrl", "Alt", "N"]],
      ["Rename folder", ["Ctrl", "Alt", "R"]],
      ["Delete folder", ["Shift", "Ctrl", "Delete"]],
    ],
  },
];

const Shortcuts = () => {
  const closeShortcutsModal = useUiStore((s) => s.closeShortcuts);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempElem = element.current;
    const handleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains("modal")) closeShortcutsModal();
    };
    tempElem?.addEventListener("click", handleClick);
    return () => tempElem?.removeEventListener("click", handleClick);
  }, [closeShortcutsModal]);

  return (
    <div className="modal backdrop" ref={element}>
      <InnerModal>
        <h2 className="mb-5 font-display tracking-tight text-xl font-semibold">Keyboard shortcuts</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title}>
              <h3 className="mb-2 border-b border-line pb-1 text-sm font-semibold text-mute">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.items.map(([label, keys]) => (
                  <li key={label} className="flex items-center justify-between gap-3 text-sm">
                    <span>{label}</span>
                    <span className="flex gap-1">
                      {keys.map((key) => (
                        <ShortcutKey key={key}>{key}</ShortcutKey>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </InnerModal>
    </div>
  );
};

export default Shortcuts;
