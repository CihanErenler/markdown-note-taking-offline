import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import App from "./App";
import UserPage from "./Pages/UserPage";
import { useNotesStore, useUiStore } from "./store";
import { deleteCurrentFolder } from "./undo";

vi.mock("@uiw/react-codemirror", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef<
      HTMLTextAreaElement,
      { value: string; onChange: (text: string) => void }
    >(({ value, onChange }, ref) => (
      <textarea
        ref={ref}
        aria-label="editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )),
  };
});

const initialNotes = useNotesStore.getState();
const initialUi = useUiStore.getState();

beforeEach(() => {
  useNotesStore.setState(initialNotes, true);
  useUiStore.setState(initialUi, true);
});

const renderNotes = () =>
  render(
    <MemoryRouter>
      <UserPage />
      <ToastContainer />
    </MemoryRouter>
  );

test("renders the welcome page with a call to action", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /write down what you think/i })
  ).toBeInTheDocument();
  expect(screen.getByText(/start taking note/i)).toBeInTheDocument();
});

test("first run shows the welcome folder and note", async () => {
  renderNotes();

  expect(screen.getAllByText("Getting started")).toHaveLength(2);
  expect(screen.getByRole("textbox", { name: "Note title" })).toHaveValue(
    "Welcome to NoteDown"
  );
  const editor = await screen.findByLabelText<HTMLTextAreaElement>("editor");
  expect(editor.value).toMatch(/# Welcome to NoteDown/);
});

test("creating a folder through the dialog", async () => {
  renderNotes();

  act(() => useUiStore.getState().openModal("create-folder", "Ideas"));
  await userEvent.click(await screen.findByRole("button", { name: "Create" }));

  expect(screen.getAllByText("Ideas")).toHaveLength(2);
});

test("New note adds an Untitled note and focuses its title", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "New note" }));

  const title = screen.getByRole("textbox", { name: "Note title" });
  expect(title).toHaveValue("Untitled");
  expect(title).toHaveFocus();
});

test("renaming the title in place saves it, and a blank title is reverted", async () => {
  renderNotes();
  const title = screen.getByRole("textbox", { name: "Note title" });

  await userEvent.clear(title);
  await userEvent.type(title, "Plan{enter}");
  expect(useNotesStore.getState().data.notes[0].title).toBe("Plan");

  await userEvent.clear(title);
  await userEvent.tab();
  expect(title).toHaveValue("Plan");
});

test("typing is stored in the note without a save step", async () => {
  renderNotes();

  await userEvent.type(await screen.findByLabelText("editor"), "!");

  expect(useNotesStore.getState().data.notes[0].content.endsWith("!")).toBe(true);
});

test("the header shows Saving while a change is pending, then Saved", async () => {
  renderNotes();
  expect(screen.getByText("Saved")).toBeInTheDocument();

  await userEvent.type(await screen.findByLabelText("editor"), "!");
  expect(screen.getByText("Saving…")).toBeInTheDocument();

  await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument(), {
    timeout: 4000,
  });
});

test("searching lists matching notes across folders", async () => {
  renderNotes();

  await userEvent.type(screen.getByLabelText("Search all files"), "zzz-nothing");

  expect(screen.getByText(/no notes match/i)).toBeInTheDocument();
});

test("the view switcher hides the preview", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Edit" }));

  expect(useUiStore.getState().viewMode).toBe("edit");
});

test("deleting the folder empties the view, and Undo brings it back", async () => {
  renderNotes();

  act(() => deleteCurrentFolder());

  expect(screen.getByText(/create a folder to start writing/i)).toBeInTheDocument();
  expect(useNotesStore.getState().data.notes).toEqual([]);

  await userEvent.click(await screen.findByRole("button", { name: "Undo" }));

  expect(useNotesStore.getState().data.notes).toHaveLength(2);
  expect(screen.getAllByText("Getting started")).toHaveLength(2);
});

test("deleting a note shows Undo, and Undo restores it in place", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Delete file" }));
  expect(useNotesStore.getState().data.notes).toHaveLength(1);

  await userEvent.click(await screen.findByRole("button", { name: "Undo" }));

  const titles = useNotesStore.getState().data.notes.map((n) => n.title);
  expect(titles).toEqual(["Welcome to NoteDown", "Writing tips"]);
  expect(screen.getByRole("textbox", { name: "Note title" })).toHaveValue("Welcome to NoteDown");
});

test("the header warns when notes could not be saved", () => {
  renderNotes();

  act(() => useUiStore.getState().setSaveStatus("failed"));

  expect(screen.getByText("Not saved")).toBeInTheDocument();
});

test("pinning a note marks it in the store", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Pin note" }));

  expect(useNotesStore.getState().data.notes[0].pinned).toBe(true);
  expect(screen.getByRole("button", { name: "Unpin note" })).toBeInTheDocument();
});

