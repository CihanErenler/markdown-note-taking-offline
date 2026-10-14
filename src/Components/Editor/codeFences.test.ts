import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import type { Completion } from "@codemirror/autocomplete";
import { completeCodeLanguages } from "./codeFences";

const makeView = (doc: string, cursor: number) =>
  new EditorView({ state: EditorState.create({ doc, selection: { anchor: cursor } }) });

const suggest = (doc: string, cursor: number) => {
  const view = makeView(doc, cursor);
  const context = {
    state: view.state,
    pos: cursor,
    matchBefore: (expr: RegExp) => {
      const line = view.state.doc.lineAt(cursor);
      const before = line.text.slice(0, cursor - line.from);
      const match = new RegExp(`(?:${expr.source})$`).exec(before);
      return match ? { from: line.from + match.index, to: cursor, text: match[0] } : null;
    },
  };
  return { view, result: completeCodeLanguages(context as never) };
};

test("typing three backticks at the start of a line suggests languages", () => {
  const { result } = suggest("```", 3);

  expect(result?.from).toBe(3);
  expect(result?.options.map((o) => o.label)).toEqual(
    expect.arrayContaining(["javascript", "python", "html", "sql"])
  );
});

test("no suggestions after backticks in the middle of a line or in inline code", () => {
  expect(suggest("text ```", 8).result).toBeNull();
  expect(suggest("`code`", 6).result).toBeNull();
});

test("choosing a language fills in the fence and puts the cursor inside it", () => {
  const { view, result } = suggest("```", 3);
  const option = result?.options.find((o) => o.label === "python") as Completion;
  const apply = option.apply as (v: EditorView, c: Completion, from: number, to: number) => void;

  apply(view, option, 3, 3);

  expect(view.state.doc.toString()).toBe("```python\n\n```");
  expect(view.state.selection.main.head).toBe("```python\n".length);
});

test("closing backticks the editor already added are reused", () => {
  const { view, result } = suggest("``````", 3);
  const option = result?.options.find((o) => o.label === "js") as Completion;
  const apply = option.apply as (v: EditorView, c: Completion, from: number, to: number) => void;

  apply(view, option, 3, 3);

  expect(view.state.doc.toString()).toBe("```js\n\n```");
});
