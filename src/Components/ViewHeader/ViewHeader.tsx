import { BsFullscreen, BsLayoutSidebar } from "react-icons/bs";
import Tags from "./Tags";
import TitleField from "./TitleField";
import ViewModeSwitch from "./ViewModeSwitch";
import SaveStatus from "./SaveStatus";
import FileOptions from "./FileOptions";
import IconButton from "../IconButton";
import { useNotesStore, useUiStore, selectSelectedNote } from "../../store";

const ViewHeader = () => {
  const note = useNotesStore(selectSelectedNote);
  const sidebarVisible = useUiStore((s) => s.sidebarVisible);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleFocusMode = useUiStore((s) => s.toggleFocusMode);

  return (
    <nav className="flex w-full shrink-0 flex-col gap-2 border-b border-line bg-paper px-4 py-2 md:h-16 md:flex-row md:items-center md:justify-between md:gap-4 md:py-0 print:hidden">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {!sidebarVisible && (
          <IconButton
            label="Show sidebar"
            shortcut="Ctrl+Alt+H"
            action={toggleSidebar}
            className="text-mute hover:bg-surface hover:text-text"
          >
            <BsLayoutSidebar size={16} />
          </IconButton>
        )}
        {note && (
          <div className="min-w-0 flex-1">
            <TitleField note={note} />
            <Tags note={note} />
          </div>
        )}
      </div>
      {note && (
        <div className="flex shrink-0 items-center justify-between gap-3 md:justify-end">
          <SaveStatus />
          <ViewModeSwitch />
          <IconButton
            label="Focus mode"
            shortcut="Ctrl+Alt+F"
            action={toggleFocusMode}
            className="text-mute hover:bg-surface hover:text-text"
          >
            <BsFullscreen size={14} />
          </IconButton>
          <FileOptions />
        </div>
      )}
    </nav>
  );
};

export default ViewHeader;
