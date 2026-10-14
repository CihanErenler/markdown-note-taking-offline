import InnerModal from "./InnerModal";
import { useUiStore } from "../store";
import type { Settings } from "../store/uiStore";

interface ChoiceProps<T extends string> {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}

const Choice = <T extends string>({ label, value, options, onChange }: ChoiceProps<T>) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm">{label}</span>
    <div role="group" aria-label={label} className="flex rounded-md border border-line p-0.5">
      {options.map(([option, text]) => (
        <button
          key={option}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
            value === option ? "bg-accent text-white" : "text-mute hover:text-text"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  </div>
);

const SettingsPanel = () => {
  const settings = useUiStore((s) => s.settings);
  const updateSettings = useUiStore((s) => s.updateSettings);
  const close = useUiStore((s) => s.closeSettings);

  return (
    <div className="backdrop" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <InnerModal>
        <h2 className="mb-5 font-display tracking-tight text-xl font-semibold">Settings</h2>
        <div className="space-y-4">
          <Choice<Settings["fontSize"]>
            label="Text size"
            value={settings.fontSize}
            options={[["small", "Small"], ["medium", "Medium"], ["large", "Large"]]}
            onChange={(fontSize) => updateSettings({ fontSize })}
          />
          <Choice<Settings["contentWidth"]>
            label="Preview width"
            value={settings.contentWidth}
            options={[["narrow", "Narrow"], ["wide", "Wide"]]}
            onChange={(contentWidth) => updateSettings({ contentWidth })}
          />
          <Choice<"on" | "off">
            label="Line numbers"
            value={settings.lineNumbers ? "on" : "off"}
            options={[["on", "On"], ["off", "Off"]]}
            onChange={(value) => updateSettings({ lineNumbers: value === "on" })}
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={close}
            className="h-10 rounded-lg bg-accent px-5 text-sm font-medium text-white hover:bg-accent-strong"
          >
            Done
          </button>
        </div>
      </InnerModal>
    </div>
  );
};

export default SettingsPanel;
