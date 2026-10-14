import { timeAgo } from "../../domain/notes";
import { useNotesStore } from "../../store";

const TrashList = () => {
  const trash = useNotesStore((s) => s.data.trash ?? []);
  const restoreFromTrash = useNotesStore((s) => s.restoreFromTrash);
  const deleteForever = useNotesStore((s) => s.deleteForever);

  if (trash.length === 0) {
    return (
      <div className="px-4 pt-10 text-center">
        <p className="text-sm text-mute">Trash is empty</p>
        <p className="mt-1 text-xs text-mute">Deleted notes stay here for 30 days.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {trash.map(({ note, folderName, deletedAt }) => (
        <li key={note.id} className="rounded-md border border-line bg-surface px-3 py-2">
          <p className="truncate text-sm font-medium">{note.title}</p>
          <p className="text-xs text-mute">
            From {folderName}, deleted {timeAgo(deletedAt)}
          </p>
          <div className="mt-2 flex gap-3 text-xs font-medium">
            <button className="text-focus hover:underline" onClick={() => restoreFromTrash(note.id)}>
              Restore
            </button>
            <button
              className="text-danger hover:underline"
              onClick={() => deleteForever(note.id)}
              aria-label={`Delete ${note.title} forever`}
            >
              Delete forever
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TrashList;
