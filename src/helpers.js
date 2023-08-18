const selectFile = (array, id) => {
  array.forEach((item) => {
    if (item.id === id) {
      item.isSelected = true;
    } else {
      if (item.isFolder) selectFile(item.items, id);
    }
  });
};

const unselectAll = (array) => {
  array.forEach((item) => {
    if (item.isFolder) unselectAll(item.items);
    else item.isSelected = false;
  });
};

export { selectFile, unselectAll };
