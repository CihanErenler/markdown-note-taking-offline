import { useId } from "react";

export const LogoMark = ({ size = 28 }: { size?: number }) => {
  const gradient = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradient}
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F5BFF" />
          <stop offset="1" stopColor="#29D8FF" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={`url(#${gradient})`} />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fill="#fff"
        fontSize="15"
        fontWeight="700"
        letterSpacing="-0.5"
        fontFamily="Geist, system-ui, sans-serif"
      >
        ND
      </text>
    </svg>
  );
};

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo = ({ className = "text-text", size = 28 }: LogoProps) => (
  <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <LogoMark size={size} />
    <span className="text-[17px] font-semibold tracking-tight">NoteDown</span>
  </span>
);

export default Logo;
