import { useUiStore } from "../../store";
import type { ViewMode } from "../../store/uiStore";

const MODES: [ViewMode, string][] = [
  ["edit", "Edit"],
  ["split", "Split"],
  ["preview", "Preview"],
];

const ViewModeSwitch = () => {
  const viewMode = useUiStore((s) => s.viewMode);
  const setViewMode = useUiStore((s) => s.setViewMode);

  return (
    <div role="group" aria-label="View mode" className="flex rounded-md border border-line bg-paper p-0.5">
      {MODES.map(([mode, label]) => (
        <button
          key={mode}
          aria-pressed={viewMode === mode}
          onClick={() => setViewMode(mode)}
          className={`${mode === "split" ? "hidden md:block" : ""} rounded px-2.5 py-1 text-xs font-medium transition-colors ${
            viewMode === mode ? "bg-surface text-text shadow-sm" : "text-mute hover:text-text"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ViewModeSwitch;
