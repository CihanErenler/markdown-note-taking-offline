import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import Split from "react-split";
import ViewHeader from "./ViewHeader/ViewHeader";
import Button from "./Button";
import StatusBar from "./StatusBar";
import PaneSkeleton from "./PaneSkeleton";
import { useNotesStore, useUiStore, createNoteAndFocus } from "../store";
import { LogoMark } from "./Logo";

const Editor = lazy(() => import("./Editor/Editor"));
const Preview = lazy(() => import("./Preview"));

const Shell = ({ children, showStatus = false }: { children: ReactNode; showStatus?: boolean }) => {
  const focusMode = useUiStore((s) => s.focusMode);
  const exitFocusMode = useUiStore((s) => s.exitFocusMode);

  return (
    <section className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden print:block print:h-auto print:overflow-visible">
      {focusMode ? (
        <div className="flex h-11 shrink-0 items-center justify-end border-b border-line bg-paper px-4">
          <button
            onClick={exitFocusMode}
            className="h-7 rounded-md border border-line bg-surface px-3 text-xs font-medium text-mute transition-colors hover:text-text"
          >
            Exit focus mode
          </button>
        </div>
      ) : (
        <ViewHeader />
      )}
      {children}
      {showStatus && !focusMode && <StatusBar />}
    </section>
  );
};

const Pane = ({ children }: { children: ReactNode }) => (
  <div className="h-full min-h-0 min-w-0 print:h-auto">
    <Suspense fallback={<PaneSkeleton />}>{children}</Suspense>
  </div>
);

const PreviewContainer = () => {
  const viewMode = useUiStore((s) => s.viewMode);
  const hasNote = useNotesStore((s) => s.selectedNoteId !== null);

  if (!hasNote) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <LogoMark size={56} />
          <div className="text-center">
            <p className="font-display tracking-tight text-xl font-semibold tracking-tight">Nothing open yet</p>
            <p className="mt-1 text-sm text-mute">Pick a note from the list, or start a new one.</p>
          </div>
          <Button action={() => createNoteAndFocus()}>New note</Button>
        </div>
      </Shell>
    );
  }

  if (viewMode === "preview") {
    return (
      <Shell showStatus>
        <div className="min-h-0 flex-1 print:block">
          <Pane>
            <Preview />
          </Pane>
        </div>
      </Shell>
    );
  }

  if (viewMode === "edit") {
    return (
      <Shell showStatus>
        <div className="min-h-0 flex-1">
          <Pane>
            <Editor />
          </Pane>
        </div>
      </Shell>
    );
  }

  return (
    <Shell showStatus>
      <Split
        sizes={[50, 50]}
        direction="horizontal"
        cursor="col-resize"
        className="split-flex min-h-0 flex-1"
      >
        <Pane>
          <Editor />
        </Pane>
        <Pane>
          <Preview />
        </Pane>
      </Split>
    </Shell>
  );
};

export default PreviewContainer;
