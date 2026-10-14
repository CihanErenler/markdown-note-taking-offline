import { useEffect, useRef } from "react";
import type { ChangeEvent } from "react";

interface InputProps {
  value: string;
  action: (e: ChangeEvent<HTMLInputElement>) => void;
  focused?: boolean;
}

const Input = ({ value, action, focused = false }: InputProps) => {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused) input.current?.select();
  }, [focused]);

  return (
    <input
      ref={input}
      value={value}
      onChange={action}
      type="text"
      className="field h-11"
    />
  );
};

export default Input;
