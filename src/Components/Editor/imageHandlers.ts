import { EditorView } from "@codemirror/view";
import { imageMarkdown, saveImage } from "../../images";

const imagesIn = (files?: FileList | null) =>
  Array.from(files ?? []).filter((file) => file.type.startsWith("image/"));

const insertImages = async (view: EditorView, images: File[], position: number) => {
  let text = "";
  for (const image of images) {
    const id = await saveImage(image);
    text += `${imageMarkdown(id, image.name.replace(/\.[^.]+$/, "") || "image")}\n`;
  }

  view.dispatch({
    changes: { from: position, insert: text },
    selection: { anchor: position + text.length },
  });
};

export const imageHandlers = EditorView.domEventHandlers({
  paste(event, view) {
    const images = imagesIn(event.clipboardData?.files);
    if (images.length === 0) return false;

    event.preventDefault();
    insertImages(view, images, view.state.selection.main.head);
    return true;
  },
  drop(event, view) {
    const images = imagesIn(event.dataTransfer?.files);
    if (images.length === 0) return false;

    event.preventDefault();
    const position =
      view.posAtCoords({ x: event.clientX, y: event.clientY }) ??
      view.state.selection.main.head;
    insertImages(view, images, position);
    return true;
  },
});
