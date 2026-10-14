import type { Note } from "../domain/types";
import {
  createNotesStore,
  selectVisibleNotes,
  selectSelectedNote,
  selectEditorText,
} from "./notesStore";

const T = "2024-01-01T00:00:00.000Z";
const note = (id: string, folderId: string, extra: Partial<Note> = {}): Note => ({
  id,
  folderId,
  title: id,
  content: `content ${id}`,
  tagIds: [],
  createdAt: T,
  updatedAt: T,
  ...extra,
});

// Folders are listed newest first, as the UI shows them. The store opens on
// "Work" (f1: n1, n2) so selections below start from a known place.
const makeStore = () => {
  const store = createNotesStore({
    folders: [
      { id: "f2", name: "Home" },
      { id: "f1", name: "Work" },
    ],
    notes: [note("n1", "f1"), note("n2", "f1"), note("n3", "f2")],
    tags: [{ id: "t1", name: "Urgent", color: "red" }],
  });
  store.getState().selectFolder("f1");
  return store;
};

const ids = (notes: Note[]) => notes.map((n) => n.id);

test("starts on the first folder that has notes, with its first note selected", () => {
  const store = createNotesStore({
    folders: [
      { id: "empty", name: "Empty" },
      { id: "f1", name: "Work" },
    ],
    notes: [note("n1", "f1")],
    tags: [],
  });

  expect(store.getState().view).toEqual({ type: "folder", id: "f1" });
  expect(store.getState().selectedNoteId).toBe("n1");
});

test("switching folder selects its first note; empty folder selects none", () => {
  const store = makeStore();
  store.getState().selectFolder("f2");
  expect(store.getState().selectedNoteId).toBe("n3");

  store.getState().createFolder("Empty");
  expect(selectVisibleNotes(store.getState())).toEqual([]);
  expect(store.getState().selectedNoteId).toBeNull();
});

test("rejects blank names without changing anything", () => {
  const store = makeStore();
  const before = store.getState().data;

  expect(store.getState().createFolder("   ")).toBeNull();
  expect(store.getState().createNote("  ", "f1")).toBeNull();
  expect(store.getState().renameFolder("f1", " ")).toBe(false);
  expect(store.getState().data).toBe(before);
});

test("creating a note selects it and opens its folder", () => {
  const store = makeStore();
  store.getState().selectAll();

  const id = store.getState().createNote("Fresh", "f2");

  expect(store.getState().view).toEqual({ type: "folder", id: "f2" });
  expect(store.getState().selectedNoteId).toBe(id);
  expect(ids(selectVisibleNotes(store.getState()))[0]).toBe(id);
});

test("cannot create a note in a folder that does not exist", () => {
  const store = makeStore();
  expect(store.getState().createNote("Lost", "nope")).toBeNull();
});

test("deleting the selected note selects the one above, or the new first", () => {
  const store = makeStore();
  store.getState().selectNote("n2");
  store.getState().deleteNote("n2"); // first in list: n1 becomes first
  expect(store.getState().selectedNoteId).toBe("n1");

  const second = makeStore();
  second.getState().selectNote("n1"); // second in list [n1, n2]
  second.getState().deleteNote("n1");
  expect(second.getState().selectedNoteId).toBe("n2");
});

test("deleting a note that is not selected keeps the selection", () => {
  const store = makeStore();
  store.getState().selectNote("n1");
  store.getState().deleteNote("n2");
  expect(store.getState().selectedNoteId).toBe("n1");
});

test("deleting the last note leaves nothing selected", () => {
  const store = makeStore();
  store.getState().selectFolder("f2");
  store.getState().deleteNote("n3");
  expect(store.getState().selectedNoteId).toBeNull();
});

test("deleting the current folder moves to its neighbour, taking notes along", () => {
  const store = makeStore();
  store.getState().selectFolder("f2");
  store.getState().deleteFolder("f2");

  expect(store.getState().view).toEqual({ type: "folder", id: "f1" });
  expect(store.getState().selectedNoteId).toBe("n1");
  expect(store.getState().data.notes.map((n) => n.id)).toEqual(["n1", "n2"]);
});

