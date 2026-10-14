# NoteDown

A markdown note-taking app that works entirely in your browser. Write on the left, see the result on the right. Notes live in folders, carry tags, and link to each other with `[[wiki links]]`. There is no account and no server: everything is stored on your device.

## Features

- Live markdown editor and preview (CodeMirror + react-markdown), with tables, task lists and syntax-highlighted code
- Edit, split and preview modes, with synced scrolling in split view
- Folders, colour-coded tags, search, and a Cmd/Ctrl+K quick switcher
- Wiki links: type `[[` for title suggestions, use `[[Note title|your own words]]` to change what the link says, click a link in the preview to open the note, and see "Linked from" backlinks under each note. Renaming a note updates the links that point at it
- Drag a note onto a folder to move it
- Deleting a note or folder shows an Undo toast instead of a confirmation dialog
- Formatting toolbar, word count and reading time, and a distraction-free focus mode
- Command palette: Cmd/Ctrl+K searches notes, and typing `>` runs commands
- Pin notes, resize the note list, and move through it with the arrow keys
- Paste or drag images into a note; they are stored on the device and included in backups
- Typing three backticks suggests a language for the code block
- A Trash view (notes stay for 30 days) and version history for each note
- Note templates (daily note, meeting notes, to-do list)
- A contents list for long notes, hover previews on wiki links, and "Mentioned in other notes" for plain-text mentions
- Export one note as HTML, or print it to PDF
- Settings for text size, preview width and line numbers
- Light and dark theme, following your system until you choose
- Autosave to IndexedDB with a Saving / Saved indicator that turns into a warning if the browser blocks saving, plus a monthly backup reminder
- Export all notes as a zip of `.md` files, and import `.md` files or a zip (folders and tags are kept)
- Keyboard shortcuts for most actions (press "Keyboard shortcuts" in the sidebar)

## Tech stack

React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Router, CodeMirror 6, react-markdown, IndexedDB (idb-keyval), JSZip, Vitest + Testing Library

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # run the tests once
npm run build    # type-check, then build into ./build
```

## How it is organised

```
src/
  domain/    Plain functions on the data: notes, folders, tags, search,
             wiki links, export and import. No React, easy to test.
  store/     Zustand stores. notesStore holds the notes and the selection,
             uiStore holds modals, theme, view mode and save status.
             persistence.ts loads and saves to IndexedDB.
  Components/ and Pages/   The interface, styled with Tailwind
  backup.ts  Builds and reads the zip files
```

A few decisions worth knowing about:

- **Each fact is stored once.** A note has a `folderId` and a list of `tagIds`. Counts and "notes in this folder" are worked out from that instead of being stored twice.
- **Typing goes straight into the note.** There is no separate draft. Writes to IndexedDB wait until you stop typing for two seconds, and run immediately when the tab is hidden or closed.
- **Data moves forward safely.** On start the app reads IndexedDB first, then the earlier `localStorage` formats, and only then falls back to sample notes. Old `localStorage` data is never deleted.
- **The editor and preview load on demand**, so the first page (the welcome screen) stays small. Code highlighting only ships a fixed list of common languages (`src/codeLanguages.ts`) instead of all of them.
- **Deleting is soft.** Deleted notes move to the Trash and come back with Undo or Restore. History keeps one earlier version per editing session, up to ten per note.
- **Colours are CSS variables** (see `src/index.css`), which is how dark mode works without `dark:` classes on every element.
