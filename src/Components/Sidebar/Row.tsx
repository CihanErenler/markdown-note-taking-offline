import type { DragEvent, ReactNode } from "react";
import Amount from "./Amount";

interface RowProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  count?: number;
  actions?: ReactNode;
  highlighted?: boolean;
  onDragOver?: (e: DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: DragEvent) => void;
  children: ReactNode;
}

const Row = ({
  selected,
  onClick,
  icon,
  count,
  actions,
  highlighted = false,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: RowProps) => {
  let color = "text-fog hover:bg-white/5 hover:text-white";
  if (selected) {
    color =
      "bg-white/10 text-white before:absolute before:bottom-1.5 before:left-0 before:top-1.5 before:w-0.5 before:rounded-full before:bg-accent";
  }
  if (highlighted) color = "bg-accent/20 text-white ring-1 ring-accent";

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group relative flex items-center rounded-md transition-colors ${color}`}
    >
      <button
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm"
      >
        {icon}
        <span className="flex-1 truncate">{children}</span>
        {count !== undefined && (
          <span className={actions ? "group-focus-within:hidden group-hover:hidden" : ""}>
            <Amount amount={count} />
          </span>
        )}
      </button>
      {actions}
    </div>
  );
};

export default Row;