test("deleting the only folder leaves an empty, valid state", () => {
  const store = createNotesStore({
    folders: [{ id: "f1", name: "Work" }],
    notes: [note("n1", "f1")],
    tags: [],
  });
  store.getState().deleteFolder("f1");

  expect(store.getState().view).toBeNull();
  expect(store.getState().selectedNoteId).toBeNull();
  expect(selectVisibleNotes(store.getState())).toEqual([]);
});

test("deleting another folder keeps the current view and selection", () => {
  const store = makeStore();
  store.getState().selectNote("n2");
  store.getState().deleteFolder("f2");

  expect(store.getState().view).toEqual({ type: "folder", id: "f1" });
  expect(store.getState().selectedNoteId).toBe("n2");
});

test("typing writes straight into the selected note", () => {
  const store = makeStore();
  store.getState().selectNote("n1");

  store.getState().setContent("edited");

  expect(selectSelectedNote(store.getState())?.content).toBe("edited");
  expect(selectEditorText(store.getState())).toBe("edited");
  store.getState().selectNote("n2");
  expect(selectEditorText(store.getState())).toBe("content n2");
  store.getState().selectNote("n1");
  expect(selectEditorText(store.getState())).toBe("edited");
});

test("a new note is Untitled and lands in the folder on screen", () => {
  const store = makeStore();
  store.getState().selectFolder("f2");

  const id = store.getState().newNote();

  expect(selectSelectedNote(store.getState())).toMatchObject({
    id,
    title: "Untitled",
    folderId: "f2",
  });
});

test("a new note from the all or tag view uses the selected note's folder", () => {
  const store = makeStore();
  store.getState().selectNote("n3");
  store.getState().selectAll();
  store.getState().selectNote("n3");

  const id = store.getState().newNote();

  expect(selectSelectedNote(store.getState())?.folderId).toBe("f2");
  expect(store.getState().selectedNoteId).toBe(id);
});

test("no note can be created without folders", () => {
  const store = createNotesStore({ folders: [], notes: [], tags: [] });
  expect(store.getState().newNote()).toBeNull();
});

test("opening a note from anywhere shows its folder", () => {
  const store = makeStore();
  store.getState().selectAll();

  store.getState().openNote("n3");

  expect(store.getState().view).toEqual({ type: "folder", id: "f2" });
  expect(store.getState().selectedNoteId).toBe("n3");
});

test("tag view lists tagged notes and removing a tag moves selection on", () => {
  const store = makeStore();
  store.getState().addTagToNote("n1", "t1");
  store.getState().addTagToNote("n3", "t1");
  store.getState().selectTag("t1");

  expect(ids(selectVisibleNotes(store.getState()))).toEqual(["n1", "n3"]);
  expect(store.getState().selectedNoteId).toBe("n1");

  store.getState().removeTagFromNote("n1", "t1");
  expect(ids(selectVisibleNotes(store.getState()))).toEqual(["n3"]);
  expect(store.getState().selectedNoteId).toBe("n3");
});

test("duplicate tag names are rejected case-insensitively", () => {
  const store = makeStore();
  expect(store.getState().createTag("URGENT", "blue")).toBeNull();
  expect(store.getState().createTag("Fresh", "blue")).not.toBeNull();
  expect(store.getState().data.tags).toHaveLength(2);
});

test("moving a note to another folder moves selection on", () => {
  const store = makeStore();
  store.getState().selectNote("n1");

  store.getState().moveNote("n1", "f2");

  expect(store.getState().data.notes.find((n) => n.id === "n1")?.folderId).toBe("f2");
  expect(store.getState().selectedNoteId).toBe("n2");
});

test("importing files adds notes and reports how many", () => {
  const store = makeStore();

  const count = store.getState().importFiles([
    { path: "Work/Plan.md", content: "plan" },
    { path: "ignore.png", content: "" },
  ]);

  expect(count).toBe(1);
  expect(store.getState().data.notes.some((n) => n.title === "Plan")).toBe(true);
  expect(store.getState().importFiles([])).toBe(0);
});

