
import { useEffect } from "react";
import PreviewContainer from "../Components/PreviewContainer";
import Sidebar from "../Components/Sidebar/Sidebar";
import Modal from "../Components/Modal";
import Shortcuts from "../Components/Shortcuts";
import SettingsPanel from "../Components/SettingsPanel";
import QuickSwitcher from "../Components/QuickSwitcher";
import { useUiStore, openModalFor, createNoteAndFocus } from "../store";
import { deleteCurrentFolder } from "../undo";
import { remindToBackup } from "../backupReminder";

const modKey = (e: KeyboardEvent) => (e.metaKey || e.ctrlKey) && !e.altKey;
const ctrlAlt = (e: KeyboardEvent, code: string) => e.ctrlKey && e.altKey && e.code === code;

const switcherKeys = (e: KeyboardEvent) => modKey(e) && e.code === "KeyK";
const editorOnlyKeys = (e: KeyboardEvent) => ctrlAlt(e, "Digit1");
const previewOnlyKeys = (e: KeyboardEvent) => ctrlAlt(e, "Digit2");
const focusModeKeys = (e: KeyboardEvent) => ctrlAlt(e, "KeyF");
const toggleSidebarKeys = (e: KeyboardEvent) => ctrlAlt(e, "KeyH");
const createFolderKeys = (e: KeyboardEvent) => ctrlAlt(e, "KeyN");
const createNoteKeys = (e: KeyboardEvent) => e.altKey && !e.ctrlKey && e.code === "KeyN";
const renameFolderKeys = (e: KeyboardEvent) => ctrlAlt(e, "KeyR");
const deleteFolderKeys = (e: KeyboardEvent) => e.shiftKey && e.ctrlKey && e.key === "Delete";

const UserPage = () => {
  const modalOpen = useUiStore((s) => s.modal !== null);
  const shortcutsOpen = useUiStore((s) => s.shortcutsOpen);
  const switcherOpen = useUiStore((s) => s.switcherOpen);
  const settingsOpen = useUiStore((s) => s.settingsOpen);
  const sidebarVisible = useUiStore((s) => s.sidebarVisible);
  const focusMode = useUiStore((s) => s.focusMode);

  useEffect(() => {
    const handleKeypress = (e: KeyboardEvent) => {
      const ui = useUiStore.getState();

      if (e.key === "Escape") {
        ui.closeModal();
        ui.closeShortcuts();
        ui.closeSwitcher();
        ui.closeSettings();
        ui.exitFocusMode();
        return;
      }
      if (editorOnlyKeys(e)) return ui.toggleViewMode("edit");
      if (previewOnlyKeys(e)) return ui.toggleViewMode("preview");
      if (toggleSidebarKeys(e)) return ui.toggleSidebar();
      if (focusModeKeys(e)) return ui.toggleFocusMode();
      if (createFolderKeys(e)) return openModalFor("create-folder");
      if (createNoteKeys(e)) return createNoteAndFocus();
      if (renameFolderKeys(e)) return openModalFor("edit-folder");
      if (deleteFolderKeys(e)) return deleteCurrentFolder();
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (switcherKeys(e)) {
        e.preventDefault();
        useUiStore.getState().openSwitcher();
      }
      if (deleteFolderKeys(e)) e.preventDefault();
    };

    remindToBackup();

    document.addEventListener("keyup", handleKeypress);
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keyup", handleKeypress);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <section className="relative flex print:block">
      {sidebarVisible && !focusMode ? <Sidebar /> : ""}
      <PreviewContainer />
      {modalOpen ? <Modal /> : ""}
      {shortcutsOpen ? <Shortcuts /> : ""}
      {switcherOpen ? <QuickSwitcher /> : ""}
      {settingsOpen ? <SettingsPanel /> : ""}
    </section>
  );
};

export default UserPage;
