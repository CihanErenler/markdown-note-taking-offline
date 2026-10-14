import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import type { Completion } from "@codemirror/autocomplete";
import { wikiLinkOption } from "./wikiLinks";

const complete = (doc: string, cursor: number, title: string) => {
  const view = new EditorView({
    state: EditorState.create({ doc, selection: { anchor: cursor } }),
  });
  const option = wikiLinkOption(title);
  const apply = option.apply as (
    view: EditorView,
    completion: Completion,
    from: number,
    to: number
  ) => void;

  apply(view, option, 2, cursor);
  return view;
};

test("completing a link reuses the closing brackets the editor already added", () => {
  const view = complete("[[]]", 2, "Writing tips");

  expect(view.state.doc.toString()).toBe("[[Writing tips]]");
  expect(view.state.selection.main.head).toBe("[[Writing tips]]".length);
});

test("completing a partly typed title replaces it", () => {
  const view = complete("[[Wri]]", 5, "Writing tips");

  expect(view.state.doc.toString()).toBe("[[Writing tips]]");
});

test("completing adds the brackets when the editor did not", () => {
  const view = complete("[[", 2, "Writing tips");

  expect(view.state.doc.toString()).toBe("[[Writing tips]]");
});

test("text after the link is left alone", () => {
  const view = complete("[[]] and more", 2, "A");

  expect(view.state.doc.toString()).toBe("[[A]] and more");
});
