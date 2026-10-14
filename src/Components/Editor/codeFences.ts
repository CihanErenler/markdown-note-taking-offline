import type { Completion, CompletionContext } from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";
import { codeLanguages } from "../../codeLanguages";

const languageOption = (name: string): Completion => ({
  label: name,
  detail: "language",
  apply: (view: EditorView, _completion: Completion, from: number, to: number) => {
    const leftoverBackticks = /^`{0,3}/.exec(view.state.sliceDoc(to, to + 3))?.[0] ?? "";
    const insert = `${name}\n\n\`\`\``;

    view.dispatch({
      changes: { from, to: to + leftoverBackticks.length, insert },
      selection: { anchor: from + name.length + 1 },
    });
  },
});

const options = codeLanguages.map((language) => languageOption(language.name));

export const completeCodeLanguages = (context: CompletionContext) => {
  const typed = context.matchBefore(/^```[\w+#-]*/);
  if (!typed) return null;

  return { from: typed.from + 3, options, validFor: /^[\w+#-]*$/ };
};
