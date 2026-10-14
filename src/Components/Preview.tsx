import { useEffect, useRef, useState } from "react";
import { BsListUl } from "react-icons/bs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import StoredImage from "./StoredImage";
import { createMarkdownComponents, transformImageUri } from "./markdownComponents";
import {
  backlinksTo,
  extractHeadings,
  linkifyWikiLinks,
  snippet,
  unlinkedMentions,
} from "../domain/notes";
import {
  cleanAnchors,
  EDGE_PERCENTAGE,
  getScrollPercentage,
  lineToTop,
  topToLine,
  type Anchor,
} from "../scrollSync";
import { useNotesStore, useUiStore, selectEditorText } from "../store";
import type { Heading } from "../domain/notes";
import type { Note } from "../domain/types";

const NoteLinks = ({ title, notes, onOpen }: { title: string; notes: Note[]; onOpen: (id: string) => void }) => {
  if (notes.length === 0) return null;

  return (
    <div className="mt-8 border-t border-line pt-4">
      <h3 className="!mb-2 !mt-0 !text-sm !font-medium text-mute">{title}</h3>
      <ul className="!mb-0 !list-none !pl-0 text-sm">
        {notes.map((note) => (
          <li key={note.id}>
            <button className="wiki-link" onClick={() => onOpen(note.id)}>
              {note.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface ContentsMenuProps {
  headings: Heading[];
}

const ContentsMenu = ({ headings }: ContentsMenuProps) => {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-20 h-0 print:hidden">
      <div ref={wrapper} className="absolute right-0 top-0">
        <button
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-8 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-mute shadow-sm transition-colors hover:text-text"
        >
          <BsListUl size={14} />
          Contents
        </button>

        {open && (
          <nav
            aria-label="Contents"
            className="popover right-0 top-10 max-h-[60vh] w-64 overflow-y-auto p-1.5"
          >
            <ul>
              {headings.map((heading, index) => (
                <li key={`${heading.id}-${index}`}>
                  <button
                    onClick={() =>
                      document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" })
                    }
                    style={{ paddingLeft: 10 + (heading.level - 1) * 14 }}
                    className={`block w-full truncate rounded-md py-1.5 pr-2 text-left text-sm transition-colors hover:bg-accent-soft hover:text-text ${
                      heading.level === 1 ? "font-medium text-text" : "text-mute"
                    }`}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

const Preview = () => {
  const data = useNotesStore((s) => s.data);
  const selectedNoteId = useNotesStore((s) => s.selectedNoteId);
  const openNote = useNotesStore((s) => s.openNote);
  const text = useNotesStore(selectEditorText);
  const scrollPercentage = useUiStore((s) => s.scrollPercentage);
  const scrollLine = useUiStore((s) => s.scrollLine);
  const scrollingView = useUiStore((s) => s.scrollingView);
  const setScroll = useUiStore((s) => s.setScroll);
  const contentWidth = useUiStore((s) => s.settings.contentWidth);
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  const backlinks = selectedNoteId ? backlinksTo(data, selectedNoteId) : [];
  const mentions = selectedNoteId ? unlinkedMentions(data, selectedNoteId) : [];
  const headings = extractHeadings(text);

  const measureAnchors = () => {
    const section = contentRef.current;
    if (!section) return null;

    const sectionTop = section.getBoundingClientRect().top;
    const found: Anchor[] = [];
    let endTop = 0;
    section.querySelectorAll<HTMLElement>("[data-sourcepos]").forEach((element) => {
      const line = parseInt(element.dataset.sourcepos ?? "", 10);
      const rect = element.getBoundingClientRect();
      if (!Number.isNaN(line)) found.push({ line, top: rect.top - sectionTop });
      endTop = Math.max(endTop, rect.bottom - sectionTop);
    });

    return { anchors: cleanAnchors(found), endTop, sectionTop };
  };

  const endLine = text.split("\n").length + 1;

  useEffect(() => {
    const preview = previewRef.current;
    const measured = measureAnchors();
    if (!preview || !measured || scrollingView !== "edit") return;

    if (scrollPercentage <= EDGE_PERCENTAGE) {
      preview.scrollTop = 0;
    } else if (scrollPercentage >= 100 - EDGE_PERCENTAGE) {
      preview.scrollTop = preview.scrollHeight;
    } else {
      const top = lineToTop(measured.anchors, scrollLine, endLine, measured.endTop);
      const sectionOffset =
        measured.sectionTop - preview.getBoundingClientRect().top + preview.scrollTop;
      preview.scrollTop = top + sectionOffset;
    }
  }, [scrollPercentage, scrollLine]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    let hovering = false;
    let waiting = false;

    const publish = () => {
      waiting = false;
      const measured = measureAnchors();
      if (!measured) return;

      const viewTop = Math.max(0, preview.getBoundingClientRect().top - measured.sectionTop);
      const line = topToLine(measured.anchors, viewTop, endLine, measured.endTop);
      setScroll("preview", getScrollPercentage(preview), line);
    };
    const handleScroll = () => {
      if (!hovering || waiting) return;
      waiting = true;
      requestAnimationFrame(publish);
    };
    const handleEnter = () => (hovering = true);
    const handleLeave = () => (hovering = false);

    preview.addEventListener("scroll", handleScroll);
    preview.addEventListener("mouseenter", handleEnter);
    preview.addEventListener("mouseleave", handleLeave);
    return () => {
      preview.removeEventListener("scroll", handleScroll);
      preview.removeEventListener("mouseenter", handleEnter);
      preview.removeEventListener("mouseleave", handleLeave);
    };
  }, [setScroll, endLine]);

  const components = createMarkdownComponents({
    openNote,
    noteSummary: (noteId) => snippet(data.notes.find((n) => n.id === noteId)?.content ?? "", 160),
    renderImage: (src, alt) => <StoredImage src={src} alt={alt} />,
  });

  return (
    <div ref={previewRef} className="h-full overflow-auto bg-surface p-6 print:h-auto print:overflow-visible print:p-0">
      {headings.length >= 3 && <ContentsMenu headings={headings} />}
      <section
        ref={contentRef}
        className={`md mx-auto ${contentWidth === "wide" ? "max-w-5xl" : "max-w-3xl"}`}
      >
        <ReactMarkdown
          sourcePos
          remarkPlugins={[remarkGfm]}
          components={components}
          transformImageUri={transformImageUri}
        >
          {linkifyWikiLinks(data, text)}
        </ReactMarkdown>

        <div className="print:hidden">
          <NoteLinks title="Linked from" notes={backlinks} onOpen={openNote} />
          <NoteLinks title="Mentioned in other notes" notes={mentions} onOpen={openNote} />
        </div>
      </section>
    </div>
  );
};

export default Preview;