test("the footer shows a word count", () => {
  renderNotes();

  expect(screen.getByText(/\d+ words/)).toBeInTheDocument();
  expect(screen.getByText(/min read/)).toBeInTheDocument();
});

test("searching highlights the matching text in the list", async () => {
  renderNotes();

  await userEvent.type(screen.getByLabelText("Search all files"), "tips");

  const marks = document.querySelectorAll("mark");
  expect(marks.length).toBeGreaterThan(0);
  expect(marks[0]).toHaveTextContent(/tips/i);
});

test("the arrow keys move through the note list", async () => {
  renderNotes();
  const [first] = useNotesStore.getState().data.notes;

  await userEvent.click(screen.getByRole("button", { name: /^Welcome to NoteDown/ }));
  await userEvent.keyboard("{ArrowDown}");

  expect(useNotesStore.getState().selectedNoteId).not.toBe(first.id);
});

test("the command palette runs a command typed after >", async () => {
  renderNotes();

  act(() => useUiStore.getState().openSwitcher());
  await userEvent.type(
    screen.getByLabelText("Search notes or run a command"),
    ">dark{enter}"
  );

  expect(document.documentElement).toHaveClass("dark");
});

test("focus mode hides the sidebar, and its button leaves focus mode", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: /Focus mode/ }));
  expect(screen.queryByText("Keyboard shortcuts")).not.toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Exit focus mode" }));
  expect(screen.getByText("Keyboard shortcuts")).toBeInTheDocument();
});

test("the theme button switches between light and dark", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Dark theme" }));
  expect(document.documentElement).toHaveClass("dark");

  await userEvent.click(screen.getByRole("button", { name: "Light theme" }));
  expect(document.documentElement).not.toHaveClass("dark");
});

test("a wiki link in the preview opens the note, which lists its backlink", async () => {
  renderNotes();

  expect(await screen.findByText("Linked from")).toBeInTheDocument();
  const [wikiLink] = await screen.findAllByRole("button", { name: "Writing tips" });
  await userEvent.click(wikiLink);

  expect(screen.getByRole("textbox", { name: "Note title" })).toHaveValue("Writing tips");
  expect(await screen.findByText("Linked from")).toBeInTheDocument();
});

test("typing a new name in the tag picker creates the tag and adds it to the note", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Add tag" }));
  await userEvent.type(screen.getByLabelText("Find or create a tag"), "Ideas{enter}");

  expect(screen.getByRole("button", { name: "Remove tag Ideas" })).toBeInTheDocument();
  expect(useNotesStore.getState().data.tags.some((t) => t.name === "Ideas")).toBe(true);
});

test("clicking a tag in the picker adds and removes it", async () => {
  renderNotes();
  await userEvent.click(screen.getByRole("button", { name: "Add tag" }));

  const picker = within(screen.getByRole("dialog", { name: "Tags" }));
  const option = picker.getByRole("button", { name: "Work" });
  await userEvent.click(option);
  expect(option).toHaveAttribute("aria-pressed", "true");

  await userEvent.click(option);
  expect(option).toHaveAttribute("aria-pressed", "false");
});

test("a tag can be renamed and deleted from the picker", async () => {
  renderNotes();
  await userEvent.click(screen.getByRole("button", { name: "Add tag" }));

  const picker = within(screen.getByRole("dialog", { name: "Tags" }));

  await userEvent.click(picker.getByRole("button", { name: "Edit tag Blue" }));
  const name = picker.getByLabelText("Tag name");
  await userEvent.clear(name);
  await userEvent.type(name, "Sky{enter}");
  expect(picker.getByRole("button", { name: "Sky" })).toBeInTheDocument();

  await userEvent.click(picker.getByRole("button", { name: "Edit tag Sky" }));
  await userEvent.click(picker.getByRole("button", { name: "Delete tag" }));
  await userEvent.click(picker.getByRole("button", { name: "Delete" }));
  expect(picker.queryByRole("button", { name: "Sky" })).not.toBeInTheDocument();
});

test("a blank line in the editor starts a new paragraph in the preview", async () => {
  renderNotes();

  act(() => useNotesStore.getState().setContent("first line\n\nsecond line"));

  await waitFor(() => expect(document.querySelectorAll(".md p")).toHaveLength(2));
});

test("a deleted note appears in the trash and can be restored from there", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "Delete file" }));
  await userEvent.click(screen.getByRole("button", { name: /^Trash/ }));
  expect(screen.getByText(/deleted/i, { selector: "p" })).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Restore" }));

  expect(useNotesStore.getState().data.notes).toHaveLength(2);
  expect(useNotesStore.getState().data.trash).toEqual([]);
});

test("a template creates a note with its text", async () => {
  renderNotes();

  await userEvent.click(screen.getByRole("button", { name: "New note from template" }));
  await userEvent.click(screen.getByRole("button", { name: "To-do list" }));

  expect(screen.getByRole("textbox", { name: "Note title" })).toHaveValue("To-do list");
  expect(useNotesStore.getState().data.notes[0].content).toContain("- [ ]");
});

