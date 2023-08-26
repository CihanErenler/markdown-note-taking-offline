import React from "react";
import { HiOutlineFolderPlus } from "react-icons/hi2";
import styled from "styled-components";

const NoItemMessage = ({ handlClick, editable }) => {
  return (
    <StyledNoItemMessage>
      <h4 className="placeholder">No item to show</h4>
      {editable && (
        <HiOutlineFolderPlus
          size={50}
          onClick={() => handlClick(1, "create", "create-folder")}
        />
      )}
    </StyledNoItemMessage>
  );
};

const StyledNoItemMessage = styled.div`
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
`;

export default NoItemMessage;
