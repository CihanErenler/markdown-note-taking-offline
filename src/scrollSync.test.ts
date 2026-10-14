import {
  cleanAnchors,
  getScrollPercentage,
  lineToTop,
  setScrollPercentage,
  topToLine,
  type Anchor,
} from "./scrollSync";

const pane = (scrollHeight: number, clientHeight: number, scrollTop = 0) =>
  ({ scrollHeight, clientHeight, scrollTop }) as HTMLElement;

test("the percentage is how far the pane has scrolled of what it can scroll", () => {
  expect(getScrollPercentage(pane(1000, 400, 0))).toBe(0);
  expect(getScrollPercentage(pane(1000, 400, 300))).toBe(50);
  expect(getScrollPercentage(pane(1000, 400, 600))).toBe(100);
});

test("a pane that does not scroll is at zero", () => {
  expect(getScrollPercentage(pane(300, 400))).toBe(0);
});

test("two panes of different lengths reach the end together", () => {
  const editor = pane(3000, 600, 2400);
  const preview = pane(1200, 600);

  setScrollPercentage(preview, getScrollPercentage(editor));

  expect(preview.scrollTop).toBe(600);
});

const anchors: Anchor[] = [
  { line: 1, top: 0 },
  { line: 3, top: 80 },
  { line: 10, top: 200 },
];

test("a line maps to the place it is drawn, and in between to a spot along the way", () => {
  expect(lineToTop(anchors, 1, 21, 500)).toBe(0);
  expect(lineToTop(anchors, 3, 21, 500)).toBe(80);
  expect(lineToTop(anchors, 6.5, 21, 500)).toBe(140);
});

test("lines after the last anchor run to the end of the document", () => {
  expect(lineToTop(anchors, 21, 21, 500)).toBe(500);
  expect(lineToTop(anchors, 15.5, 21, 500)).toBe(350);
});

test("a position maps back to a line, the opposite way", () => {
  expect(topToLine(anchors, 0, 21, 500)).toBe(1);
  expect(topToLine(anchors, 80, 21, 500)).toBe(3);
  expect(topToLine(anchors, 140, 21, 500)).toBe(6.5);
  expect(topToLine(anchors, 350, 21, 500)).toBe(15.5);
});

test("going there and back gives the same line", () => {
  for (const line of [1, 2.5, 7, 12.25, 20]) {
    const top = lineToTop(anchors, line, 21, 500);
    expect(topToLine(anchors, top, 21, 500)).toBeCloseTo(line);
  }
});

test("a document with no anchors still maps from start to end", () => {
  expect(lineToTop([], 11, 21, 400)).toBe(200);
});

test("anchors are sorted, and repeated lines or out of order tops are dropped", () => {
  const messy: Anchor[] = [
    { line: 5, top: 100 },
    { line: 1, top: 0 },
    { line: 5, top: 110 },
    { line: 7, top: 50 },
    { line: 9, top: 300 },
  ];

  expect(cleanAnchors(messy)).toEqual([
    { line: 1, top: 0 },
    { line: 5, top: 100 },
    { line: 9, top: 300 },
  ]);
});
