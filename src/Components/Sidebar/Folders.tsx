import { BsGear, BsLayoutSidebar, BsKeyboard, BsMoon, BsSun } from "react-icons/bs";
import Logo from "../Logo";
import FolderTree from "../Folders/FolderTree";
import BackupButtons from "./BackupButtons";
import IconButton from "../IconButton";
import { Link } from "react-router-dom";
import { useUiStore } from "../../store";

const iconClass = "text-fog hover:bg-ink-soft hover:text-white";

const Rail = () => {
  const openShortcuts = useUiStore((s) => s.openShortcuts);
  const openSettings = useUiStore((s) => s.openSettings);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);

  return (
    <div className="flex h-screen w-52 shrink-0 flex-col bg-ink p-3">
      <div className="flex items-center justify-between pb-5 pl-2">
        <Link to="/">
          <Logo className="text-white" size={24} />
        </Link>
        <IconButton label="Hide sidebar" shortcut="Ctrl+Alt+H" action={toggleSidebar} className={iconClass}>
          <BsLayoutSidebar size={15} />
        </IconButton>
      </div>
      <FolderTree />
      <div className="mt-3 flex flex-col border-t border-ink-raised pt-3">
        <BackupButtons />
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fog transition-colors hover:bg-ink-soft hover:text-white"
        >
          {theme === "dark" ? <BsSun size={14} /> : <BsMoon size={14} />}
          {theme === "dark" ? "Light theme" : "Dark theme"}
        </button>
        <button
          onClick={openSettings}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fog transition-colors hover:bg-ink-soft hover:text-white"
        >
          <BsGear size={14} />
          Settings
        </button>
        <button
          onClick={openShortcuts}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fog transition-colors hover:bg-ink-soft hover:text-white"
        >
          <BsKeyboard size={14} />
          Keyboard shortcuts
        </button>
      </div>
    </div>
  );
};

export default Rail;
