import { isValidElement } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Components } from "react-markdown";
import { uriTransformer } from "react-markdown";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import Highlighter from "../highlighter";
import { findCodeLanguage } from "../codeLanguages";
import { IMAGE_PREFIX, slugify } from "../domain/notes";

const codeTheme = dark as { [key: string]: CSSProperties };

const plainText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children);
  return "";
};

const sourcePosition = (node: { position?: { start: { line: number } } }) =>
  node.position ? `${node.position.start.line}:1` : undefined;

export const transformImageUri = (src: string) =>
  src.startsWith(IMAGE_PREFIX) ? src : uriTransformer(src);

interface MarkdownOptions {
  openNote?: (noteId: string) => void;
  noteSummary?: (noteId: string) => string;
  renderImage: (src: string, alt: string) => ReactNode;
}

export const createMarkdownComponents = ({
  openNote,
  noteSummary,
  renderImage,
}: MarkdownOptions): Components => ({
  h1: ({ node, children }) => (
    <h1 id={slugify(plainText(children))} data-sourcepos={sourcePosition(node)}>
      {children}
    </h1>
  ),
  h2: ({ node, children }) => (
    <h2 id={slugify(plainText(children))} data-sourcepos={sourcePosition(node)}>
      {children}
    </h2>
  ),
  h3: ({ node, children }) => (
    <h3 id={slugify(plainText(children))} data-sourcepos={sourcePosition(node)}>
      {children}
    </h3>
  ),
  h4: ({ node, children }) => (
    <h4 id={slugify(plainText(children))} data-sourcepos={sourcePosition(node)}>
      {children}
    </h4>
  ),

  code({ inline, className, children, ...props }) {
    const name = /language-([\w+#-]+)/.exec(className || "")?.[1];
    const language = name ? findCodeLanguage(name) : undefined;

    if (inline || !language) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
    return (
      <Highlighter style={codeTheme} language={language.id} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </Highlighter>
    );
  },

  a({ href, children }) {
    if (href?.startsWith("#note:")) {
      const noteId = href.slice("#note:".length);
      if (!openNote) return <span>{children}</span>;
      return (
        <button className="wiki-link" title={noteSummary?.(noteId)} onClick={() => openNote(noteId)}>
          {children}
        </button>
      );
    }
    if (href === "#missing") {
      return (
        <span className="wiki-missing" title="No note has this title yet">
          {children}
        </span>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  },

  img: ({ src, alt }) => <>{renderImage(src ?? "", alt ?? "")}</>,
});