test("settings change the stored preferences", async () => {
  renderNotes();

  act(() => useUiStore.getState().openSettings());
  await userEvent.click(screen.getByRole("button", { name: "Large" }));
  await userEvent.click(screen.getByRole("button", { name: "Off" }));

  expect(useUiStore.getState().settings).toMatchObject({ fontSize: "large", lineNumbers: false });
});

test("a long note offers a contents list", async () => {
  renderNotes();

  act(() => useNotesStore.getState().setContent("# One\n\n## Two\n\n## Three\n"));

  await userEvent.click(await screen.findByRole("button", { name: "Contents" }));

  const menu = within(screen.getByRole("navigation", { name: "Contents" }));
  expect(menu.getByRole("button", { name: "Two" })).toBeInTheDocument();
  expect(menu.getByRole("button", { name: "Three" })).toBeInTheDocument();
});

test("version history lists an earlier version of the note", async () => {
  renderNotes();
  act(() => {
    const note = useNotesStore.getState().data.notes[0];
    useNotesStore.setState((s) => ({
      data: {
        ...s.data,
        notes: s.data.notes.map((n) =>
          n.id === note.id ? { ...n, versions: [{ content: "An older draft", savedAt: n.updatedAt }] } : n
        ),
      },
    }));
  });

  await userEvent.click(screen.getByRole("button", { name: "Version history" }));
  await userEvent.click(screen.getByRole("button", { name: "Restore" }));

  expect(useNotesStore.getState().data.notes[0].content).toBe("An older draft");
});

const openActions = (title: string) =>
  userEvent.click(screen.getByRole("button", { name: `Actions for ${title}` }));

test("a note's actions menu duplicates the note", async () => {
  renderNotes();

  await openActions("Welcome to NoteDown");
  await userEvent.click(screen.getByRole("menuitem", { name: /Duplicate/ }));

  const titles = useNotesStore.getState().data.notes.map((n) => n.title);
  expect(titles).toEqual(["Welcome to NoteDown", "Welcome to NoteDown copy", "Writing tips"]);
  expect(screen.getByRole("textbox", { name: "Note title" })).toHaveValue("Welcome to NoteDown copy");
});

test("the actions menu pins a note without opening it", async () => {
  renderNotes();

  await openActions("Writing tips");
  await userEvent.click(screen.getByRole("menuitem", { name: "Pin to top" }));

  const tips = useNotesStore.getState().data.notes.find((n) => n.title === "Writing tips");
  expect(tips?.pinned).toBe(true);
  expect(useNotesStore.getState().selectedNoteId).not.toBe(tips?.id);
});

test("Rename from the actions menu opens the note with its title selected", async () => {
  renderNotes();

  await openActions("Writing tips");
  await userEvent.click(screen.getByRole("menuitem", { name: "Rename" }));

  const title = screen.getByRole("textbox", { name: "Note title" });
  expect(title).toHaveValue("Writing tips");
  expect(title).toHaveFocus();
});

test("the actions menu moves a note to another folder", async () => {
  renderNotes();
  act(() => {
    useNotesStore.getState().createFolder("Archive");
    useNotesStore.getState().selectFolder("2");
  });

  await openActions("Writing tips");
  await userEvent.click(screen.getByRole("menuitem", { name: "Archive" }));

  const tips = useNotesStore.getState().data.notes.find((n) => n.title === "Writing tips");
  const archive = useNotesStore.getState().data.folders.find((f) => f.name === "Archive");
  expect(tips?.folderId).toBe(archive?.id);
});

test("Delete from the actions menu offers Undo for that note", async () => {
  renderNotes();

  await openActions("Writing tips");
  await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }));
  expect(useNotesStore.getState().data.notes.map((n) => n.title)).toEqual(["Welcome to NoteDown"]);

  await userEvent.click(await screen.findByRole("button", { name: "Undo" }));
  expect(useNotesStore.getState().data.notes.map((n) => n.title)).toEqual([
    "Welcome to NoteDown",
    "Writing tips",
  ]);
});

test("right-clicking a note opens its actions menu, and Escape closes it", async () => {
  renderNotes();

  const tips = useNotesStore.getState().data.notes.find((n) => n.title === "Writing tips");
  fireEvent.contextMenu(document.querySelector(`[data-note-id="${tips?.id}"]`) as Element);
  expect(screen.getByRole("menu", { name: "Actions for Writing tips" })).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
});

test("editing a note makes an earlier version appear in its history", async () => {
  renderNotes();

  await userEvent.type(await screen.findByLabelText("editor"), "!");
  await userEvent.click(screen.getByRole("button", { name: "Version history" }));

  expect(screen.getByRole("button", { name: "Restore" })).toBeInTheDocument();
});
