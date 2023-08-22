import IconButton from "../IconButton";
import { BsFillCollectionFill } from "react-icons/bs";
import { MdAddBox } from "react-icons/md";
import Folder from "./Folder";
import { useEditorContext } from "../../Context/EditorContext";
import Amount from "../Sidebar/Amount";

const Folders = () => {
  const { files, openModal, totalAmount } = useEditorContext();

  return (
    <section>
      <div className="folder-tree-title">
        <div className="tree-title">
          <span>
            <BsFillCollectionFill size={18} color="orange" />
            <h1>Folders </h1>
          </span>
          <div className="title-group">
            <IconButton>
              <MdAddBox
                size={20}
                onClick={() => openModal(1, "create", "create-folder")}
              />
            </IconButton>
            <Amount amount={totalAmount} />
          </div>
        </div>
      </div>
      {files &&
        files.items.map((item) => {
          return <Folder key={item.id} explorer={item} />;
        })}
    </section>
  );
};

export default Folders;
