import { toast } from "react-toastify";
import { downloadBackup, markBackupDone, readLastBackup } from "./backup";
import { useNotesStore } from "./store";

const REMINDER_AFTER_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export const remindToBackup = () => {
  const { data } = useNotesStore.getState();
  if (data.notes.length === 0) return;

  const lastBackup = readLastBackup();
  if (lastBackup === null) {
    markBackupDone();
    return;
  }
  if (Date.now() - lastBackup < REMINDER_AFTER_DAYS * DAY_MS) return;

  toast.info(
    ({ closeToast }) => (
      <div className="flex items-center justify-between gap-4">
        <span>It has been a while since your last backup.</span>
        <button
          className="shrink-0 font-semibold underline"
          onClick={async () => {
            await downloadBackup(useNotesStore.getState().data);
            markBackupDone();
            closeToast?.();
          }}
        >
          Export now
        </button>
      </div>
    ),
    { autoClose: false, toastId: "backup-reminder" }
  );
};
