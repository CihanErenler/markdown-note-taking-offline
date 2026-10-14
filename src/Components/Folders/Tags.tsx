import Tag from "./Tag";
import { useNotesStore } from "../../store";

const Tags = () => {
  const tags = useNotesStore((s) => s.data.tags);

  return (
    <section>
      <h2 className="pb-1 pl-2 pt-5 text-xs font-semibold text-fog">Tags</h2>
      <div className="space-y-0.5">
        {tags.map((tag) => (
          <Tag key={tag.id} tag={tag} />
        ))}
      </div>
    </section>
  );
};

export default Tags;
