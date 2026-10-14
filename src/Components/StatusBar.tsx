import { countWords, readingMinutes } from "../domain/notes";
import { useNotesStore, selectEditorText } from "../store";

const StatusBar = () => {
  const text = useNotesStore(selectEditorText);
  const words = countWords(text);

  return (
    <footer className="print:hidden flex h-7 shrink-0 items-center gap-4 border-t border-line bg-paper px-4 text-xs text-mute">
      <span>
        {words} {words === 1 ? "word" : "words"}
      </span>
      <span>{readingMinutes(words)} min read</span>
    </footer>
  );
};

export default StatusBar;
