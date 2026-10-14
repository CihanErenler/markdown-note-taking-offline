import type { ReactNode } from "react";

const InnerModal = ({ children }: { children: ReactNode }) => (
  <div className="w-full min-w-[min(420px,100%)] max-w-xl animate-pop rounded-xl bg-surface p-6 shadow-2xl">
    {children}
  </div>
);

export default InnerModal;
