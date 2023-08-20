import { useEffect } from "react";
import styled from "styled-components";
import Editor from "./Editor/Editor.js";
import Preview from "./Preview.js";
import ViewHeader from "./ViewHeader/ViewHeader.js";
import Split from "react-split";
import "../Split.css";
import { useEditorContext } from "../Context/EditorContext.js";
import logo from "../Assets/logo-black&white.svg";

const PreviewContainer = () => {
  const { fullscreen, currentlySelectedFile, assignCode, noFile } =
    useEditorContext();

  // useEffect(() => {
  //   if (user && currentlySelectedFile) {
  //     // assignCode(user);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentlySelectedFile]);

  if (noFile) {
    return (
      <StyledPreviewContainer>
        <ViewHeader />
        <div className="no-file">
          <img src={logo} alt="black&white" />
        </div>
      </StyledPreviewContainer>
    );
  }

  if (fullscreen === "preview") {
    return (
      <StyledPreviewContainer>
        <ViewHeader />
        <Preview />
      </StyledPreviewContainer>
    );
  }

  if (fullscreen === "editor") {
    return (
      <StyledPreviewContainer>
        <ViewHeader />
        <Editor />
      </StyledPreviewContainer>
    );
  }

  return (
    <StyledPreviewContainer>
      <ViewHeader />
      <Split
        sizes={[50, 50]}
        direction="horizontal"
        cursor="col-resize"
        className="split-flex"
      >
        <Editor />
        <Preview />
      </Split>
    </StyledPreviewContainer>
  );
};

const StyledPreviewContainer = styled.section`
  flex: 1;
  height: 100vh;
  overflow: hidden;

  .no-file {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 300px;
    }
  }
`;
export default PreviewContainer;
