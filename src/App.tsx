import { useEffect } from "react";
import { ToastContainer, Slide } from "react-toastify";
import { useUiStore } from "./store";
import CustomRouter from "./CustomRouter";
import "react-toastify/dist/ReactToastify.css";

const FONT_SIZES = {
  small: { editor: 13, preview: 14 },
  medium: { editor: 14, preview: 15 },
  large: { editor: 16, preview: 17 },
};

function App() {
  const theme = useUiStore((s) => s.theme);
  const fontSize = useUiStore((s) => s.settings.fontSize);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--editor-font-size", `${FONT_SIZES[fontSize].editor}px`);
    root.setProperty("--preview-font-size", `${FONT_SIZES[fontSize].preview}px`);
  }, [fontSize]);

  return (
    <div className="h-screen print:h-auto">
      <CustomRouter />
      <ToastContainer
        theme={theme}
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        transition={Slide}
        rtl={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
