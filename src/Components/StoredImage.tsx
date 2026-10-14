import { useEffect, useState } from "react";
import { IMAGE_PREFIX } from "../domain/notes";
import { loadImage } from "../images";

const StoredImage = ({ src, alt }: { src: string; alt: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!src.startsWith(IMAGE_PREFIX)) {
      setUrl(src);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    loadImage(src.slice(IMAGE_PREFIX.length)).then((image) => {
      if (cancelled) return;
      if (!image) {
        setMissing(true);
        return;
      }
      objectUrl = URL.createObjectURL(image);
      setUrl(objectUrl);
    });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (missing) return <span className="wiki-missing">Image not found: {alt}</span>;
  if (!url) return <span className="inline-block h-24 w-40 animate-pulse rounded bg-line" />;
  return <img src={url} alt={alt} />;
};

export default StoredImage;
