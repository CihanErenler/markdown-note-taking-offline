import { get, set } from "idb-keyval";
import { v4 as uuid } from "uuid";
import { IMAGE_PREFIX } from "./domain/notes";

const keyFor = (id: string) => `image:${id}`;

export const saveImage = async (image: Blob) => {
  const id = uuid();
  await set(keyFor(id), image);
  return id;
};

export const loadImage = async (id: string) => {
  const image = await get<Blob>(keyFor(id));
  return image ?? null;
};

export const imageMarkdown = (id: string, name: string) =>
  `![${name.replace(/[[\]]/g, "")}](${IMAGE_PREFIX}${id})`;

export const extensionFor = (type: string) => {
  const extensions: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return extensions[type] ?? "png";
};

export const toDataUrl = (image: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(image);
  });

export const IMAGE_FILE = /\.(png|jpe?g|gif|webp|svg)$/i;

export const mimeFor = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "png";
  const types: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return types[extension] ?? "image/png";
};
