import { Color } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";

// SET UP IFC.js

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xdddddd),
});
viewer.IFC.setWasmPath("./wasm-0-0-35/");

document.addEventListener("drop", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const file = event.dataTransfer.files[0];
  const fileUrl = URL.createObjectURL(file);

  // Vérifiez si le fichier déposé est un fichier .ifc
  if (file.name.endsWith(".ifc")) {
    const dropInstruction = document.getElementById("drop-instruction");
    dropInstruction.style.display = "none";
    const loadingIcon = document.getElementById("spinner-container");
    loadingIcon.style.display = "flex";

    // Create grid and axes
    viewer.grid.setGrid();
    viewer.axes.setAxes();

    // Add buttons
    const buttonsContainer = document.getElementById("buttons-container");
    buttonsContainer.style.display = "block";

    async function loadIfc(url) {
      // Load the model
      const model = await viewer.IFC.loadIfcUrl(url);

      // Add dropped shadow and post-processing efect
      await viewer.shadowDropper.renderShadow(model.modelID);
      //viewer.context.renderer.postProduction.active = true;

      loadingIcon.style.display = "none";
    }

    loadIfc(fileUrl);
  }
});

document.addEventListener("dragover", function (event) {
  event.preventDefault();
  event.stopPropagation();
});

// BUTTONS
const buttonInstructionsMain = document.getElementById(
  "button-instructions-main"
);
const buttonInstructionsMainBase =
  "Activer un ou des outil(s) ci-dessus par simple-clic. Ils peuvent fonctionner de manière combinée.";
buttonInstructionsMain.textContent = buttonInstructionsMainBase;
const buttonInstructionsEscape = document.getElementById(
  "button-instructions-escape"
);
buttonInstructionsEscape.style.display = "none";

const infosButton = document.getElementById("infos-button");
const clipperButton = document.getElementById("clipper-button");
const dimensionsButton = document.getElementById("dimensions-button");

// INFOS BUTTON
const ifcPropertyMenu = document.getElementById("ifc-property-menu");
const propertiesGUI = document.getElementById("ifc-property-menu-root");

