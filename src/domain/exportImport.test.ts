import {
  attachmentNames,
  exportFiles,
  importFiles,
  linkImagesForExport,
  linkImagesFromImport,
} from "./exportImport";
import type { NotesData } from "./types";

const NOW = "2024-06-01T00:00:00.000Z";

const makeId = () => {
  let next = 0;
  return () => `id${++next}`;
};

const data: NotesData = {
  folders: [{ id: "f1", name: "Work" }],
  notes: [
    {
      id: "n1",
      folderId: "f1",
      title: "Plan",
      content: "# Plan",
      tagIds: ["t1"],
      createdAt: NOW,
      updatedAt: NOW,
    },
    {
      id: "n2",
      folderId: "f1",
      title: "Plan",
      content: "second",
      tagIds: [],
      createdAt: NOW,
      updatedAt: NOW,
    },
  ],
  tags: [{ id: "t1", name: "Urgent", color: "red" }],
};

test("export makes one file per note inside its folder, with tags on top", () => {
  const files = exportFiles(data);

  expect(files.map((f) => f.path)).toEqual(["Work/Plan.md", "Work/Plan (2).md"]);
  expect(files[0].content).toBe("---\ntags: Urgent\n---\n\n# Plan");
  expect(files[1].content).toBe("second");
});

test("export replaces characters that are not allowed in file names", () => {
  const odd = { ...data, notes: [{ ...data.notes[0], title: "a/b: c?" }] };

  expect(exportFiles(odd)[0].path).toBe("Work/a-b- c-.md");
});

test("importing an export brings back folders, notes and tags", () => {
  const empty: NotesData = { folders: [], notes: [], tags: [] };

  const result = importFiles(empty, exportFiles(data), makeId(), NOW);

  expect(result.count).toBe(2);
  expect(result.data.folders.map((f) => f.name)).toEqual(["Work"]);
  expect(result.data.tags.map((t) => t.name)).toEqual(["Urgent"]);
  const plan = result.data.notes.find((n) => n.content === "# Plan");
  expect(plan?.tagIds).toHaveLength(1);
});

test("import reuses folders and tags that already exist by name", () => {
  const result = importFiles(
    data,
    [{ path: "work/Extra.md", content: "---\ntags: urgent\n---\n\nbody" }],
    makeId(),
    NOW
  );

  expect(result.data.folders).toHaveLength(1);
  expect(result.data.tags).toHaveLength(1);
  expect(result.data.notes[0]).toMatchObject({ title: "Extra", content: "body", tagIds: ["t1"] });
});

test("files without a folder go to Imported, and other files are skipped", () => {
  const empty: NotesData = { folders: [], notes: [], tags: [] };

  const result = importFiles(
    empty,
    [
      { path: "Loose.md", content: "x" },
      { path: "__MACOSX/Work/._Plan.md", content: "junk" },
      { path: "Work/.hidden.md", content: "junk" },
      { path: "Work/photo.png", content: "junk" },
    ],
    makeId(),
    NOW
  );

  expect(result.count).toBe(1);
  expect(result.data.folders.map((f) => f.name)).toEqual(["Imported"]);
});

test("other front matter is kept as part of the note", () => {
  const empty: NotesData = { folders: [], notes: [], tags: [] };
  const text = "---\ntitle: Hello\n---\n\nbody";

  const result = importFiles(empty, [{ path: "A/N.md", content: text }], makeId(), NOW);

  expect(result.data.notes[0].content).toBe(text);
});

test("image links are rewritten to files in the attachments folder and back", () => {
  const exported = linkImagesForExport(
    "![shot](notedock-image:abc)",
    new Map([["abc", "abc.png"]])
  );

  expect(exported).toBe("![shot](../attachments/abc.png)");
  expect(attachmentNames(exported)).toEqual(["abc.png"]);
  expect(linkImagesFromImport(exported, new Map([["abc.png", "new-id"]]))).toBe(
    "![shot](notedock-image:new-id)"
  );
});

test("links to attachments that were not imported are left alone", () => {
  const text = "![x](attachments/missing.png)";

  expect(linkImagesFromImport(text, new Map())).toBe(text);
});
