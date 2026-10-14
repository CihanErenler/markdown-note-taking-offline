import type { ReactNode } from "react";

const ShortcutKey = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex min-w-[1.75rem] items-center justify-center rounded border border-line bg-paper px-1.5 py-0.5 font-sans text-[11px] font-semibold">
    {children}
  </kbd>
);

export default ShortcutKey;
