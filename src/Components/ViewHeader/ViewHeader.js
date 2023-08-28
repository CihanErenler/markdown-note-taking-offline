import styled from "styled-components";
import Tags from "./Tags";
import { useEditorContext } from "../../Context/EditorContext";
import Button from "../Button";
import FileOptions from "./FileOptions";

const ViewHeader = () => {
  const { code, codeSnapshot, saveCode, noFile } = useEditorContext();

  const compare = () => {
    let isIttheSame = false;
    if (code && codeSnapshot) {
      isIttheSame =
        code.code === codeSnapshot.code &&
        code.title === codeSnapshot.title &&
        code.tags.length === codeSnapshot.tags.length;
    }

    return isIttheSame;
  };

  return (
    <StyledViewHeader>
      <div className="doc-info">
        {!noFile && code?.code && (
          <>
            <div>
              <h2>{code.title}</h2>
            </div>
            <Tags />
          </>
        )}
      </div>
      <div className="save-btn">
        <>
          {code?.code && <FileOptions />}
          <Button
            variant="small"
            disabled={compare()}
            action={() => saveCode()}
          >
            Save
          </Button>
        </>
      </div>
    </StyledViewHeader>
  );
};

const StyledViewHeader = styled.nav`
  height: 60px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.borderLight};
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 1.2;
  background-color: #f9f9f9;

  .save-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .doc-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    h2 {
      font-weight: 500;
      font-size: 18px;
      padding-bottom: 6px;
      text-transform: capitalize;
    }
  }
`;

export default ViewHeader;
