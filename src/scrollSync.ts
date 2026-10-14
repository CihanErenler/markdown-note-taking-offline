export const getScrollPercentage = (element: HTMLElement) => {
  const scrollableDistance = element.scrollHeight - element.clientHeight;
  return scrollableDistance > 0 ? (element.scrollTop / scrollableDistance) * 100 : 0;
};

export const setScrollPercentage = (element: HTMLElement, percentage: number) => {
  const scrollableDistance = element.scrollHeight - element.clientHeight;
  element.scrollTop = (scrollableDistance * percentage) / 100;
};

/*
 * A point where a line of the note is drawn in the preview: `line` is the line
 * number in the markdown text, `top` is how far down the preview it is.
 */
export interface Anchor {
  line: number;
  top: number;
}

const withEnds = (anchors: Anchor[], endLine: number, endTop: number): Anchor[] => [
  { line: 1, top: anchors[0]?.top ?? 0 },
  ...anchors,
  { line: endLine, top: endTop },
];

const lastIndexWhere = (items: Anchor[], isBefore: (anchor: Anchor) => boolean) => {
  let found = 0;
  items.forEach((anchor, index) => {
    if (isBefore(anchor)) found = index;
  });
  return found;
};

export const lineToTop = (anchors: Anchor[], line: number, endLine: number, endTop: number) => {
  const points = withEnds(anchors, endLine, endTop);
  const index = lastIndexWhere(points, (anchor) => anchor.line <= line);
  const before = points[index];
  const after = points[index + 1];
  if (!after || after.line <= before.line) return before.top;

  const progress = (line - before.line) / (after.line - before.line);
  return before.top + progress * (after.top - before.top);
};

export const topToLine = (anchors: Anchor[], top: number, endLine: number, endTop: number) => {
  const points = withEnds(anchors, endLine, endTop);
  const index = lastIndexWhere(points, (anchor) => anchor.top <= top);
  const before = points[index];
  const after = points[index + 1];
  if (!after || after.top <= before.top) return before.line;

  const progress = (top - before.top) / (after.top - before.top);
  return before.line + progress * (after.line - before.line);
};

export const cleanAnchors = (anchors: Anchor[]) => {
  const sorted = [...anchors].sort((a, b) => a.line - b.line || a.top - b.top);
  const clean: Anchor[] = [];

  for (const anchor of sorted) {
    const last = clean[clean.length - 1];
    if (last && (anchor.line === last.line || anchor.top < last.top)) continue;
    clean.push(anchor);
  }
  return clean;
};

export const EDGE_PERCENTAGE = 0.5;
