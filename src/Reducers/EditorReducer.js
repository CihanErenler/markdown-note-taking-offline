// Reducer types
export const UPDATE_CODE = "UPDATE_CODE";
export const OPEN_MODAL = "OPEN_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const TOGGLE_FOLDER_TREE = "TOGGLE_FOLDER_TREE";
export const TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN";
export const FIND_ITEM = "FIND_ITEM";
export const UPDATE_PARENT = "UPDATE_PARENT";
export const UPDATE_MODAL = "UPDATE_MODAL";
export const APPEND_CHILD = "APPEND_CHILD";
export const ASSIGN_CODE = "ASSIGN_CODE";
export const UPDATE_CURRENT_FILE = "UPDATE_CURRENT_FILE";
export const ADD_NEW_TAG = "ADD_NEW_TAG";
export const UPDATE_TAG_VALUE = "UPDATE_TAG_VALUE";
export const CLEAR_TAG_INPUT = "CLEAR_TAG_INPUT";
export const TOGGLE_TAG = "TOGGLE_TAG";
export const UPDATE_TAG = "UPDATE_TAG";
export const GET_AMOUNT = "GET_AMOUNT";
export const CLOSE_SHORCUTS_MODAL = "CLOSE_SHORCUTS_MODAL";
export const OPEN_SHORCUTS_MODAL = "OPEN_SHORCUTS_MODAL";
export const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
export const TOGGLE_AVATAR_DROPDOWN = "TOGGLE_AVATAR_DROPDOWN";
export const SET_DATA = "SET_DATA";
export const CODE_LOADING = "CODE_LOADING";
export const CLEAR_STATE = "CLEAR_STATE";
export const RESET_SNAPSHOT = "RESET_SNAPSHOT";
export const SET_UPDATED = "SET_UPDATED";
export const REMOVE_TAG = "REMOVE_TAG";
export const SET_NOFILE = "SET_NOFILE";
export const SET_FOLDER_OPTIONS = "SET_FOLDER_OPTIONS";
export const SET_FILE_OPTIONS = "SET_FILE_OPTIONS";
export const TOGGLE_TAG_FILTER = "TOGGLE_TAG_FILTER";
export const SET_PERCENTAGE = "SET_PERCENTAGE";
export const SET_SCROLLING_VIEW = "SET_SCROLLING_VIEW";
export const SET_INITIAL_FOLDERS = "SET_INITIAL_FOLDERS";
export const SET_CODE = "SET_CODE";
export const SET_SNAPSHOT = "SET_SNAPSHOT";
export const TOGGLE_ALL_NOTES = "TOGGLE_ALL_NOTES";
export const SET_INITIAL_TAGS = "SET_INITIAL_TAGS";

