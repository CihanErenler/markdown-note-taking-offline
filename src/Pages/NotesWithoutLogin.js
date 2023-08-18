import { useEffect } from "react";
import PreviewContainer from "../Components/PreviewContainer";
import Sidebar from "../Components/Sidebar/Sidebar";
import styled from "styled-components";
import Modal from "../Components/Modal";
import Shortcuts from "../Components/Shortcuts";
import { useEditorContext } from "../Context/EditorContext";

const NotesWithoutLogin = () => {
  const {
    isModalOpen,
    closeModal,
    currentlySelectedFile,
    isShortcutsOpen,
    closeShortcutsModal,
    toggleFullscreen,
    isSidebarVisible,
    toggleSidebar,
    openModal,
    parent,
  } = useEditorContext();

  const focusEditorKeys = (e) => e.ctrlKey && e.altKey && e.key === "1";
  const focusPreviewKeys = (e) => e.ctrlKey && e.altKey && e.key === "2";
  const toggleSidebarKeys = (e) => e.ctrlKey && e.altKey && e.key === "h";
  const createFolderKeys = (e) => e.ctrlKey && e.altKey && e.key === "n";
  const createFileKeys = (e) => e.altKey && e.key === "n";
  const renameFolderKeys = (e) => e.ctrlKey && e.altKey && e.key === "r";
  const deleteFolderKeys = (e) => e.shiftKey && e.ctrlKey && e.key === "Delete";

  useEffect(() => {
    const handleKeypress = (e) => {
      if (e.key === "Escape") {
        closeModal();
        closeShortcutsModal();
      }

      if (focusEditorKeys(e)) {
        toggleFullscreen("editor");
      }

      if (focusPreviewKeys(e)) {
        toggleFullscreen("preview");
        return;
      }

      if (toggleSidebarKeys(e)) {
        toggleSidebar();
        return;
      }

      if (createFolderKeys(e)) {
        openModal(1, "create", "create-folder");
        return;
      }

      if (createFileKeys(e)) {
        openModal(null, "create", "create-file");
        return;
      }

      if (renameFolderKeys(e)) {
        openModal(parent, "edit", "edit-folder");
        return;
      }

      if (deleteFolderKeys(e)) {
        openModal(parent, "delete", "delete-item");
        return;
      }
    };

    const prevent = (e) => {
      if (deleteFolderKeys(e)) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("keyup", handleKeypress);
    document.addEventListener("keydown", prevent);
    // cleanup
    return () => {
      document.removeEventListener("keyup", handleKeypress);
      document.removeEventListener("keydown", prevent);
    };
  }, [
    closeModal,
    closeShortcutsModal,
    openModal,
    parent,
    toggleFullscreen,
    toggleSidebar,
  ]);

  useEffect(() => {}, [currentlySelectedFile]);

  return (
    <StyledUserPage>
      {isSidebarVisible ? <Sidebar /> : ""}
      <PreviewContainer />
      {isModalOpen ? <Modal /> : ""}
      {isShortcutsOpen ? <Shortcuts /> : ""}
    </StyledUserPage>
  );
};

const StyledUserPage = styled.section`
  position: relative;
  display: flex;
`;

export default NotesWithoutLogin;
