import IconButton from "../IconButton";
import { MdAddBox } from "react-icons/md";
import Folder from "./Folder";
import { useNotesStore, openModalFor } from "../../store";

const Folders = () => {
  const folders = useNotesStore((s) => s.data.folders);

  return (
    <section>
      <div className="flex items-center justify-between pl-2 pt-5">
        <h2 className="text-xs font-semibold text-fog">Folders</h2>
        <IconButton
          label="New folder"
          shortcut="Ctrl+Alt+N"
          action={() => openModalFor("create-folder")}
          className="text-fog hover:text-white"
        >
          <MdAddBox size={18} />
        </IconButton>
      </div>
      <div className="space-y-0.5">
        {folders.map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
      </div>
    </section>
  );
};

export default Folders;