const editorReducer = (state, action) => {
  if (action.type === ASSIGN_CODE) {
    const newState = {
      ...state,
      code: action.payload,
      codeSnapshot: action.payload,
    };
    return newState;
  }

  if (action.type === OPEN_MODAL) {
    const newState = {
      ...state,
      isModalOpen: true,
      isShortcutsOpen: false,
      modalMode: action.payload,
      modalValue: state.modalValue ? state.modalValue : "Untitled",
    };
    return newState;
  }

  if (action.type === CLOSE_MODAL) {
    const newState = {
      ...state,
      isModalOpen: false,
      modalMode: "",
      modalValue: "",
    };
    return newState;
  }

  if (action.type === TOGGLE_FULLSCREEN) {
    const tempVal = state.fullscreen === action.payload ? "" : action.payload;
    const newState = { ...state, fullscreen: tempVal };
    return newState;
  }

  if (action.type === UPDATE_PARENT) {
    const newState = {
      ...state,
      parent: action.payload,
      currentlySelectedTag: null,
    };
    return newState;
  }

  if (action.type === UPDATE_TAG) {
    const newState = {
      ...state,
      currentlySelectedTag: action.payload,
      parent: null,
    };
    return newState;
  }

  if (action.type === APPEND_CHILD) {
    return action.payload;
  }

  if (action.type === UPDATE_MODAL) {
    const newState = { ...state, modalValue: action.payload };
    return newState;
  }

  if (action.type === FIND_ITEM) {
    let val;
    if (action.payload === "edit-folder") {
      val = state.files.items.find((item) => item.id === state.parent).name;
    } else {
      val = state.code.title;
      console.log("val ==> ", val);
    }
    const newState = { ...state, modalValue: val };
    return newState;
  }

  if (action.type === UPDATE_CODE) {
    const newState = {
      ...state,
      code: { ...state.code, code: action.payload },
    };
    return newState;
  }

  if (action.type === GET_AMOUNT) {
    const amount = state.files.items.reduce((total, current) => {
      total += current.items.length;
      return total;
    }, 0);
    const newState = { ...state, totalAmount: amount };
    return newState;
  }

  if (action.type === UPDATE_CURRENT_FILE) {
    const newState = { ...state, currentlySelectedFile: action.payload };
    return newState;
  }

  if (action.type === SET_NOFILE) {
    const newState = { ...state, noFile: action.payload };
    return newState;
  }

  if (action.type === UPDATE_TAG_VALUE) {
    const newState = { ...state, tagInput: action.payload };
    return newState;
  }

  if (action.type === SET_UPDATED) {
    const newState = { ...state, filesUpdated: state.filesUpdated + 1 };
    return newState;
  }

  if (action.type === ADD_NEW_TAG) {
    const tagArray = [...state.tags, action.payload];
    const newState = { ...state, tags: tagArray };
    return newState;
  }

  if (action.type === CLEAR_TAG_INPUT) {
    const newState = { ...state, tagInput: "" };
    return newState;
  }

  if (action.type === CLOSE_SHORCUTS_MODAL) {
    const newState = { ...state, isShortcutsOpen: false };
    return newState;
  }
  if (action.type === SET_FOLDER_OPTIONS) {
    const newState = { ...state, showFolderOptions: action.payload };
    return newState;
  }
  if (action.type === SET_FILE_OPTIONS) {
    const newState = { ...state, showFileOptions: action.payload };
    return newState;
  }

  if (action.type === OPEN_SHORCUTS_MODAL) {
    const newState = { ...state, isShortcutsOpen: true };
    return newState;
  }

  if (action.type === TOGGLE_SIDEBAR) {
    const newState = { ...state, isSidebarVisible: !state.isSidebarVisible };
    return newState;
  }
  if (action.type === TOGGLE_TAG_FILTER) {
    const newState = { ...state, showTagFilter: action.payload };
    return newState;
  }

  if (action.type === CODE_LOADING) {
    const newState = { ...state, isCodeLoading: action.payload };
    return newState;
  }

  if (action.type === REMOVE_TAG) {
    const tempCode = [...state.code.tags];
    const newList = tempCode.filter((code) => code !== action.payload);
    const newState = { ...state, code: { ...state.code, tags: newList } };
    return newState;
  }

  if (action.type === RESET_SNAPSHOT) {
    const newState = { ...state, codeSnapshot: state.code };
    return newState;
  }

  if (action.type === TOGGLE_AVATAR_DROPDOWN) {
    const newState = {
      ...state,
      showAvatarDropdown: action.payload,
    };
    return newState;
  }

  if (action.type === SET_DATA) {
    const { totalAmount, files, tags } = action.payload;
    let parent = null;
    let child = null;
    let selected = false;
    let isThereFolders = files.items.length > 0;
    let noFile = false;

    if (isThereFolders) {
      files.items.forEach((folder) => {
        if (folder.items.length > 0) {
          parent = folder.id;
          child = folder.items[0].id;
          selected = true;
        }
      });

      if (!selected) {
        parent = files.items[0].id;
        noFile = true;
      }
    } else {
      noFile = true;
    }

    const newState = {
      ...state,
      totalAmount,
      files,
      tags,
      currentlySelectedFile: child,
      parent,
      noFile,
    };
    return newState;
  }

  if (action.type === TOGGLE_TAG) {
    const tempTags = state.tags.concat();
    const id = action.payload;
    const code = { ...state.code, tags: [...state.code.tags, id] };
    console.log(code);
    const finalTags = tempTags.map((tag) => {
      if (tag.id === id) {
        return { ...tag, items: [...tag.items, state.currentlySelectedFile] };
      }
      return tag;
    });
    return { ...state, code, tags: finalTags };
  }

  if (action.type === SET_PERCENTAGE) {
    return { ...state, scrollPercentage: action.payload };
  }

  if (action.type === SET_SCROLLING_VIEW) {
    return { ...state, scrollingView: action.payload };
  }

  if (action.type === SET_INITIAL_FOLDERS) {
    return { ...state, files: action.payload };
  }

  if (action.type === SET_CODE) {
    return { ...state, code: action.payload };
  }

  if (action.type === SET_SNAPSHOT) {
    return { ...state, codeSnapshot: action.payload };
  }

  if (action.type === TOGGLE_ALL_NOTES) {
    return { ...state, showAllNotes: action.payload };
  }

  if (action.type === SET_INITIAL_TAGS) {
    return {
      ...state,
      tags: [...action.payload],
    };
  }

  return state;
};

export default editorReducer;
