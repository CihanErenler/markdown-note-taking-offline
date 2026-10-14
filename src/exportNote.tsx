import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents, transformImageUri } from "./Components/markdownComponents";
import { findImageIds, IMAGE_PREFIX, linkifyWikiLinks } from "./domain/notes";
import type { Note, NotesData } from "./domain/types";
import { loadImage, toDataUrl } from "./images";
import { useUiStore } from "./store";

const PAGE_STYLE = `
body { font-family: system-ui, sans-serif; line-height: 1.7; max-width: 46rem; margin: 2rem auto; padding: 0 1rem; color: #12161c; }
h1, h2, h3, h4 { line-height: 1.25; margin: 1.6em 0 0.6em; }
a { color: #3b5bdb; }
img { max-width: 100%; }
blockquote { border-left: 4px solid #f5e050; margin: 1em 0; padding: 0.25em 1em; background: #fdf6c3; }
code { background: #eef0f3; padding: 0.1em 0.35em; border-radius: 4px; }
pre code { background: none; padding: 0; }
table { border-collapse: collapse; }
th, td { border: 1px solid #e0e3e8; padding: 0.4em 0.8em; }
`;

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const download = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const noteToHtml = async (note: Note, data: NotesData) => {
  const { renderToStaticMarkup } = await import("react-dom/server");

  const imageUrls = new Map<string, string>();
  for (const id of findImageIds(note.content)) {
    const image = await loadImage(id);
    if (image) imageUrls.set(id, await toDataUrl(image));
  }

  const components = createMarkdownComponents({
    renderImage: (src, alt) => {
      const url = src.startsWith(IMAGE_PREFIX)
        ? imageUrls.get(src.slice(IMAGE_PREFIX.length))
        : src;
      return url ? <img src={url} alt={alt} /> : <span>[missing image: {alt}]</span>;
    },
  });

  const body = renderToStaticMarkup(
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
      transformImageUri={transformImageUri}
    >
      {linkifyWikiLinks(data, note.content)}
    </ReactMarkdown>
  );

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(note.title)}</title>
<style>${PAGE_STYLE}</style>
</head>
<body>
<h1>${escapeHtml(note.title)}</h1>
${body}
</body>
</html>
`;
};

export const downloadNoteHtml = async (note: Note, data: NotesData) => {
  const html = await noteToHtml(note, data);
  const fileName = `${note.title.replace(/[\\/:*?"<>|]/g, "-") || "note"}.html`;
  download(new Blob([html], { type: "text/html" }), fileName);
};

export const printNote = async () => {
  const ui = useUiStore.getState();
  const previousMode = ui.viewMode;

  ui.setViewMode("preview");
  await import("./Components/Preview");
  await new Promise((resolve) => setTimeout(resolve, 150));

  window.addEventListener(
    "afterprint",
    () => useUiStore.getState().setViewMode(previousMode),
    { once: true }
  );
  window.print();
};
