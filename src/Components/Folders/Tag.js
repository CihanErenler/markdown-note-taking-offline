import React from "react";
import { useEditorContext } from "../../Context/EditorContext";
import styled from "styled-components";
import Amount from "../Sidebar/Amount";

const Tag = ({ tag, action }) => {
  const { currentlySelectedTag, codeSnapshot } = useEditorContext();
  return (
    <StyledSidebarTag
      key={tag.name}
      onClick={() => action(tag.name)}
      className={tag.name === currentlySelectedTag ? "selected" : ""}
    >
      <div className="title">
        <div>
          <span
            className="circle"
            style={{ backgroundColor: tag.color }}
          ></span>
          <span>{tag.name}</span>
        </div>
        {tag.items.length > 0 && <Amount amount={tag.items.length} />}
      </div>
    </StyledSidebarTag>
  );
};

const StyledSidebarTag = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px 4px 30px !important;
  transition: all 0.3s ease;
  text-transform: capitalize;
  cursor: pointer;

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    span.circle {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 8px;
    }
  }

  :hover {
    background-color: ${(props) => props.theme.sidebarHover};
  }
`;

export default Tag;
