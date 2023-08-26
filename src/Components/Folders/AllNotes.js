import React from "react";
import { FaStickyNote } from "react-icons/fa";
import Amount from "../Sidebar/Amount";
import { useEditorContext } from "../../Context/EditorContext";

const AllNotes = () => {
  const { totalAmount, toggleShowAllFiles } = useEditorContext();
  return (
    <div className="folder-tree-title all-notes">
      <div className="tree-title">
        <span onClick={() => toggleShowAllFiles(true)}>
          <FaStickyNote size={18} color="tomato" />
          <h1>All Notes </h1>
        </span>
        <Amount amount={totalAmount} />
      </div>
    </div>
  );
};

export default AllNotes;
