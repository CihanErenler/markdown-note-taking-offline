import type { EditorView } from "@codemirror/view";

export const wrapSelection = (
  view: EditorView,
  before: string,
  after = before,
  placeholder = "text"
) => {
  const { from, to } = view.state.selection.main;
  const selected = view.state.sliceDoc(from, to) || placeholder;

  view.dispatch({
    changes: { from, to, insert: before + selected + after },
    selection: {
      anchor: from + before.length,
      head: from + before.length + selected.length,
    },
  });
  view.focus();
};

export const prefixLine = (view: EditorView, prefix: string) => {
  const line = view.state.doc.lineAt(view.state.selection.main.from);

  view.dispatch({ changes: { from: line.from, insert: prefix } });
  view.focus();
};

export const insertText = (view: EditorView, text: string) => {
  const { from, to } = view.state.selection.main;

  view.dispatch({
    changes: { from, to, insert: text },
    selection: { anchor: from + text.length },
  });
  view.focus();
};

export const TABLE_TEMPLATE =
  "\n| Column 1 | Column 2 |\n| -------- | -------- |\n| Cell | Cell |\n";
