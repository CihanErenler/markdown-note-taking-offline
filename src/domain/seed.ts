import type { NotesData, Tag } from "./types";

const WELCOME_NOTE = `# Welcome to NoteDown

Everything you write is saved on this device, so it works without a connection.
Here is a quick tour:

- [x] Write markdown on the left and see it on the right
- [x] Organise notes in folders and tags
- [ ] Link notes together, like [[Writing tips]], or give the link your own words: [[Writing tips|click here to read more]]
- [ ] Drag a note onto a folder to move it
- [ ] Press Ctrl+K (or Cmd+K) to jump to any note

> Delete this folder whenever you are ready to start fresh.`;

const TIPS_NOTE = `# Writing tips

## Tables

| Shortcut | What it does |
| -------- | ------------ |
| Alt+N | New note |
| Ctrl+K | Search notes |

## Code

\`\`\`javascript
const sayHi = (name) => \`Hello \${name}\`;

sayHi("World");
\`\`\`

Back to [[Welcome to NoteDown]].`;

export const DEFAULT_TAGS: Tag[] = [
  { id: "1", name: "Blue", color: "#2676ff" },
  { id: "2", name: "Green", color: "green" },
  { id: "3", name: "Grey", color: "grey" },
  { id: "4", name: "Important", color: "red" },
  { id: "5", name: "Orange", color: "orange" },
  { id: "6", name: "Purple", color: "purple" },
  { id: "7", name: "Work", color: "yellow" },
  { id: "8", name: "Development", color: "dodgerblue" },
];

export const seedData = (now = new Date().toISOString()): NotesData => ({
  folders: [{ id: "2", name: "Getting started" }],
  notes: [
    {
      id: "3",
      folderId: "2",
      title: "Welcome to NoteDown",
      content: WELCOME_NOTE,
      tagIds: [],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "4",
      folderId: "2",
      title: "Writing tips",
      content: TIPS_NOTE,
      tagIds: ["8"],
      createdAt: now,
      updatedAt: now,
    },
  ],
  tags: DEFAULT_TAGS,
});