function infosButtonActive() {
  infosButton.classList.add("active-button");
  clipperButton.classList.remove("active-button");
  dimensionsButton.classList.remove("active-button");
  buttonInstructionsMain.textContent =
    "Double-cliquer sur un élément pour afficher ses propriétés.";
  buttonInstructionsEscape.style.display = "inline";
  ifcPropertyMenu.style.display = "block";

  window.onmousemove = () => {
    viewer.IFC.selector.prePickIfcItem();
  };

  window.ondblclick = async () => {
    const result = await viewer.IFC.selector.highlightIfcItem();
    if (!result) return;
    const { modelID, id } = result;

    // Item Properties
    const itemProperties = await viewer.IFC.loader.ifcManager.getItemProperties(
      modelID,
      id,
      true,
      false
    );

    createItemPropertiesMenu(itemProperties);

    function createItemPropertiesMenu(ItemProperties) {
      removeAllChildren(propertiesGUI);
      for (let key in ItemProperties) {
        if (
          key === "expressID" ||
          key === "GlobalId" ||
          key === "Name" ||
          key === "Description"
        )
          createItemPropertiesEntry(key, ItemProperties[key]);
      }
    }

    function createItemPropertiesEntry(key, value) {
      const itemPropertyContainer = document.createElement("div");
      itemPropertyContainer.classList.add("ifc-property-item");

      if (value === null || value === undefined) value = "undefined";
      else if (value.value) value = value.value;

      const keyElement = document.createElement("div");
      keyElement.textContent = key + ":";
      itemPropertyContainer.appendChild(keyElement);

      const valueElement = document.createElement("div");
      valueElement.classList.add("ifc-property-value");
      valueElement.textContent = value;
      itemPropertyContainer.appendChild(valueElement);

      propertiesGUI.appendChild(itemPropertyContainer);
    }

    // Ifc Type
    const ifcType = await viewer.IFC.loader.ifcManager.getIfcType(modelID, id);

    console.log(ifcType);
    createIfcTypeMenu(ifcType);

    function createIfcTypeMenu(ifcType) {
      createTypePropertyEntry("IfcType", ifcType);
    }

    function createIfcTypeEntry(key, value) {
      const ifcTypeContainer = document.createElement("div");
      ifcTypeContainer.classList.add("ifc-property-item");

      if (value === null || value === undefined) value = "undefined";
      else if (value.value) value = value.value;

      const ifcTypeKeyElement = document.createElement("div");
      ifcTypeKeyElement.textContent = key + ":";
      ifcTypeContainer.appendChild(ifcTypeKeyElement);

      const ifcTypeValueElement = document.createElement("div");
      ifcTypeValueElement.classList.add("ifc-property-value");
      ifcTypeValueElement.textContent = value;
      ifcTypeContainer.appendChild(ifcTypeValueElement);

      propertiesGUI.appendChild(ifcTypeContainer);
    }

    // Type Properties
    const typeProperties = await viewer.IFC.loader.ifcManager.getTypeProperties(
      modelID,
      id
    );

    createTypePropertiesMenu(typeProperties);

    function createTypePropertiesMenu(typeProperties) {
      for (const typeProperty of typeProperties) {
        const typePropertyNameValue = typeProperty.Name.value;
        /*
        const typePropertyNameValueCorrect = typePropertyNameValue.replace("/\X2\00E9\X0\/", "é");
        */
        createTypePropertyEntry("Matériau", typePropertyNameValue);
      }
    }

    function createTypePropertyEntry(key, value) {
      const typePropertyContainer = document.createElement("div");
      typePropertyContainer.classList.add("ifc-property-item");

      if (value === null || value === undefined) value = "undefined";
      else if (value.value) value = value.value;

      const typePropertyKeyElement = document.createElement("div");
      typePropertyKeyElement.textContent = key + ":";
      typePropertyContainer.appendChild(typePropertyKeyElement);

      const typePropertyValueElement = document.createElement("div");
      typePropertyValueElement.classList.add("ifc-property-value");
      typePropertyValueElement.textContent = value;
      typePropertyContainer.appendChild(typePropertyValueElement);

      propertiesGUI.appendChild(typePropertyContainer);
    }
  };

  function removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

function infosButtonDisable() {
  infosButton.classList.remove("active-button");
  ifcPropertyMenu.style.display = "none";
  window.onmousemove = () => {};
  window.ondblclick = () => {};
  viewer.IFC.selector.unpickIfcItems();
  viewer.IFC.selector.unHighlightIfcItems();
  propertiesGUI.textContent = "";
  buttonInstructionsMain.textContent = buttonInstructionsMainBase;
  buttonInstructionsEscape.style.display = "none";
}

let infosButtonBoolean = false;
infosButton.onclick = () => {
  infosButtonBoolean = !infosButtonBoolean;
  if (infosButtonBoolean) {
    infosButtonActive();
  } else {
    infosButtonDisable();
  }
};

// CLIPPER BUTTON
function clipperButtonActive() {
  infosButton.classList.remove("active-button");
  clipperButton.classList.add("active-button");
  dimensionsButton.classList.remove("active-button");
  buttonInstructionsMain.textContent =
    "Double-cliquer sur la face d'un élément pour y créer un plan de coupe. Ces plans de coupe peuvent être multiples.";
  buttonInstructionsEscape.style.display = "inline";
  viewer.clipper.active = true;
  window.ondblclick = () => {
    viewer.clipper.createPlane();
  };
}

function clipperButtonDisable() {
  clipperButton.classList.remove("active-button");
  viewer.clipper.active = false;
  buttonInstructionsMain.textContent = buttonInstructionsMainBase;
  buttonInstructionsEscape.style.display = "none";
  viewer.clipper.deleteAllPlanes();
}

let clipperButtonBoolean = false;
clipperButton.onclick = () => {
  clipperButtonBoolean = !clipperButtonBoolean;
  if (clipperButtonBoolean) {
    clipperButtonActive();
  } else {
    clipperButtonDisable();
  }
};

// DIMENSIONS BUTTON
function dimensionsButtonActive() {
  infosButton.classList.remove("active-button");
  clipperButton.classList.remove("active-button");
  dimensionsButton.classList.add("active-button");  buttonInstructionsMain.textContent =
    "Double-cliquer sur deux points pour ajouter une cote.";
  buttonInstructionsEscape.style.display = "inline";
  viewer.dimensions.previewActive = true;
  viewer.dimensions.active = true;
  window.ondblclick = () => {
    viewer.dimensions.create();
  };
}

function dimensionsButtonDisable() {
  dimensionsButton.classList.remove("active-button");
  viewer.dimensions.previewActive = false;
  viewer.dimensions.active = false;
  buttonInstructionsMain.textContent = buttonInstructionsMainBase;
  buttonInstructionsEscape.style.display = "none";
  viewer.dimensions.deleteAll();
}

let dimensionsButtonBoolean = false;
dimensionsButton.onclick = () => {
  dimensionsButtonBoolean = !dimensionsButtonBoolean;
  if (dimensionsButtonBoolean) {
    dimensionsButtonActive();
  } else {
    dimensionsButtonDisable();
  }
};

// ESC ALL BUTTONS
function escAllButtons() {
  infosButtonDisable();
  infosButtonBoolean = false;
  clipperButtonDisable();
  clipperButtonBoolean = false;
  dimensionsButtonDisable();
  dimensionsButtonBoolean = false;
  buttonInstructionsMain.textContent = buttonInstructionsMainBase;
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    escAllButtons();
  }
});
