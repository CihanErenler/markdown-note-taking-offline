import { migrateLegacy } from "./migrateLegacy";

const NOW = "2024-06-01T00:00:00.000Z";

const legacy = () => ({
  fileData: {
    id: "1",
    name: "Folders",
    items: [
      {
        id: "f1",
        name: "Work",
        isFolder: true,
        items: [
          { id: "n1", name: "Plan", tags: [] },
          { id: "n2", name: "No content yet", tags: [] },
        ],
      },
      { id: "f2", name: "Empty", items: [] },
    ],
  },
  code: [
    {
      dataId: "n1",
      title: "Plan",
      code: "# plan",
      tags: ["t1"],
      createdAt: "2023-03-04T10:00:00.000Z",
      updatedAt: "2023-03-05T10:00:00.000Z",
    },
    { dataId: "orphan", title: "Gone", code: "x", tags: [] },
  ],
  tags: [
    { id: "t1", name: "Blue", color: "blue", items: ["n1"] },
    { id: "t2", name: "Red", color: "red", items: ["n2"] },
  ],
});

test("flattens the folder tree and joins content by id", () => {
  const data = migrateLegacy(legacy(), NOW);

  expect(data.folders).toEqual([
    { id: "f1", name: "Work" },
    { id: "f2", name: "Empty" },
  ]);
  expect(data.notes.map((n) => n.id)).toEqual(["n1", "n2"]);
  expect(data.notes[0]).toMatchObject({
    folderId: "f1",
    title: "Plan",
    content: "# plan",
    createdAt: "2023-03-04T10:00:00.000Z",
    updatedAt: "2023-03-05T10:00:00.000Z",
  });
});

test("fills in missing content and dates, and drops orphaned content", () => {
  const data = migrateLegacy(legacy(), NOW);

  expect(data.notes[1]).toMatchObject({
    content: "",
    createdAt: NOW,
    updatedAt: NOW,
  });
  expect(data.notes.find((n) => n.id === "orphan")).toBeUndefined();
});

test("merges tag membership recorded on the note and on the tag", () => {
  const data = migrateLegacy(legacy(), NOW);

  expect(data.notes[0].tagIds).toEqual(["t1"]); // both sources agree
  expect(data.notes[1].tagIds).toEqual(["t2"]); // only recorded on the tag
  expect(data.tags).toEqual([
    { id: "t1", name: "Blue", color: "blue" },
    { id: "t2", name: "Red", color: "red" },
  ]);
});

test("ignores tag ids that no longer exist", () => {
  const input = legacy();
  input.code[0].tags = ["t1", "deleted-tag"];

  expect(migrateLegacy(input, NOW).notes[0].tagIds).toEqual(["t1"]);
});

test("returns empty data when nothing was stored", () => {
  expect(migrateLegacy({}, NOW)).toEqual({ folders: [], notes: [], tags: [] });
  expect(migrateLegacy({ fileData: null }, NOW).notes).toEqual([]);
});
