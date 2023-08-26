import { useEffect, useState } from "react";
import styled from "styled-components";
import { useEditorContext } from "../../Context/EditorContext";
import File from "./File";
import NoItemMessage from "./NoItemMessage";

const TagFilter = () => {
  const [itemsToShow, setItemsToShow] = useState([]);
  const { currentlySelectedTag, showTagFilter, tags, files, codeSnapshot } =
    useEditorContext();

  useEffect(() => {
    if (showTagFilter) {
      const selectedTag = tags.find((tag) => tag.name === currentlySelectedTag);
      let items = [];

      selectedTag.items.forEach((item) => {
        if (files.items.length > 0) {
          files.items.forEach((folder) => {
            const files = [...folder.items];
            const foundItem = files.filter((file) => {
              return item === file.id;
            });
            if (foundItem.length > 0) {
              items = [...items, ...foundItem];
            }
          });
        }
      });

      setItemsToShow(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentlySelectedTag, showTagFilter, codeSnapshot]);

  return (
    <StyledTagFilter>
      <div className="filter-info">
        <span>Filtered by: </span>
        <span className="tag-name">{currentlySelectedTag}</span>
      </div>
      <div className="filtered-files">
        <ul>
          {itemsToShow.length > 0 ? (
            itemsToShow.map((item, index) => {
              return (
                <File key={item.id} index={index} id={item.id}>
                  {item.name}
                </File>
              );
            })
          ) : (
            <NoItemMessage editable={false} />
          )}
        </ul>
      </div>
    </StyledTagFilter>
  );
};

const StyledTagFilter = styled.div`
  .filter-info {
    padding: 3px 10px;
    font-size: 14px;
    padding-bottom: 6px;

    .tag-name {
      background-color: #ddd;
      padding: 1px 6px;
      display: inline-block;
      border-radius: 4px;
      text-transform: capitalize;
    }
  }

  ul {
    list-style: none;
  }
`;

export default TagFilter;
