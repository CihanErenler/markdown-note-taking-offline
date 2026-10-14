import { loadInitialData, saveData, STORAGE_KEY, type Database } from "./persistence";

const memoryDatabase = (initial: Record<string, unknown> = {}): Database => {
  const map = new Map(Object.entries(initial));
  return {
    get: async (key) => map.get(key),
    set: async (key, value) => {
      map.set(key, value);
    },
  };
};

const memoryStorage = (initial: Record<string, string> = {}) => {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => (map.has(key) ? map.get(key)! : null),
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  };
};

const NOW = "2024-06-01T00:00:00.000Z";
const emptyData = { folders: [], notes: [], tags: [] };

test("first run gets the sample folder, notes and default tags", async () => {
  const data = await loadInitialData(memoryDatabase(), memoryStorage(), NOW);

  expect(data.folders).toHaveLength(1);
  expect(data.notes).toHaveLength(2);
  expect(data.tags.length).toBeGreaterThan(0);
});

test("round-trips through the database", async () => {
  const db = memoryDatabase();
  const data = { folders: [{ id: "f", name: "F" }], notes: [], tags: [] };

  await saveData(db, data);

  expect(await loadInitialData(db, memoryStorage(), NOW)).toEqual(data);
});

test("moves the earlier localStorage format into the database", async () => {
  const saved = { folders: [{ id: "f", name: "Kept" }], notes: [], tags: [] };
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });

  expect(await loadInitialData(memoryDatabase(), storage, NOW)).toEqual(saved);
});

test("the database wins over localStorage", async () => {
  const db = memoryDatabase({ [STORAGE_KEY]: emptyData });
  const storage = memoryStorage({
    [STORAGE_KEY]: JSON.stringify({ folders: [{ id: "x", name: "Old" }], notes: [], tags: [] }),
  });

  expect(await loadInitialData(db, storage, NOW)).toEqual(emptyData);
});

test("migrates the original three-key format and leaves it in place", async () => {
  const storage = memoryStorage({
    fileData: JSON.stringify({
      items: [{ id: "f1", name: "Old", items: [{ id: "n1", name: "Note" }] }],
    }),
    code: JSON.stringify([{ dataId: "n1", code: "# old", tags: [] }]),
    tags: JSON.stringify([]),
  });

  const data = await loadInitialData(memoryDatabase(), storage, NOW);

  expect(data.folders).toEqual([{ id: "f1", name: "Old" }]);
  expect(data.notes[0]).toMatchObject({ title: "Note", content: "# old" });
  expect(storage.getItem("fileData")).not.toBeNull();
});

test("corrupt or blocked storage falls back instead of throwing", async () => {
  const corrupt = memoryStorage({ [STORAGE_KEY]: "{not json" });
  expect((await loadInitialData(memoryDatabase(), corrupt, NOW)).folders).toHaveLength(1);

  const blockedDatabase: Database = {
    get: async () => {
      throw new Error("denied");
    },
    set: async () => {
      throw new Error("denied");
    },
  };
  expect((await loadInitialData(blockedDatabase, null, NOW)).folders).toHaveLength(1);
  expect(await saveData(blockedDatabase, emptyData)).toBe(false);
  expect(await saveData(memoryDatabase(), emptyData)).toBe(true);
});
