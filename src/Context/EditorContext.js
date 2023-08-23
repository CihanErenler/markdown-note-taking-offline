import React, { useContext, useReducer } from "react";
import reducer, {
  CLOSE_MODAL,
  FIND_ITEM,
  OPEN_MODAL,
  TOGGLE_FULLSCREEN,
  UPDATE_MODAL,
  UPDATE_PARENT,
  APPEND_CHILD,
  UPDATE_CURRENT_FILE,
  ADD_NEW_TAG,
  UPDATE_TAG_VALUE,
  CLEAR_TAG_INPUT,
  TOGGLE_TAG,
  UPDATE_TAG,
  GET_AMOUNT,
  CLOSE_SHORCUTS_MODAL,
  OPEN_SHORCUTS_MODAL,
  TOGGLE_SIDEBAR,
  TOGGLE_AVATAR_DROPDOWN,
  SET_DATA,
  CODE_LOADING,
  ASSIGN_CODE,
  SET_UPDATED,
  REMOVE_TAG,
  SET_NOFILE,
  SET_FOLDER_OPTIONS,
  SET_FILE_OPTIONS,
  TOGGLE_TAG_FILTER,
  SET_PERCENTAGE,
  SET_SCROLLING_VIEW,
  SET_INITIAL_FOLDERS,
  SET_CODE,
  SET_SNAPSHOT,
} from "../Reducers/EditorReducer";
import { UPDATE_CODE } from "../Reducers/EditorReducer";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import axios from "axios";
import useLocalStorage from "../Hooks/useLocalStorage";

const EditorContext = React.createContext();

const initialStates = {
  code: {
    dataId: "3",
    title: "New note",
    code: '### Example file\n\nYou can create your check list like so:\n- [ ] (for unchecked checkbox)\n- [x] (for checked checkbox)\n\n> Or you can create a quote like so\n\n```javascript\n// or you can display you code blocks\nconst sayHi = (name) => {\n  return console.log(`Hello ${name}`)\n}\n\nsayHi("Cihan") // Hello Cihan\n```',
    tags: [],
  },
  codeSnapshot: null,
  isCodeLoading: false,
  isModalOpen: false,
  isShortcutsOpen: false,
  isSidebarVisible: true,
  files: {
    id: "1",
    name: "Folders",
    items: [],
  },
  filesUpdated: 0,
  fullscreen: "",
  modalMode: "",
  newFolderName: "",
  parent: null,
  modalValue: "",
  currentlySelectedFile: null,
  currentlySelectedTag: null,
  tags: [
    { id: "1", name: "Blue", color: "#2676ff", items: [] },
    { id: "2", name: "Green", color: "green", items: [] },
    { id: "3", name: "Grey", color: "grey", items: [] },
    { id: "4", name: "Important", color: "red", items: [] },
    { id: "5", name: "Orange", color: "orange", items: [] },
    { id: "6", name: "Purple", color: "purple", items: [] },
    { id: "7", name: "Work", color: "yellow", items: [] },
    { id: "8", name: "Development", color: "dodgerblue", items: [] },
  ],
  tagInput: "",
  totalAmount: 0,
  showAvatarDropdown: false,
  noFile: false,
  showFolderOptions: false,
  showFileOptions: false,
  showTagFilter: false,
  scrollPercentage: 0,
  scrollingView: null,
};

const EditorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialStates);
  const [localStorageValue, updateLocalStorageValue] = useLocalStorage(
    "fileData",
    ""
  );
  const [codeArray, updateCodeArray] = useLocalStorage("code", [
    {
      dataId: "3",
      title: "New note",
      code: '### Example file\n\nYou can create your check list like so:\n- [ ] (for unchecked checkbox)\n- [x] (for checked checkbox)\n\n> Or you can create a quote like so\n\n```javascript\n// or you can display you code blocks\nconst sayHi = (name) => {\n  return console.log(`Hello ${name}`)\n}\n\nsayHi("Cihan") // Hello Cihan\n```',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const updateCode = (value) => {
    dispatch({ type: UPDATE_CODE, payload: value });
  };

  const openModal = (id, mode, type) => {
    if (mode === "create") {
      dispatch({ type: OPEN_MODAL, payload: type });
    }
    if (mode === "edit") {
      dispatch({ type: FIND_ITEM, payload: type });
      dispatch({ type: OPEN_MODAL, payload: type });
    }
    if (mode === "delete") {
      dispatch({ type: OPEN_MODAL, payload: type });
    }
  };

  const closeModal = () => {
    dispatch({ type: CLOSE_MODAL });
  };

  const createFolder = async () => {
    try {
      const tempFiles = state.files;
      const newId = uuidv4();
      const newValue = state.modalValue.trim();

      if (newValue) {
        const newFolder = {
          id: newId,
          name: newValue,
          isFolder: true,
          isOpen: false,
          items: [],
        };

        tempFiles.items.unshift(newFolder);
        updateLocalStorageValue(tempFiles);

        const tempState = { ...state, files: tempFiles };
        dispatch({ type: APPEND_CHILD, payload: tempState });
        dispatch({ type: UPDATE_PARENT, payload: newId });
        dispatch({ type: CLOSE_MODAL });
        toast.success(`Folder "${newValue}" was created`);
      } else {
        toast.error("Please enter a folder name");
      }
    } catch (error) {
      toast.success("Oops, something went wrong");
    }
  };

  const createFile = async () => {
    const tempFiles = { ...state.files };
    const newId = uuidv4();
    const newValue = state.modalValue.trim();

    if (newValue) {
      const newFile = {
        id: newId,
        name: newValue,
        tags: [],
      };

      const index = tempFiles.items.findIndex(
        (item) => item.id === state.parent
      );

      tempFiles.items[index].items.unshift(newFile);

      updateLocalStorageValue(tempFiles);
      updateCodeArray(
        codeArray.concat({
          dataId: newId,
          title: newValue,
          code: "### Title",
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      const tempState = { ...state, files: tempFiles };
      dispatch({ type: APPEND_CHILD, payload: tempState });
      dispatch({ type: SET_NOFILE, payload: false });
      dispatch({ type: CLOSE_MODAL });
      dispatch({ type: UPDATE_CURRENT_FILE, payload: newId });
      toast.success(`File "${newValue}" was created`);
    } else {
      toast.warn("Please enter a file name");
    }
  };

  const toggleFullscreen = (viewName) => {
    dispatch({ type: TOGGLE_FULLSCREEN, payload: viewName });
  };

  const updateModalValue = (e) => {
    dispatch({ type: UPDATE_MODAL, payload: e.target.value });
  };

  const rename = async () => {
    const newValue = state.modalValue.trim();
    if (newValue) {
      try {
        const tempFiles = { ...state.files };

        tempFiles.items.forEach((item) => {
          if (item.id === state.parent) {
            item.items.forEach((file) => {
              if (file.id === state.currentlySelectedFile) {
                file.name = newValue;
              }
            });
          }
        });

        console.log(tempFiles);

        const tempState = { ...state, files: tempFiles };
        dispatch({ type: APPEND_CHILD, payload: tempState });
        updateLocalStorageValue(tempFiles);

        const date = new Date();
        const newCode = { ...state.code, updatedAt: date, title: newValue };
        const newCodeArray = codeArray.filter(
          (code) => code.dataId !== state.currentlySelectedFile
        );

        updateCodeArray(newCodeArray.concat(newCode));
        dispatch({ type: SET_CODE, payload: newCode });
        dispatch({ type: CLOSE_MODAL });
        toast.success(`Name changed to "${newValue}"`);
      } catch (error) {
        toast.error("Oops, something went wrong");
      }
    } else {
      toast.warn("Please enter a name");
    }
  };

  const renameFolder = async (user) => {
    const tempFiles = { ...state.files };
    const newValue = state.modalValue.trim();
    if (newValue) {
      tempFiles.items.forEach((item) => {
        if (item.id === state.parent) {
          item.name = newValue;
        }
      });
      try {
        const tempState = { ...state, files: tempFiles };
        dispatch({ type: APPEND_CHILD, payload: tempState });
        updateLocalStorageValue(tempFiles);

        dispatch({ type: CLOSE_MODAL });
        toast.success(`Name changed to "${newValue}"`);
      } catch (error) {
        toast.error("Oops, something went wrong");
      }
    } else {
      toast.warn("Please enter a name");
    }
  };

  const handleDelete = async (user) => {
    let index = null;
    const tempFiles = { ...state.files };
    const parents = tempFiles.items.filter((item) => item.id !== state.parent);
    if (tempFiles.items.length > 1) {
      index = tempFiles.items.findIndex((item) => item.id === state.parent);

      if (parents.length === index) {
        index -= 1;
      }
    }
    tempFiles.items = parents;

    try {
      // const temp = state.files.items
      //   .find((item) => item.id === state.parent)
      //   .items.find((item) => item.id === state.currentlySelectedFile);

      // const noFile = temp ? true : false;

      let isNoFile = true;

      tempFiles.items.forEach((file) => {
        if (file.items.length > 0) isNoFile = false;
      });

      const tempState = { ...state, files: tempFiles };

      updateLocalStorageValue(tempFiles);
      dispatch({ type: APPEND_CHILD, payload: tempState });
      dispatch({ type: CLOSE_MODAL });
      const parentId = index !== null ? parents[index].id : null;
      if (parentId) {
        tempFiles.items.forEach((item) => {
          if (item.id === parentId) {
            if (item.items.length > 0) {
              dispatch({
                type: UPDATE_CURRENT_FILE,
                payload: item.items[0].id,
              });
            }
          }
        });
      }
      dispatch({
        type: UPDATE_PARENT,
        payload: index !== null ? parents[index].id : null,
      });
      if (isNoFile) {
        dispatch({ type: SET_NOFILE, payload: true });
      }
      toast.success(`Folder deleted`);
    } catch (error) {
      console.log(error.message);
      toast.error("Oops, something went wrong");
    }
  };

  const deleteFile = async () => {
    let deletedIndex = null;
    let parent;
    const tempFiles = { ...state.files };

    if (state.showTagFilter) {
      tempFiles.items.forEach((folder) => {
        folder.items.forEach((file) => {
          if (file.id === state.currentlySelectedFile) {
            parent = folder.id;
          }
        });
      });
    } else {
      parent = state.parent;
    }

    const currentParent = tempFiles.items.find((item) => item.id === parent);
    const newChildList = currentParent.items.filter((item, index) => {
      if (item.id !== state.currentlySelectedFile) {
        return true;
      }
      deletedIndex = index;
      return false;
    });

    const length = currentParent.items.length;
    currentParent.items = newChildList;

    tempFiles.items.forEach((folder, index) => {
      if (folder.id === parent) tempFiles.items[index] = currentParent;
    });

    try {
      const noFile = length === 1;
      const tempState = { ...state, files: tempFiles, noFile };

      let selectedIndex = null;
      if (length >= 1) {
        if (deletedIndex === 0) {
          if (length !== 1) {
            selectedIndex = 0;
          }
        } else {
          selectedIndex = deletedIndex - 1;
        }
      }

      let id = null;

      id = selectedIndex !== null ? newChildList[selectedIndex].id : null;
      const newCodeArray = codeArray.filter(
        (code) => code.dataId !== state.currentlySelectedFile
      );

      updateCodeArray(newCodeArray);
      updateLocalStorageValue(tempState.files);

      dispatch({ type: APPEND_CHILD, payload: tempState });
      dispatch({ type: CLOSE_MODAL });
      dispatch({ type: UPDATE_CURRENT_FILE, payload: id });
      toast.success("File deleted");
    } catch (error) {
      console.log(error.message);
      toast.error("Oops, something went wrong");
    }
  };

  const updateSelectedFile = (id) => {
    // toggleTagFilter(false);
    dispatch({ type: UPDATE_CURRENT_FILE, payload: id });
  };

  const assignCode = (id) => {
    const list = [...codeArray];
    const currentCode = list.find((code) => code.dataId === id);
    console.log(currentCode);
    dispatch({ type: CODE_LOADING, payload: true });
    dispatch({ type: ASSIGN_CODE, payload: currentCode });
    dispatch({ type: CODE_LOADING, payload: false });
  };

  const selectParent = (id) => {
    toggleTagFilter(false);
    dispatch({ type: UPDATE_PARENT, payload: id });
  };

  const selectTag = (id) => {
    dispatch({ type: UPDATE_TAG, payload: id });
    if (!state.showTagFilter) {
      toggleTagFilter(true);
    }
  };

  const updateTagInput = (e) => {
    const value = e.target.value;
    dispatch({ type: UPDATE_TAG_VALUE, payload: value });
  };

  const addNewTag = (color) => {
    const value = state.tagInput;

    if (value === "") {
      toast.error(`Please add a tag name`);
    } else {
      const item = state.tags.find(
        (item) => item.name.toLowerCase() === value.toLowerCase()
      );
      if (item) {
        toast.warn(`A tag exists with the name "${value}"`);
      } else {
        const tag = { id: uuidv4(), name: value, color, items: [] };
        dispatch({ type: ADD_NEW_TAG, payload: tag });
        clearTagInput();
      }
    }
  };

  const saveCode = async () => {
    try {
      const date = new Date();
      const newCode = { ...state.code, updatedAt: date };
      const tempArray = [...codeArray];
      codeArray.forEach((code, index) => {
        if (state.currentlySelectedFile === code.dataId) {
          tempArray[index] = newCode;
        }
      });
      updateCodeArray(tempArray);
      dispatch({ type: SET_SNAPSHOT, payload: newCode });
      toast.success("Code saved successfully");
    } catch (error) {
      toast.error("Oops, something went wrong");
    }
  };

  const clearTagInput = () => {
    dispatch({ type: CLEAR_TAG_INPUT });
  };

  const toggleTags = (id) => {
    dispatch({ type: TOGGLE_TAG, payload: id });
  };

  const getAmount = () => {
    dispatch({ type: GET_AMOUNT });
  };

  const closeShortcutsModal = () => {
    dispatch({ type: CLOSE_SHORCUTS_MODAL });
  };

  const openShortcutsModal = () => {
    dispatch({ type: OPEN_SHORCUTS_MODAL });
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const setShowAvatarDropdown = (val) => {
    dispatch({ type: TOGGLE_AVATAR_DROPDOWN, payload: val });
  };

  const setData = (data) => {
    dispatch({ type: SET_DATA, payload: data });
  };

  const removeTag = (id) => {
    const tags = [...state.tags];
    const tag = tags.find((tag) => tag.id === id);
    const index = tag.items.findIndex(
      (item) => item === state.currentlySelectedFile
    );
    tag.items.splice(index, 1);
    const newState = { ...state, tags };
    dispatch({ type: APPEND_CHILD, payload: newState });
    dispatch({ type: REMOVE_TAG, payload: id });
  };

  const clearState = () => {
    const newState = {
      ...state,
      code: {
        dataId: "3",
        title: "New note",
        code: "### Title",
        tags: [],
      },
      files: {
        id: "1",
        name: "Folders",
        items: [
          {
            id: "2",
            name: "New folder",
            items: [
              {
                id: "3",
                name: "New note",
                tags: [],
              },
            ],
          },
        ],
      },
      currentlySelectedFile: "3",
      parent: "2",
    };
    dispatch({ type: APPEND_CHILD, payload: newState });
    dispatch({ type: SET_UPDATED });
  };

  const fetchData = async (user) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASEURL}/editor/data`,
        { email: user.email },
        {
          headers: {
            authorization: `bearer ${user.token}`,
          },
        }
      );
      dispatch({ type: SET_DATA, payload: response.data });
      dispatch({ type: SET_UPDATED });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const setFolderOptions = (val) => {
    dispatch({ type: SET_FOLDER_OPTIONS, payload: val });
  };

  const setFileOptions = (val) => {
    dispatch({ type: SET_FILE_OPTIONS, payload: val });
  };

  const toggleTagFilter = (val) => {
    dispatch({ type: TOGGLE_TAG_FILTER, payload: val });
  };

  const handleScroll = (val) => {
    dispatch({ type: SET_PERCENTAGE, payload: val });
  };

  const setScrollingView = (val) => {
    dispatch({ type: SET_SCROLLING_VIEW, payload: val });
  };

  const setInitialFiles = (files) => {
    dispatch({ type: SET_INITIAL_FOLDERS, payload: files });
  };

  const setNoFile = (val) => {
    dispatch({ type: SET_NOFILE, payload: val });
  };

  return (
    <EditorContext.Provider
      value={{
        ...state,
        updateCode,
        openModal,
        closeModal,
        createFolder,
        createFile,
        toggleFullscreen,
        updateModalValue,
        rename,
        handleDelete,
        updateSelectedFile,
        assignCode,
        addNewTag,
        updateTagInput,
        clearTagInput,
        toggleTags,
        selectParent,
        selectTag,
        getAmount,
        closeShortcutsModal,
        openShortcutsModal,
        toggleSidebar,
        setShowAvatarDropdown,
        setData,
        fetchData,
        clearState,
        saveCode,
        removeTag,
        deleteFile,
        renameFolder,
        setFolderOptions,
        setFileOptions,
        toggleTagFilter,
        handleScroll,
        setScrollingView,
        updateLocalStorageValue,
        localStorageValue,
        setInitialFiles,
        codeArray,
        updateCodeArray,
        setNoFile,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

const useEditorContext = () => {
  return useContext(EditorContext);
};

export { EditorProvider, useEditorContext };
