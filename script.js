const folderStructure = {
  name: "Root",
  type: "folder",
  id: "0",
  children: [
    {
      name: "Folder 1",
      type: "folder",
      id: "0-0",
      children: [
        { name: "File 1.txt", type: "file", id: "0-0-0" },
        { name: "File 2.txt", type: "file", id: "0-0-1" },
      ],
    },
    {
      name: "Folder 2",
      type: "folder",
      id: "0-1",
      children: [{ name: "File 3.txt", type: "file", id: "0-1-0" }],
    },
  ],
};

function createTreeElement(item, id) {
  const element = document.createElement("div");
  element.textContent = item.name;
  element.classList.add("item");
  element.dataset.id = id;
  if (item.type === "folder" && item.children) {
    element.classList.add("folder");
    const toggleIcon = document.createElement("span");
    toggleIcon.classList.add("toggle-icon");
    toggleIcon.classList.add("fas"); /* ใช้ไอคอนจาก Font Awesome */
    toggleIcon.classList.add("fa-folder");
    element.appendChild(toggleIcon);
    const childrenContainer = document.createElement("div");
    childrenContainer.classList.add("children");
    item.children.forEach((child, index) => {
      const childElement = createTreeElement(child, `${id}-${index}`);
      childrenContainer.appendChild(childElement);
    });
    element.appendChild(childrenContainer);
    if (item.name !== "Root") {
      childrenContainer.classList.add("open");
    }
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleIcon.classList.toggle("fa-folder-open"); /* สลับไอคอนเมื่อคลิก */
      childrenContainer.classList.toggle("open");
    });
  } else {
    element.classList.add(item.type);
    if (item.name.endsWith(".txt")) {
      element.classList.add("txt-file");
      const fileIcon = document.createElement("span");
      fileIcon.classList.add("fas"); /* ใช้ไอคอนจาก Font Awesome */
      fileIcon.classList.add("fa-file-alt");
      element.insertBefore(fileIcon, element.firstChild);
    }
  }
  return element;
}

function addNewFolder(selectedId, newFolderName) {
  const selectedElement = document.querySelector(`[data-id="${selectedId}"]`);
  if (selectedElement && selectedElement.classList.contains("folder")) {
    const childrenContainer = selectedElement.querySelector(".children");
    if (childrenContainer) {
      const newFolder = {
        name: newFolderName,
        type: "folder",
        id: `${selectedId}-${Date.now()}`,
        children: [],
      };
      const newFolderElement = createTreeElement(newFolder, newFolder.id);
      childrenContainer.appendChild(newFolderElement);
    }
  }
}

function addNewFile(selectedId, newFileName) {
  const selectedElement = document.querySelector(`[data-id="${selectedId}"]`);
  if (selectedElement) {
    const childrenContainer = selectedElement.querySelector(".children");
    if (childrenContainer) {
      const newFile = {
        name: newFileName.endsWith(".txt") ? newFileName : `${newFileName}.txt`,
        type: "file",
        id: `${selectedId}-${Date.now()}`,
      };
      const newFileElement = createTreeElement(newFile, newFile.id);
      childrenContainer.appendChild(newFileElement);
    }
  }
}

function deleteItem(selectedId) {
  const selectedElement = document.querySelector(`[data-id="${selectedId}"]`);
  if (selectedElement) {
    selectedElement.remove();
  }
}

function populateSelectInput(selectId, structure) {
  const selectInput = document.getElementById(selectId);
  selectInput.innerHTML = "";

  const traverse = (node, prefix = "") => {
    const option = document.createElement("option");
    option.value = node.id;
    option.textContent = prefix + node.name;
    selectInput.appendChild(option);
    if (node.children) {
      node.children.forEach((child, index) => {
        traverse(child, prefix + "    ");
      });
    }
  };

  traverse(structure);
}

document.addEventListener("DOMContentLoaded", () => {
  const folderTree = document.getElementById("folderTree");
  const treeElement = createTreeElement(folderStructure, "0");
  folderTree.appendChild(treeElement);

  const addButton = document.getElementById("addButton");
  const deleteButton = document.getElementById("deleteButton");
  const newItemInput = document.getElementById("newItemInput");
  const deleteSelect = document.getElementById("deleteSelect");

  populateSelectInput("selectInput", folderStructure);
  populateSelectInput("deleteSelect", folderStructure);

  addButton.addEventListener("click", () => {
    const selectedId = document.getElementById("selectInput").value;
    const newItemName = newItemInput.value;
    if (newItemName.endsWith("/")) {
      addNewFolder(selectedId, newItemName);
      populateSelectInput("selectInput", folderStructure);
      populateSelectInput("deleteSelect", folderStructure);
    } else {
      addNewFile(selectedId, newItemName);
    }
  });

  deleteButton.addEventListener("click", () => {
    const selectedId = deleteSelect.value;
    deleteItem(selectedId);
    populateSelectInput("selectInput", folderStructure);
    populateSelectInput("deleteSelect", folderStructure);
  });
});
