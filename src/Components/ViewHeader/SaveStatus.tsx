import { BsCheck2, BsArrowRepeat, BsExclamationTriangle } from "react-icons/bs";
import { useUiStore } from "../../store";

const SaveStatus = () => {
  const status = useUiStore((s) => s.saveStatus);

  if (status === "failed") {
    return (
      <span
        role="status"
        title="Your browser would not store the notes. Export them to keep a copy."
        className="flex items-center gap-1 text-xs font-medium text-danger"
      >
        <BsExclamationTriangle />
        Not saved
      </span>
    );
  }

  return (
    <span role="status" className="hidden items-center gap-1 text-xs text-mute sm:flex">
      {status === "saving" ? <BsArrowRepeat className="animate-spin" /> : <BsCheck2 />}
      {status === "saving" ? "Saving…" : "Saved"}
    </span>
  );
};

export default SaveStatus;
