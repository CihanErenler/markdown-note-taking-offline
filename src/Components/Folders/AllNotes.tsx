import { FaStickyNote } from "react-icons/fa";
import Row from "../Sidebar/Row";
import { useNotesStore } from "../../store";

const AllNotes = () => {
  const total = useNotesStore((s) => s.data.notes.length);
  const selected = useNotesStore((s) => s.view?.type === "all");
  const selectAll = useNotesStore((s) => s.selectAll);

  return (
    <Row
      selected={selected}
      onClick={selectAll}
      icon={<FaStickyNote size={14} />}
      count={total}
    >
      All files
    </Row>
  );
};

export default AllNotes;
