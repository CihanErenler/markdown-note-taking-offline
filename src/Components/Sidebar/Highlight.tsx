const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const Highlight = ({ text, query }: { text: string; query: string }) => {
  const wanted = query.trim();
  if (!wanted) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escapeRegExp(wanted)})`, "i"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === wanted.toLowerCase() ? (
          <mark key={i} className="rounded bg-accent/25 px-0.5 text-text">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export default Highlight;
