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
    setNoFile,
    updateLocalStorageValue,
    tagsArray,
    updateTagsArray,
    tags,
    setInitialTags,
    showAllNotes,
  } = useEditorContext();

  useEffect(() => {
    if (localStorageValue) {
      setInitialFiles(localStorageValue);
    } else {
      const newCode = {
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
      };
      setInitialFiles(newCode);
      updateLocalStorageValue(newCode);
      updateCodeArray([code]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newTags = [
      { id: "1", name: "Blue", color: "#2676ff", items: [] },
      { id: "2", name: "Green", color: "green", items: [] },
      { id: "3", name: "Grey", color: "grey", items: [] },
      { id: "4", name: "Important", color: "red", items: [] },
      { id: "5", name: "Orange", color: "orange", items: [] },
      { id: "6", name: "Purple", color: "purple", items: [] },
      { id: "7", name: "Work", color: "yellow", items: [] },
      { id: "8", name: "Development", color: "dodgerblue", items: [] },
    ];
    if (tagsArray.length > 0) {
      setInitialTags([...tagsArray]);
    } else {
      updateTagsArray(newTags.concat());
      setInitialTags(newTags.concat());
    }
  }, []);

  useEffect(() => {
    if (files.items.length > 0 && !currentlySelectedFile && !showAllNotes) {
      let parent;
      let tempSelectedFile = null;
      let isThereFile = false;

      files.items.forEach((item) => {
        if (item.items.length > 0) {
          parent = item.id;
          tempSelectedFile = item.items[0].id;
          isThereFile = true;
        }
      });

      if (!isThereFile)
        parent = files.items.length > 0 ? files.items[0].id : null;

      if (!showAllNotes) selectParent(parent);
      updateSelectedFile(tempSelectedFile);
      assignCode(tempSelectedFile);
      if (tempSelectedFile === null) {
        setNoFile(true);
      }
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
