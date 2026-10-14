import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { insertText, prefixLine, wrapSelection } from "./formatting";

const makeView = (doc: string, from: number, to = from) =>
  new EditorView({
    state: EditorState.create({ doc, selection: { anchor: from, head: to } }),
  });

test("wrapSelection surrounds the selected text", () => {
  const view = makeView("make bold", 5, 9);

  wrapSelection(view, "**");

  expect(view.state.doc.toString()).toBe("make **bold**");
});

test("wrapSelection inserts placeholder text when nothing is selected", () => {
  const view = makeView("", 0);

  wrapSelection(view, "[", "](https://)", "link text");

  expect(view.state.doc.toString()).toBe("[link text](https://)");
});

test("prefixLine adds the marker to the line the cursor is on", () => {
  const view = makeView("one\ntwo", 5);

  prefixLine(view, "- ");

  expect(view.state.doc.toString()).toBe("one\n- two");
});

test("insertText replaces the selection", () => {
  const view = makeView("a b c", 2, 3);

  insertText(view, "X");

  expect(view.state.doc.toString()).toBe("a X c");
});
