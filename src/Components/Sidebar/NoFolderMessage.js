import React from "react";

import { AiOutlineFileAdd } from "react-icons/ai";

const NoFolderMessage = ({ handleClick }) => {
  return (
    <div className="empty-msg">
      <h4 className="placeholder">The folder is empty</h4>
      <AiOutlineFileAdd
        size={50}
        onClick={() => handleClick("", "create", "create-file")}
      />
    </div>
  );
};

export default NoFolderMessage;
