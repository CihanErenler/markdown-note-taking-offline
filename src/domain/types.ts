export interface Folder {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface NoteVersion {
  content: string;
  savedAt: string;
}

export interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
  tagIds: string[];
  pinned?: boolean;
  versions?: NoteVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface TrashedNote {
  note: Note;
  folderName: string;
  deletedAt: string;
}

export interface NotesData {
  folders: Folder[];
  notes: Note[];
  tags: Tag[];
  trash?: TrashedNote[];
}

export type View =
  | { type: "folder"; id: string }
  | { type: "tag"; id: string }
  | { type: "all" }
  | { type: "trash" }
  | null;
