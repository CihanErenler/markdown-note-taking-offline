import { useRef, useEffect, useState } from "react";
import {
  BsClockHistory,
  BsDownload,
  BsInfoCircle,
  BsPin,
  BsPinFill,
  BsTrash,
} from "react-icons/bs";
import IconButton from "../IconButton";
import { snippet, timeAgo } from "../../domain/notes";
import { downloadNoteHtml, printNote } from "../../exportNote";
import { useNotesStore, selectSelectedNote } from "../../store";
import { deleteSelectedNote } from "../../undo";

type Panel = "info" | "history" | "export" | null;

const dateOptions: Intl.DateTimeFormatOptions = {
  hourCycle: "h23",
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const iconClass = "text-mute hover:bg-surface hover:text-text";

const FileOptions = () => {
  const [panel, setPanel] = useState<Panel>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const data = useNotesStore((s) => s.data);
  const note = useNotesStore(selectSelectedNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const restoreVersion = useNotesStore((s) => s.restoreVersion);

  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setPanel(null);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    document.addEventListener("click", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (!note) return null;

  const togglePanel = (name: Exclude<Panel, null>) =>
    setPanel(panel === name ? null : name);

  const versions = note.versions ?? [];

  return (
    <div className="relative flex items-center" ref={wrapper}>
      <IconButton
        label={note.pinned ? "Unpin note" : "Pin note"}
        action={() => togglePin(note.id)}
        className={iconClass}
      >
        {note.pinned ? <BsPinFill size={15} /> : <BsPin size={15} />}
      </IconButton>
      <IconButton label="File info" action={() => togglePanel("info")} className={iconClass}>
        <BsInfoCircle size={17} />
      </IconButton>
      <IconButton label="Version history" action={() => togglePanel("history")} className={iconClass}>
        <BsClockHistory size={16} />
      </IconButton>
      <IconButton label="Export note" action={() => togglePanel("export")} className={iconClass}>
        <BsDownload size={16} />
      </IconButton>
      <IconButton
        label="Delete file"
        action={deleteSelectedNote}
        className="text-mute hover:bg-surface hover:text-danger"
      >
        <BsTrash size={16} />
      </IconButton>

      {panel === "info" && (
        <div className="popover right-0 top-9 w-80">
          <h3 className="border-b border-line px-3 py-2 text-sm font-medium">Document</h3>
          <dl className="space-y-1 px-3 py-2 text-sm text-mute">
            <div className="flex justify-between gap-3">
              <dt className="font-medium text-text">Created</dt>
              <dd>{new Date(note.createdAt).toLocaleDateString("en-US", dateOptions)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-medium text-text">Modified</dt>
              <dd>{new Date(note.updatedAt).toLocaleDateString("en-US", dateOptions)}</dd>
            </div>
          </dl>
        </div>
      )}

      {panel === "history" && (
        <div className="popover right-0 top-9 w-80">
          <h3 className="border-b border-line px-3 py-2 text-sm font-medium">Earlier versions</h3>
          {versions.length === 0 ? (
            <p className="px-3 py-4 text-sm text-mute">
              No earlier versions yet. A version is saved when you start editing this note.
            </p>
          ) : (
            <ul className="max-h-72 overflow-y-auto p-1">
              {versions.map((version, index) => (
                <li key={version.savedAt} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-paper">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{snippet(version.content) || "Empty"}</p>
                    <p className="text-xs text-mute">{timeAgo(version.savedAt)}</p>
                  </div>
                  <button
                    className="shrink-0 text-xs font-medium text-focus hover:underline"
                    onClick={() => {
                      restoreVersion(note.id, index);
                      setPanel(null);
                    }}
                  >
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {panel === "export" && (
        <div className="popover right-0 top-9 w-56 py-1">
          <button
            className="menu-item"
            onClick={() => {
              setPanel(null);
              downloadNoteHtml(note, data);
            }}
          >
            Download as HTML
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setPanel(null);
              printNote();
            }}
          >
            Print or save as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FileOptions;
