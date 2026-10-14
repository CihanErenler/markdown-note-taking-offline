
import { useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import Button from "./Button";
import Input from "./Input";
import InnerModal from "./InnerModal";
import { useNotesStore, useUiStore } from "../store";
import type { ModalMode } from "../store/uiStore";

const TITLES: Partial<Record<ModalMode, string>> = {
  "create-folder": "New Folder",
  "edit-folder": "Rename Folder",
};

const warn = (message: string) => {
  toast.warn(message);
  return false;
};

const ok = (message: string) => {
  toast.success(message);
  return true;
};

const run = (mode: ModalMode, value: string) => {
  const s = useNotesStore.getState();
  const name = value.trim();
  const folderId = s.view?.type === "folder" ? s.view.id : "";

  switch (mode) {
    case "create-folder":
      return s.createFolder(name)
        ? ok(`Folder "${name}" was created`)
        : warn("Please enter a folder name");
    case "edit-folder":
      return s.renameFolder(folderId, name)
        ? ok(`Name changed to "${name}"`)
        : warn("Please enter a name");
    default:
      return false;
  }
};

const Modal = () => {
  const modal = useUiStore((s) => s.modal);
  const setModalValue = useUiStore((s) => s.setModalValue);
  const closeModal = useUiStore((s) => s.closeModal);
  const element = useRef<HTMLDivElement>(null);

  const confirm = useCallback(() => {
    const { modal, closeModal } = useUiStore.getState();
    if (modal && run(modal.mode, modal.value)) closeModal();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") confirm();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [confirm]);

  useEffect(() => {
    const tempElem = element.current;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("modal") || target.textContent === "Cancel") {
        closeModal();
      }
    };

    tempElem?.addEventListener("click", handleClick);
    return () => tempElem?.removeEventListener("click", handleClick);
  }, [closeModal]);

  const mode = modal?.mode;

  return (
    <div className="modal backdrop" ref={element}>
      <InnerModal>
        <h2 className="mb-4 font-display tracking-tight text-xl font-semibold">
          {(mode && TITLES[mode]) ?? "New Folder"}
        </h2>
        <div className="mb-5">
          <Input
            value={modal?.value ?? ""}
            action={(e) => setModalValue(e.target.value)}
            focused={true}
          />
        </div>
        <div className="flex items-center justify-between">
          <Button variant="secondary" action={closeModal}>
            Cancel
          </Button>
          <Button disabled={!modal?.value} action={confirm}>
            {mode === "edit-folder" ? "Save" : "Create"}
          </Button>
        </div>
      </InnerModal>
    </div>
  );
};

export default Modal;
