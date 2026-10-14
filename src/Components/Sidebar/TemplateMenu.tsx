import { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { templates } from "../../domain/templates";
import { createNoteAndFocus } from "../../store";

const TemplateMenu = ({ disabled }: { disabled: boolean }) => {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const create = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      createNoteAndFocus({ title: template.title(new Date()), content: template.content });
    }
    setOpen(false);
  };

  return (
    <div ref={wrapper} className="relative">
      <button
        disabled={disabled}
        aria-label="New note from template"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="grid h-8 w-7 place-items-center rounded-md bg-accent-strong text-white hover:bg-accent disabled:opacity-40"
      >
        <BsChevronDown size={10} />
      </button>
      {open && (
        <div className="popover right-0 top-9 w-44 py-1">
          {templates.map((template) => (
            <button key={template.id} className="menu-item" onClick={() => create(template.id)}>
              {template.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateMenu;
