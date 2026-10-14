import type { ReactNode } from "react";
import type { EditorView } from "@codemirror/view";
import {
  BsBlockquoteLeft,
  BsCode,
  BsLink45Deg,
  BsListCheck,
  BsListUl,
  BsTable,
  BsTypeBold,
  BsTypeH2,
  BsTypeItalic,
} from "react-icons/bs";
import { insertText, prefixLine, TABLE_TEMPLATE, wrapSelection } from "./formatting";

interface ToolbarButton {
  label: string;
  icon: ReactNode;
  run: (view: EditorView) => void;
}

const buttons: ToolbarButton[] = [
  { label: "Bold", icon: <BsTypeBold size={18} />, run: (view) => wrapSelection(view, "**") },
  { label: "Italic", icon: <BsTypeItalic size={16} />, run: (view) => wrapSelection(view, "_") },
  { label: "Heading", icon: <BsTypeH2 size={18} />, run: (view) => prefixLine(view, "## ") },
  { label: "Bulleted list", icon: <BsListUl size={16} />, run: (view) => prefixLine(view, "- ") },
  { label: "Task list", icon: <BsListCheck size={17} />, run: (view) => prefixLine(view, "- [ ] ") },
  { label: "Quote", icon: <BsBlockquoteLeft size={16} />, run: (view) => prefixLine(view, "> ") },
  { label: "Code", icon: <BsCode size={18} />, run: (view) => wrapSelection(view, "`") },
  {
    label: "Link",
    icon: <BsLink45Deg size={18} />,
    run: (view) => wrapSelection(view, "[", "](https://)", "link text"),
  },
  { label: "Table", icon: <BsTable size={15} />, run: (view) => insertText(view, TABLE_TEMPLATE) },
];

const EditorToolbar = ({ view }: { view: EditorView | null }) => (
  <div
    role="toolbar"
    aria-label="Formatting"
    className="flex shrink-0 items-center gap-0.5 border-b border-line bg-paper px-2 py-1"
  >
    {buttons.map(({ label, icon, run }) => (
      <button
        key={label}
        title={label}
        aria-label={label}
        disabled={!view}
        onClick={() => view && run(view)}
        className="grid h-7 w-7 place-items-center rounded text-mute transition-colors hover:bg-surface hover:text-text disabled:opacity-40"
      >
        {icon}
      </button>
    ))}
  </div>
);

export default EditorToolbar;
