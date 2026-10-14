import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { autocompletion } from "@codemirror/autocomplete";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import "./Editor.css";
import EditorToolbar from "./EditorToolbar";
import { completeWikiLinks } from "./wikiLinks";
import { completeCodeLanguages } from "./codeFences";
import { imageHandlers } from "./imageHandlers";
import { EDGE_PERCENTAGE, getScrollPercentage } from "../../scrollSync";
import { useNotesStore, useUiStore, selectEditorText } from "../../store";

const extensions = [
  markdown({ base: markdownLanguage }),
  EditorView.lineWrapping,
  autocompletion({ override: [completeWikiLinks, completeCodeLanguages] }),
  imageHandlers,
];

const Editor = () => {
  const text = useNotesStore(selectEditorText);
  const setContent = useNotesStore((s) => s.setContent);
  const scrollPercentage = useUiStore((s) => s.scrollPercentage);
  const scrollLine = useUiStore((s) => s.scrollLine);
  const scrollingView = useUiStore((s) => s.scrollingView);
  const setScroll = useUiStore((s) => s.setScroll);
  const theme = useUiStore((s) => s.theme);
  const lineNumbers = useUiStore((s) => s.settings.lineNumbers);
  const [view, setView] = useState<EditorView | null>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!view || scrollingView !== "preview") return;
    const scroller = view.scrollDOM;

    if (scrollPercentage <= EDGE_PERCENTAGE) {
      scroller.scrollTop = 0;
    } else if (scrollPercentage >= 100 - EDGE_PERCENTAGE) {
      scroller.scrollTop = scroller.scrollHeight;
    } else {
      const lineNumber = Math.min(view.state.doc.lines, Math.max(1, Math.floor(scrollLine)));
      const block = view.lineBlockAt(view.state.doc.line(lineNumber).from);
      scroller.scrollTop = block.top + (scrollLine - lineNumber) * block.height;
    }
  }, [scrollPercentage, scrollLine]);

  useEffect(() => {
    const element = container.current;
    if (!element || !view) return;

    const scroller = view.scrollDOM;
    let hovering = false;

    const handleScroll = () => {
      if (!hovering) return;
      const block = view.lineBlockAtHeight(scroller.scrollTop);
      const lineNumber = view.state.doc.lineAt(block.from).number;
      const fraction = Math.min(0.99, Math.max(0, (scroller.scrollTop - block.top) / block.height));
      setScroll("edit", getScrollPercentage(scroller), lineNumber + fraction);
    };
    const handleEnter = () => (hovering = true);
    const handleLeave = () => (hovering = false);

    scroller.addEventListener("scroll", handleScroll);
    element.addEventListener("mouseenter", handleEnter);
    element.addEventListener("mouseleave", handleLeave);
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      element.removeEventListener("mouseenter", handleEnter);
      element.removeEventListener("mouseleave", handleLeave);
    };
  }, [view, setScroll]);

  return (
    <div className="flex h-full flex-col bg-surface">
      <EditorToolbar view={view} />
      <div ref={container} className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <CodeMirror
            value={text}
            extensions={extensions}
            onChange={setContent}
            onCreateEditor={setView}
            basicSetup={{ lineNumbers, foldGutter: false }}
            placeholder="Start writing, or type [[ to link to another note"
            height="100%"
            className="h-full"
            theme={theme === "dark" ? githubDark : githubLight}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
