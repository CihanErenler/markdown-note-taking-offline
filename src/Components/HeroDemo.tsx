import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { BsArrowRepeat, BsCheck2 } from "react-icons/bs";

interface DemoLine {
  source: string;
  preview: ReactNode;
}

const Task = ({ done, children }: { done?: boolean; children: ReactNode }) => (
  <li className="flex items-center gap-2 text-sm">
    <span
      className={`grid h-4 w-4 place-items-center rounded border ${
        done ? "border-accent bg-accent text-white" : "border-ink/30"
      }`}
    >
      {done && <BsCheck2 size={12} />}
    </span>
    {children}
  </li>
);

const script: DemoLine[] = [
  {
    source: "# Launch plan",
    preview: <p className="text-2xl font-semibold tracking-tight">Launch plan</p>,
  },
  {
    source: "Ship **offline-first** notes.",
    preview: (
      <p className="mt-2 text-sm leading-6">
        Ship <strong>offline-first</strong> notes.
      </p>
    ),
  },
  {
    source: "- [x] Write in markdown",
    preview: (
      <ul className="mt-3">
        <Task done>Write in markdown</Task>
      </ul>
    ),
  },
  {
    source: "- [ ] Link ideas with [[wiki links]]",
    preview: (
      <ul className="mt-1.5">
        <Task>
          Link ideas with{" "}
          <span className="text-accent underline decoration-dotted underline-offset-2">
            wiki links
          </span>
        </Task>
      </ul>
    ),
  },
];

const TOTAL_CHARACTERS = script.reduce((total, line) => total + line.source.length + 1, 0);
const TYPING_DELAY_MS = 38;
const HOLD_DELAY_MS = 3600;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HeroDemo = () => {
  const [position, setPosition] = useState(() => (prefersReducedMotion() ? TOTAL_CHARACTERS : 0));
  const finished = position >= TOTAL_CHARACTERS;

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const timer = setTimeout(
      () => setPosition(finished ? 0 : position + 1),
      finished ? HOLD_DELAY_MS : TYPING_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, [position, finished]);

  let remaining = position;
  const rows = script.map((line) => {
    const typedLength = Math.max(0, Math.min(line.source.length, remaining));
    remaining -= line.source.length + 1;
    return { line, typed: line.source.slice(0, typedLength), done: typedLength === line.source.length };
  });
  const typingIndex = rows.findIndex((row) => !row.done);
  const caretIndex = typingIndex === -1 ? rows.length - 1 : typingIndex;

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-xl border border-white/10 bg-ink-soft/80 shadow-2xl shadow-black/50 backdrop-blur"
    >
      <div className="flex h-10 items-center justify-between border-b border-white/10 px-4 text-xs">
        <span className="font-mono text-fog">launch-plan.md</span>
        <span className="flex items-center gap-1 text-fog">
          {finished ? <BsCheck2 /> : <BsArrowRepeat className="animate-spin" />}
          {finished ? "Saved" : "Saving…"}
        </span>
      </div>
      <div className="grid min-h-[17rem] sm:grid-cols-2">
        <pre className="border-b border-white/10 p-5 font-mono text-[13px] leading-7 text-fog sm:border-b-0 sm:border-r">
          {rows.map((row, index) => (
            <div key={row.line.source} className="min-h-7">
              {row.typed}
              {index === caretIndex && (
                <span className="ml-px inline-block h-4 w-[2px] translate-y-0.5 animate-blink bg-accent" />
              )}
            </div>
          ))}
        </pre>
        <div className="bg-white p-5 text-ink">
          {rows.map((row) => row.done && <div key={row.line.source}>{row.line.preview}</div>)}
        </div>
      </div>
    </div>
  );
};

export default HeroDemo;
