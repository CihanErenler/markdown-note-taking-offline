import Folders from "./Folders";
import Tags from "./Tags";
import AllNotes from "./AllNotes";
import TrashRow from "./TrashRow";

const FolderTree = () => (
  <nav className="flex-1 overflow-y-auto">
    <AllNotes />
    <Folders />
    <Tags />
    <TrashRow />
  </nav>
);

export default FolderTree;
