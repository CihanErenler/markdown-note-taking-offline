import { toast } from "react-toastify";
import { downloadBackup } from "./backup";
import { templates } from "./domain/templates";
import { printNote } from "./exportNote";
import { createNoteAndFocus, openModalFor, useNotesStore, useUiStore } from "./store";

export interface Command {
  id: string;
  label: string;
  run: () => void;
}

export const getCommands = (): Command[] => {
  const ui = useUiStore.getState();
  const notes = useNotesStore.getState();

  const goToFolders = notes.data.folders.map((folder) => ({
    id: `folder-${folder.id}`,
    label: `Go to folder: ${folder.name}`,
    run: () => notes.selectFolder(folder.id),
  }));

  const fromTemplates = templates.map((template) => ({
    id: `template-${template.id}`,
    label: `New ${template.label.toLowerCase()}`,
    run: () =>
      createNoteAndFocus({ title: template.title(new Date()), content: template.content }),
  }));

  return [
    { id: "new-note", label: "New note", run: () => createNoteAndFocus() },
    ...fromTemplates,
    { id: "new-folder", label: "New folder", run: () => openModalFor("create-folder") },
    {
      id: "theme",
      label: ui.theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      run: ui.toggleTheme,
    },
    { id: "focus", label: "Toggle focus mode", run: ui.toggleFocusMode },
    { id: "sidebar", label: "Toggle sidebar", run: ui.toggleSidebar },
    { id: "view-edit", label: "Show editor only", run: () => ui.setViewMode("edit") },
    { id: "view-split", label: "Show editor and preview", run: () => ui.setViewMode("split") },
    { id: "view-preview", label: "Show preview only", run: () => ui.setViewMode("preview") },
    {
      id: "export",
      label: "Export all notes",
      run: async () => {
        await downloadBackup(useNotesStore.getState().data);
        toast.success("Backup downloaded");
      },
    },
    { id: "trash", label: "Go to trash", run: notes.selectTrash },
    { id: "print", label: "Print or save note as PDF", run: printNote },
    { id: "settings", label: "Open settings", run: ui.openSettings },
    { id: "shortcuts", label: "Show keyboard shortcuts", run: ui.openShortcuts },
    ...goToFolders,
  ];
};
