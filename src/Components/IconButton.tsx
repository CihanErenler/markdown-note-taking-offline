import type { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  action: () => void;
  label: string;
  shortcut?: string;
  className?: string;
}

const IconButton = ({ children, action, label, shortcut, className = "" }: IconButtonProps) => (
  <button
    onClick={action}
    aria-label={label}
    title={shortcut ? `${label} (${shortcut})` : label}
    className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${className}`}
  >
    {children}
  </button>
);

export default IconButton;
