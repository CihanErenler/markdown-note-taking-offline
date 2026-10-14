import { createUiStore } from "./uiStore";

test("opening a modal closes the shortcuts panel and carries its value", () => {
  const store = createUiStore();
  store.getState().openShortcuts();
  store.getState().openModal("edit-folder", "Work");

  expect(store.getState().modal).toEqual({ mode: "edit-folder", value: "Work" });
  expect(store.getState().shortcutsOpen).toBe(false);
});

test("modal value defaults to Untitled and is only editable while open", () => {
  const store = createUiStore();
  store.getState().setModalValue("ignored");
  expect(store.getState().modal).toBeNull();

  store.getState().openModal("create-folder");
  expect(store.getState().modal?.value).toBe("Untitled");
  store.getState().setModalValue("Ideas");
  expect(store.getState().modal?.value).toBe("Ideas");

  store.getState().closeModal();
  expect(store.getState().modal).toBeNull();
});

test("view mode toggles per pane and returns to split view", () => {
  const store = createUiStore();
  store.getState().toggleViewMode("edit");
  expect(store.getState().viewMode).toBe("edit");
  store.getState().toggleViewMode("preview");
  expect(store.getState().viewMode).toBe("preview");
  store.getState().toggleViewMode("preview");
  expect(store.getState().viewMode).toBe("split");
});

test("the switcher and shortcuts panels replace each other", () => {
  const store = createUiStore();
  store.getState().openShortcuts();
  store.getState().openSwitcher();
  expect(store.getState().shortcutsOpen).toBe(false);
  expect(store.getState().switcherOpen).toBe(true);
});

test("save status starts saved and follows pending writes", () => {
  const store = createUiStore();
  expect(store.getState().saveStatus).toBe("saved");
  store.getState().setSaveStatus("saving");
  expect(store.getState().saveStatus).toBe("saving");
});
