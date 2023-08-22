import { useState, useEffect } from "react";
import GlobalStyles from "./GlobalStyles";
import { ThemeProvider } from "styled-components";
import themes from "./theme";
import styled from "styled-components";
import { ToastContainer, Slide } from "react-toastify";
import CustomRouter from "./CustomRouter";
import "react-toastify/dist/ReactToastify.css";
import "./Split.css";
import { useEditorContext } from "./Context/EditorContext";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [currentTheme, setCurrentTheme] = useState(false);
  const {
    code,
    localStorageValue,
    setInitialFiles,
    assignCode,
    codeArray,
    updateCodeArray,
    currentlySelectedFile,
    selectParent,
    updateSelectedFile,
    files,
  } = useEditorContext();

  useEffect(() => {
    if (localStorageValue) {
      setInitialFiles(localStorageValue);
    } else {
      setInitialFiles({
        id: "1",
        name: "Folders",
        items: [
          {
            id: "2",
            name: "Examle folder",
            items: [
              {
                id: "3",
                name: "Example note",
                tags: [],
              },
            ],
          },
        ],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentlySelectedFile !== code?.dataId) {
      assignCode(currentlySelectedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (files.items.length > 0 && !currentlySelectedFile) {
      let parent;
      let tempSelectedFile;

      files.items.forEach((item) => {
        if (item.items.length > 0) {
          parent = item.id;
          tempSelectedFile = item.items[0].id;
        }
      });

      selectParent(parent);
      if (tempSelectedFile) updateSelectedFile(tempSelectedFile);
    }
  }, [files]);

  return (
    <Main>
      <GlobalStyles />
      <ThemeProvider theme={currentTheme ? themes.dark : themes.default}>
        <CustomRouter />
      </ThemeProvider>
      <ToastContainer
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
    </Main>
  );
}

const Main = styled.main`
  height: 100vh;
`;

export default App;