test("a tag can be renamed, but not to another tag's name or to nothing", () => {
  const store = makeStore();
  store.getState().createTag("Later", "blue");
  const laterId = store.getState().data.tags[1].id;

  expect(store.getState().updateTag(laterId, "urgent", "blue")).toBe(false);
  expect(store.getState().updateTag(laterId, "  ", "blue")).toBe(false);
  expect(store.getState().updateTag("t1", "Urgent!", "green")).toBe(true);
  expect(store.getState().updateTag("t1", "URGENT!", "green")).toBe(true);
  expect(store.getState().data.tags[0]).toMatchObject({ name: "URGENT!", color: "green" });
});

test("deleting the tag on screen leaves its view", () => {
  const store = makeStore();
  store.getState().addTagToNote("n1", "t1");
  store.getState().selectTag("t1");

  store.getState().deleteTag("t1");

  expect(store.getState().data.tags).toEqual([]);
  expect(store.getState().data.notes[0].tagIds).toEqual([]);
  expect(store.getState().view).toEqual({ type: "folder", id: "f2" });
});

test("deleting a note sends it to the trash, and restoring it brings it back", () => {
  const store = makeStore();

  store.getState().deleteNote("n1");
  expect(store.getState().data.trash?.map((i) => i.note.id)).toEqual(["n1"]);

  store.getState().restoreFromTrash("n1");
  expect(store.getState().data.notes.some((n) => n.id === "n1")).toBe(true);
  expect(store.getState().data.trash).toEqual([]);
  expect(store.getState().selectedNoteId).toBe("n1");
});

test("undoing a delete also takes the note out of the trash", () => {
  const store = makeStore();
  const [first] = store.getState().data.notes;

  store.getState().deleteNote(first.id);
  store.getState().restoreNote(first, 0);

  expect(store.getState().data.trash).toEqual([]);
});

test("deleting a note for good and emptying the trash", () => {
  const store = makeStore();
  store.getState().deleteNote("n1");
  store.getState().deleteNote("n2");

  store.getState().deleteForever("n1");
  expect(store.getState().data.trash?.map((i) => i.note.id)).toEqual(["n2"]);

  store.getState().emptyTrash();
  expect(store.getState().data.trash).toEqual([]);
});

test("the trash view shows no notes and keeps no selection", () => {
  const store = makeStore();

  store.getState().selectTrash();

  expect(store.getState().view).toEqual({ type: "trash" });
  expect(store.getState().selectedNoteId).toBeNull();
});

test("a new note can start from a template", () => {
  const store = makeStore();

  store.getState().newNote({ title: "Daily note", content: "## Plan" });

  expect(selectSelectedNote(store.getState())).toMatchObject({
    title: "Daily note",
    content: "## Plan",
  });
});

test("duplicating a note selects the copy", () => {
  const store = makeStore();

  const id = store.getState().duplicateNote("n1");

  expect(store.getState().selectedNoteId).toBe(id);
  expect(selectSelectedNote(store.getState())?.title).toBe("n1 copy");
  expect(store.getState().duplicateNote("missing")).toBeNull();
});

test("the first edit after opening a note keeps the old text as a version, typing does not", () => {
  const store = makeStore();
  store.getState().selectNote("n1");

  store.getState().setContent("one");
  store.getState().setContent("one two");
  store.getState().setContent("one two three");

  const versions = store.getState().data.notes.find((n) => n.id === "n1")?.versions;
  expect(versions?.map((v) => v.content)).toEqual(["content n1"]);
});

test("opening a note again starts a new editing session", () => {
  const store = makeStore();
  store.getState().selectNote("n1");
  store.getState().setContent("first edit");
  store.getState().selectNote("n2");
  store.getState().selectNote("n1");

  store.getState().setContent("second edit");

  const versions = store.getState().data.notes.find((n) => n.id === "n1")?.versions;
  expect(versions?.map((v) => v.content)).toEqual(["first edit", "content n1"]);
});
