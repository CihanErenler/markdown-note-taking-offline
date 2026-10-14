import Rail from "./Folders";
import NoteList from "./NoteList";
import ResizeHandle from "./ResizeHandle";
import { useUiStore } from "../../store";

const Sidebar = () => {
  const setSidebar = useUiStore((s) => s.setSidebar);

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-ink/40 lg:hidden print:hidden"
        onClick={() => setSidebar(false)}
      />
      <section className="fixed inset-y-0 left-0 z-40 flex max-w-full shrink-0 shadow-2xl lg:static lg:shadow-none print:hidden">
        <Rail />
        <NoteList />
        <ResizeHandle />
      </section>
    </>
  );
};

export default Sidebar;
