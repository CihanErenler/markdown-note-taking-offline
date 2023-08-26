import React from "react";
import Tag from "./Tag";
import { IoMdPricetags } from "react-icons/io";
import { useEditorContext } from "../../Context/EditorContext";
import styled from "styled-components";

const Tags = () => {
  const { selectTag, tagsArray } = useEditorContext();

  return (
    <StyledSidebarTags className="folder-tree-title tags">
      <div className="tree-title">
        <span>
          <IoMdPricetags size={20} color="green" />
          <h1>Tags </h1>
        </span>
      </div>
      <div className="tag-list">
        {tagsArray.map((tag) => {
          return <Tag key={tag.id} tag={tag} action={selectTag} />;
        })}
      </div>
    </StyledSidebarTags>
  );
};

const StyledSidebarTags = styled.div`
  .tag-list {
    display: flex;
    flex-direction: column;

    .selected {
      background-color: ${(props) => props.theme.sidebarHover};
    }
  }
`;

export default Tags;
