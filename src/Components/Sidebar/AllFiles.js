import React from "react";
import { useEditorContext } from "../../Context/EditorContext";
import File from "./File";
import styled from "styled-components";

const AllFiles = () => {
  const { files } = useEditorContext();

  const filesToLook = [...files.items];

  const filesToShow = [].concat.apply(
    [],
    filesToLook.map((item) => item.items)
  );

  return (
    <StyledAllFiles>
      <div className="folder-name">
        <h3>
          Show: <span>All</span>
        </h3>
      </div>
      <section className="title-list">
        <ul>
          {filesToShow.map((item, index) => {
            return (
              <File key={item.id} index={index} id={item.id}>
                {item.name}
              </File>
            );
          })}
        </ul>
      </section>
    </StyledAllFiles>
  );
};

const StyledAllFiles = styled.div`
  display: flex;
  flex-direction: column;
`;

export default AllFiles;
