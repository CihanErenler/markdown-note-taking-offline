import type { PointerEvent } from "react";
import { useUiStore } from "../../store";

const RAIL_WIDTH = 208;

const ResizeHandle = () => {
  const setListWidth = useUiStore((s) => s.setListWidth);

  const startResize = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      setListWidth(moveEvent.clientX - RAIL_WIDTH);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize note list"
      onPointerDown={startResize}
      className="hidden w-1 shrink-0 cursor-col-resize bg-line transition-colors hover:bg-accent lg:block"
    />
  );
};

export default ResizeHandle;
