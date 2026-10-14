import { useNotesStore } from "../../store";
import Row from "../Sidebar/Row";
import type { Tag as TagType } from "../../domain/types";

const Tag = ({ tag }: { tag: TagType }) => {
  const selectTag = useNotesStore((s) => s.selectTag);
  const selected = useNotesStore(
    (s) => s.view?.type === "tag" && s.view.id === tag.id
  );
  const count = useNotesStore(
    (s) => s.data.notes.filter((n) => n.tagIds.includes(tag.id)).length
  );

  return (
    <Row
      selected={selected}
      onClick={() => selectTag(tag.id)}
      icon={
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: tag.color }}
        />
      }
      count={count > 0 ? count : undefined}
    >
      {tag.name}
    </Row>
  );
};

export default Tag;
