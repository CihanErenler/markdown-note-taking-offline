import { useRef } from "react";
import type { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { BsDownload, BsUpload } from "react-icons/bs";
import { downloadBackup, readImportFiles } from "../../backup";
import { useNotesStore } from "../../store";

const buttonClass =
  "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-fog transition-colors hover:bg-ink-soft hover:text-white";

const BackupButtons = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const importFiles = useNotesStore((s) => s.importFiles);

  const exportAll = async () => {
    await downloadBackup(useNotesStore.getState().data);
    toast.success("Backup downloaded");
  };

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    try {
      const files = await readImportFiles(fileList);
      const count = importFiles(files);
      if (count > 0) {
        toast.success(`Imported ${count} ${count === 1 ? "note" : "notes"}`);
      } else {
        toast.warn("No markdown files found");
      }
    } catch {
      toast.error("Could not read those files. Choose .md, .txt or .zip files.");
    }
    e.target.value = "";
  };

  return (
    <>
      <button className={buttonClass} onClick={exportAll}>
        <BsDownload size={14} />
        Export all notes
      </button>
      <button className={buttonClass} onClick={() => fileInput.current?.click()}>
        <BsUpload size={14} />
        Import notes
      </button>
      <input
        ref={fileInput}
        type="file"
        multiple
        accept=".md,.markdown,.txt,.zip,.png,.jpg,.jpeg,.gif,.webp,.svg"
        className="hidden"
        aria-label="Import notes"
        onChange={handleFiles}
      />
    </>
  );
};

export default BackupButtons;
