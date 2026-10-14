import { create } from "zustand";

export type ModalMode = "create-folder" | "edit-folder";
export type ViewMode = "edit" | "split" | "preview";
export type Theme = "light" | "dark";
export type SaveStatus = "saving" | "saved" | "failed";

export interface Settings {
  fontSize: "small" | "medium" | "large";
  contentWidth: "narrow" | "wide";
  lineNumbers: boolean;
}

export const defaultSettings: Settings = {
  fontSize: "medium",
  contentWidth: "narrow",
  lineNumbers: true,
};

export const MIN_LIST_WIDTH = 240;
export const MAX_LIST_WIDTH = 480;
export type ScrollSource = "edit" | "preview" | null;

interface ModalState {
  mode: ModalMode;
  value: string;
}

interface UiState {
  modal: ModalState | null;
  shortcutsOpen: boolean;
  switcherOpen: boolean;
  sidebarVisible: boolean;
  viewMode: ViewMode;
  theme: Theme;
  focusTitle: boolean;
  saveStatus: SaveStatus;
  focusMode: boolean;
  listWidth: number;
  settings: Settings;
  settingsOpen: boolean;
  scrollPercentage: number;
  scrollLine: number;
  scrollingView: ScrollSource;

  openModal: (mode: ModalMode, value?: string) => void;
  setModalValue: (value: string) => void;
  closeModal: () => void;
  openShortcuts: () => void;
  closeShortcuts: () => void;
  openSwitcher: () => void;
  closeSwitcher: () => void;
  toggleSidebar: () => void;
  setSidebar: (visible: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  setSaveStatus: (status: SaveStatus) => void;
  updateSettings: (changes: Partial<Settings>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleFocusMode: () => void;
  exitFocusMode: () => void;
  setListWidth: (width: number) => void;
  requestTitleFocus: () => void;
  clearTitleFocus: () => void;
  setScroll: (source: ScrollSource, percentage: number, line: number) => void;
}

const isWideScreen = () =>
  typeof window === "undefined" || window.innerWidth >= 1024;

const currentTheme = (): Theme =>
  typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

const savedListWidth = () => {
  try {
    const width = Number(localStorage.getItem("listWidth"));
    return width >= MIN_LIST_WIDTH && width <= MAX_LIST_WIDTH ? width : 288;
  } catch {
    return 288;
  }
};

const savedSettings = (): Settings => {
  try {
    const saved = JSON.parse(localStorage.getItem("settings") ?? "{}");
    return { ...defaultSettings, ...saved };
  } catch {
    return defaultSettings;
  }
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage is blocked: the theme still changes for this visit.
  }
};

export const createUiStore = () =>
  create<UiState>((set) => ({
    modal: null,
    shortcutsOpen: false,
    switcherOpen: false,
    sidebarVisible: isWideScreen(),
    viewMode: isWideScreen() ? "split" : "edit",
    theme: currentTheme(),
    focusTitle: false,
    saveStatus: "saved",
    focusMode: false,
    listWidth: savedListWidth(),
    settings: savedSettings(),
    settingsOpen: false,
    scrollPercentage: 0,
    scrollLine: 1,
    scrollingView: null,

    openModal: (mode, value = "Untitled") =>
      set({ modal: { mode, value }, shortcutsOpen: false, switcherOpen: false }),
    setModalValue: (value) =>
      set((s) => (s.modal ? { modal: { ...s.modal, value } } : s)),
    closeModal: () => set({ modal: null }),

    openShortcuts: () => set({ shortcutsOpen: true, switcherOpen: false }),
    closeShortcuts: () => set({ shortcutsOpen: false }),

    openSwitcher: () => set({ switcherOpen: true, shortcutsOpen: false }),
    closeSwitcher: () => set({ switcherOpen: false }),

    toggleSidebar: () => set((s) => ({ sidebarVisible: !s.sidebarVisible })),
    setSidebar: (sidebarVisible) => set({ sidebarVisible }),

    setViewMode: (viewMode) => set({ viewMode }),
    toggleViewMode: (mode) =>
      set((s) => ({ viewMode: s.viewMode === mode ? "split" : mode })),

    toggleTheme: () =>
      set((s) => {
        const theme: Theme = s.theme === "dark" ? "light" : "dark";
        applyTheme(theme);
        return { theme };
      }),

    setSaveStatus: (saveStatus) => set({ saveStatus }),

    updateSettings: (changes) =>
      set((s) => {
        const settings = { ...s.settings, ...changes };
        try {
          localStorage.setItem("settings", JSON.stringify(settings));
        } catch {
          // Storage is blocked: the settings still apply for this visit.
        }
        return { settings };
      }),
    openSettings: () => set({ settingsOpen: true, shortcutsOpen: false, switcherOpen: false }),
    closeSettings: () => set({ settingsOpen: false }),

    toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
    exitFocusMode: () => set({ focusMode: false }),

    setListWidth: (width) => {
      const listWidth = Math.min(MAX_LIST_WIDTH, Math.max(MIN_LIST_WIDTH, width));
      try {
        localStorage.setItem("listWidth", String(listWidth));
      } catch {
        // Storage is blocked: the width still changes for this visit.
      }
      set({ listWidth });
    },

    requestTitleFocus: () => set({ focusTitle: true }),
    clearTitleFocus: () => set({ focusTitle: false }),

    setScroll: (scrollingView, scrollPercentage, scrollLine) =>
      set({ scrollingView, scrollPercentage, scrollLine }),
  }));
