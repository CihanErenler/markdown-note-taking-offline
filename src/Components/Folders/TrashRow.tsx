import { BsTrash } from "react-icons/bs";
import Row from "../Sidebar/Row";
import { useNotesStore } from "../../store";

const TrashRow = () => {
  const selectTrash = useNotesStore((s) => s.selectTrash);
  const selected = useNotesStore((s) => s.view?.type === "trash");
  const count = useNotesStore((s) => s.data.trash?.length ?? 0);

  return (
    <div className="pt-5">
      <Row
        selected={selected}
        onClick={selectTrash}
        icon={<BsTrash size={14} />}
        count={count > 0 ? count : undefined}
      >
        Trash
      </Row>
    </div>
  );
};

export default TrashRow;
