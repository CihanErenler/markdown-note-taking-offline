import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:opacity-40 active:translate-y-px";

const variants = {
  primary:
    "h-10 bg-accent px-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-accent-strong",
  hero: "h-12 bg-accent px-7 text-base text-white  hover:bg-accent-strong",
  secondary: "h-10 border border-line bg-surface px-5 text-text hover:bg-paper",
  danger: "h-10 bg-danger px-5 text-white hover:brightness-110",
  small:
    "h-8 bg-accent px-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-accent-strong",
};

interface ButtonProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  disabled?: boolean;
  action?: () => void;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  disabled = false,
  action,
  className = "",
}: ButtonProps) => (
  <button
    disabled={disabled}
    onClick={() => action?.()}
    className={`${base} ${variants[variant]} ${className}`}
  >
    {children}
  </button>
);

export default Button;
