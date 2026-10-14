import type { Completion, CompletionContext } from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";
import { useNotesStore } from "../../store";

export const wikiLinkOption = (title: string): Completion => ({
  label: title,
  apply: (view: EditorView, _completion: Completion, from: number, to: number) => {
    const closingBrackets = /^\]{0,2}/.exec(view.state.sliceDoc(to, to + 2))?.[0] ?? "";
    const insert = `${title}]]`;

    view.dispatch({
      changes: { from, to: to + closingBrackets.length, insert },
      selection: { anchor: from + insert.length },
    });
  },
});

export const completeWikiLinks = (context: CompletionContext) => {
  const typed = context.matchBefore(/\[\[[^\]\n|]*/);
  if (!typed) return null;

  const titles = useNotesStore.getState().data.notes.map((note) => note.title);
  return { from: typed.from + 2, options: titles.map(wikiLinkOption) };
};
