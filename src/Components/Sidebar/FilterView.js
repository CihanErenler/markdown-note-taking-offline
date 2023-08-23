import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Input from "../Input";
import File from "./File";
import { AiOutlineFileAdd } from "react-icons/ai";
// import { BiFilterAlt } from "react-icons/bi";
import { useEditorContext } from "../../Context/EditorContext";
import { IoEllipsisVertical } from "react-icons/io5";
import FolderOptions from "./FolderOptions";
import { HiOutlineFolderPlus } from "react-icons/hi2";
import TagFilter from "./TagFilter";

const Filter = () => {
  const [notes, setNotes] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [value, setValue] = useState("");
  const {
    parent,
    files,
    openModal,
    setFolderOptions,
    showFolderOptions,
    showTagFilter,
  } = useEditorContext();
  const ref = useRef(null);

  useEffect(() => {
    if (parent && files) {
      const temp = files.items.find((file) => file.id === parent);
      setSelectedParent(temp);
      setNotes(temp.items);
      return;
    }
    setSelectedParent(null);
  }, [parent, files]);

  return (
    <StyledFilterView>
      <div className="search-wrapper">
        <div className="filter-view-header">
          {/* <button>
						<BiFilterAlt size={22} />
					</button> */}
          <h3>Notes</h3>
        </div>
        <Input
          value={value}
          action={(e) => setValue(e.target.value)}
          placeholder="Search..."
          type="search"
        />
      </div>
      {showTagFilter ? (
        <TagFilter />
      ) : (
        <>
          {selectedParent ? (
            <div className="folder-name">
              <h3>
                Folder: <span>{selectedParent.name}</span>
              </h3>
              <div className="folder-buttons-wrapper">
                <div>
                  <button
                    onClick={() => openModal("", "create", "create-file")}
                  >
                    <AiOutlineFileAdd size={20} />
                  </button>
                </div>
                <div
                  onClick={() => setFolderOptions(!showFolderOptions)}
                  ref={ref}
                >
                  <IoEllipsisVertical />
                </div>
              </div>
              {showFolderOptions ? <FolderOptions buttonRef={ref} /> : ""}
            </div>
          ) : (
            ""
          )}
          <section className="title-list">
            {selectedParent ? (
              <>
                <ul>
                  {notes.length > 0 ? (
                    notes.map((note, index) => {
                      return (
                        <File key={note.id} index={index} id={note.id}>
                          {note.name}
                        </File>
                      );
                    })
                  ) : (
                    <div className="empty-msg">
                      <h4 className="placeholder">The folder is empty</h4>
                      <AiOutlineFileAdd
                        size={50}
                        onClick={() => openModal("", "create", "create-file")}
                      />
                    </div>
                  )}
                </ul>
              </>
            ) : (
              <div className="empty-msg">
                <h4 className="placeholder">No item to show</h4>
                <HiOutlineFolderPlus
                  size={50}
                  onClick={() => openModal(1, "create", "create-folder")}
                />
              </div>
            )}
          </section>
        </>
      )}
    </StyledFilterView>
  );
};

const StyledFilterView = styled.section`
  width: 280px;
  background-color: #f9f9f9;

  ul {
    list-style: none;
  }

  .folder-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3px 10px;
    margin-bottom: 8px;
    position: relative;
    text-transform: capitalize;

    .folder-buttons-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      > div {
        display: grid;
        place-items: center;

        button {
          display: grid;
          place-items: center;
        }
      }

      svg {
        fill: ${(props) => props.theme.textColor};
        cursor: pointer;
        transition: all 0.3s ease;

        :hover {
          fill: ${(props) => props.theme.primary};
        }
      }
    }

    h3 {
      font-size: 14px;
      color: ${(props) => props.theme.textColor};
      font-weight: 500;
      text-align: center;

      span {
        background-color: #ddd;
        padding: 1px 6px;
        display: inline-block;
        border-radius: 4px;
      }
    }
  }

  .search-wrapper {
    padding: 0 10px;

    .filter-view-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0;

      h3 {
        font-weight: 300;
        font-size: 22px;
      }

      svg {
        fill: gray;
        transition: fill ease 0.3s;

        :hover {
          fill: dodgerblue;
        }
      }
    }
  }

  button {
    width: 30px;
    background-color: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .title-list {
    .empty-msg {
      .placeholder {
        padding-top: 30px;
        text-align: center;
        color: #c1c1c1;
      }

      svg {
        color: #c1c1c1;
        display: block;
        margin: 20px auto;
        transition: all 0.3s ease;
        cursor: pointer;

        :hover {
          color: dodgerblue;
        }
      }
    }
  }
`;

export default Filter;
