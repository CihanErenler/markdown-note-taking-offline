import { useRef, useEffect } from "react";
import type { RefObject } from "react";
import { useNotesStore, openModalFor } from "../../store";
import { deleteFolderById } from "../../undo";

interface FolderOptionsProps {
  folderId: string;
  buttonRef: RefObject<HTMLButtonElement>;
  onClose: () => void;
}

const FolderOptions = ({ folderId, buttonRef, onClose }: FolderOptionsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectFolder = useNotesStore((s) => s.selectFolder);

  const rename = () => {
    onClose();
    selectFolder(folderId);
    openModalFor("edit-folder");
  };

  const remove = () => {
    onClose();
    deleteFolderById(folderId);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!ref.current?.contains(target) && !buttonRef.current?.contains(target)) {
        onClose();
      }
    };

    const handleKeypress = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeypress);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeypress);
    };
  }, [buttonRef, onClose]);

  return (
    <div ref={ref} className="popover right-1 top-8 w-32 py-1 text-text">
      <button className="menu-item" onClick={rename}>
        Rename
      </button>
      <button className="menu-item text-danger" onClick={remove}>
        Delete
      </button>
    </div>
  );
};

export default FolderOptions;
