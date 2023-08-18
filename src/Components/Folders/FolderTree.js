import Folders from "./Folders";
import Tags from "./Tags";
import AllNotes from "./AllNotes";
import { StyledFolderTree } from "./StyledFolders";

const FolderTree = () => {
  return (
    <StyledFolderTree>
      <AllNotes />
      <Folders />
      <Tags />
    </StyledFolderTree>
  );
};

export default FolderTree;
