const vehicleCatalog = {
  Tesla: {
    "Model 3": {
      seatMaterial: "vegan-læder",
      dashboardMaterial: "blød plast",
      doorMaterial: "alcantara",
      floorMaterial: "tekstil",
      paintType: "klarlak",
      wheelFinish: "lakeret"
    },
    "Model Y": {
      seatMaterial: "vegan-læder",
      dashboardMaterial: "blød plast",
      doorMaterial: "tekstil",
      floorMaterial: "tekstil",
      paintType: "klarlak",
      wheelFinish: "lakeret"
    }
  },
  BMW: {
    "3-serie": {
      seatMaterial: "læder",
      dashboardMaterial: "blød plast",
      doorMaterial: "læder",
      floorMaterial: "stofmåtte",
      paintType: "metallak",
      wheelFinish: "poleret"
    }
  },
  Volkswagen: {
    Golf: {
      seatMaterial: "tekstil",
      dashboardMaterial: "hård plast",
      doorMaterial: "tekstil",
      floorMaterial: "gummi",
      paintType: "metallak",
      wheelFinish: "lakeret"
    }
  },
  Mercedes: {
    "C-Klasse": {
      seatMaterial: "nappa-læder",
      dashboardMaterial: "pianolak",
      doorMaterial: "læder",
      floorMaterial: "velour",
      paintType: "klarlak",
      wheelFinish: "diamond-cut"
    }
  }
};

const plateLookup = {
  AB12345: { brand: "Tesla", model: "Model 3" },
  CX98765: { brand: "BMW", model: "3-serie" },
  DD11223: { brand: "Volkswagen", model: "Golf" },
  EF44556: { brand: "Mercedes", model: "C-Klasse" }
};

const materialOptions = {
  seatMaterial: ["læder", "nappa-læder", "vegan-læder", "tekstil", "alcantara"],
  dashboardMaterial: ["blød plast", "hård plast", "pianolak", "træ", "aluminium"],
  doorMaterial: ["læder", "tekstil", "alcantara", "plast", "vinyl"],
  floorMaterial: ["stofmåtte", "velour", "gummi", "tekstil"],
  paintType: ["klarlak", "metallak", "mat lak"],
  wheelFinish: ["lakeret", "poleret", "diamond-cut", "sort blank"]
};

const materialRules = {
  seatMaterial: {
    "læder": ["Læderrens", "Læder conditioner"],
    "nappa-læder": ["Skånsom nappa-rens", "Nappa-balsam"],
    "vegan-læder": ["pH-neutral interiørrens", "UV-beskyttende dressing"],
    "tekstil": ["Tekstilrens til sæder", "Pletfjerner til stof"],
    "alcantara": ["Alcantara-rens", "Blød børste til alcantara"]
  },
  dashboardMaterial: {
    "blød plast": ["Antistatisk dashboard-rens"],
    "hård plast": ["Universal APC til interiør"],
    "pianolak": ["Fingeraftrykssikker panelrens"],
    "træ": ["Trævenlig interiørrens"],
    "aluminium": ["Metal-safe interiørrens"]
  },
  doorMaterial: {
    "læder": ["Læderrens til dørpaneler"],
    "tekstil": ["Tekstil-opfrisker"],
    "alcantara": ["Alcantara-opfrisker"],
    "plast": ["Plastikrens"],
    "vinyl": ["Vinylrens + beskytter"]
  },
  floorMaterial: {
    "stofmåtte": ["Mikrofiber-rens til måtter"],
    "velour": ["Velourrens"],
    "gummi": ["Gummirens + fornyer"],
    "tekstil": ["Tekstilrens til gulv"]
  },
  paintType: {
    "klarlak": ["pH-neutral shampoo", "Keramisk spray-sealant"],
    "metallak": ["Shampoo med glansforstærker", "Sprayvoks til metallak"],
    "mat lak": ["Mat-lak sikker shampoo", "Mat-lak detailer"]
  },
  wheelFinish: {
    "lakeret": ["pH-neutral felgrens"],
    "poleret": ["Syrefri felgrens til polerede fælge"],
    "diamond-cut": ["Skånsom felgrens til diamond-cut"],
    "sort blank": ["Felgrens med højglans-beskyttelse"]
  }
};

const baseExterior = ["Forvask (snow foam)", "Insektfjerner", "Dækglans"];
const baseInterior = ["Kabine-støvsugning", "Glasrens uden striber", "Lugtfjerner"];

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const plateInput = document.getElementById("plate");
const carForm = document.getElementById("car-form");
const clearButton = document.getElementById("clear");
const lookupStatus = document.getElementById("lookup-status");

const materialEditor = document.getElementById("material-editor");
const updateRecommendationsButton = document.getElementById("update-recommendations");
const seatMaterialSelect = document.getElementById("seat-material");
const dashboardMaterialSelect = document.getElementById("dashboard-material");
const doorMaterialSelect = document.getElementById("door-material");
const floorMaterialSelect = document.getElementById("floor-material");
const paintTypeSelect = document.getElementById("paint-type");
const wheelFinishSelect = document.getElementById("wheel-finish");

const resultsSection = document.getElementById("results");
const carSummary = document.getElementById("car-summary");
const exteriorList = document.getElementById("exterior-list");
const interiorList = document.getElementById("interior-list");
const materialsList = document.getElementById("materials-list");

let currentCar = null;

init();

function init() {
  Object.keys(vehicleCatalog).forEach((brand) => appendOption(brandSelect, brand, brand));
  fillMaterialSelect(seatMaterialSelect, materialOptions.seatMaterial);
  fillMaterialSelect(dashboardMaterialSelect, materialOptions.dashboardMaterial);
  fillMaterialSelect(doorMaterialSelect, materialOptions.doorMaterial);
  fillMaterialSelect(floorMaterialSelect, materialOptions.floorMaterial);
  fillMaterialSelect(paintTypeSelect, materialOptions.paintType);
  fillMaterialSelect(wheelFinishSelect, materialOptions.wheelFinish);
}

brandSelect.addEventListener("change", () => {
  const brand = brandSelect.value;
  modelSelect.innerHTML = '<option value="">Vælg model</option>';

  if (!brand) {
    modelSelect.disabled = true;
    return;
  }

  Object.keys(vehicleCatalog[brand]).forEach((model) => appendOption(modelSelect, model, model));
  modelSelect.disabled = false;
});

plateInput.addEventListener("input", () => {
  plateInput.value = plateInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});

carForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const plate = plateInput.value.trim();
  const byPlate = plateLookup[plate];

  if (byPlate) {
    applyVehicle(byPlate.brand, byPlate.model, "Nummerplade fundet i systemet.");
    return;
  }

  if (brandSelect.value && modelSelect.value) {
    applyVehicle(brandSelect.value, modelSelect.value, "Valgt via mærke og model.");
    return;
  }

  lookupStatus.textContent =
    "Ingen match endnu. Vælg mærke/model eller brug en kendt nummerplade (fx AB12345).";
});

updateRecommendationsButton.addEventListener("click", () => {
  if (!currentCar) {
    return;
  }

  currentCar.profile = getProfileFromEditor();
  renderRecommendations(currentCar.brand, currentCar.model, currentCar.profile, "Materialer opdateret manuelt.");
});

clearButton.addEventListener("click", () => {
  carForm.reset();
  modelSelect.innerHTML = '<option value="">Vælg model</option>';
  modelSelect.disabled = true;
  resultsSection.hidden = true;
  materialEditor.hidden = true;
  lookupStatus.textContent = "";
  currentCar = null;
});

function applyVehicle(brand, model, statusText) {
  const defaultProfile = vehicleCatalog[brand]?.[model];

  if (!defaultProfile) {
    lookupStatus.textContent = "Denne kombination findes ikke i kataloget endnu.";
    return;
  }

  brandSelect.value = brand;
  brandSelect.dispatchEvent(new Event("change"));
  modelSelect.value = model;

  setEditorFromProfile(defaultProfile);
  materialEditor.hidden = false;
  lookupStatus.textContent = statusText;

  currentCar = { brand, model, profile: { ...defaultProfile } };
  renderRecommendations(brand, model, defaultProfile, statusText);
}

function renderRecommendations(brand, model, profile, statusText) {
  const interior = [...baseInterior];
  const exterior = [...baseExterior];

  Object.entries(profile).forEach(([key, value]) => {
    const products = materialRules[key]?.[value] ?? [];
    const target = key === "paintType" || key === "wheelFinish" ? exterior : interior;
    products.forEach((product) => {
      if (!target.includes(product)) {
        target.push(product);
      }
    });
  });

  carSummary.textContent = `${brand} ${model}. ${statusText}`;

  renderList(interiorList, interior);
  renderList(exteriorList, exterior);
  renderList(materialsList, [
    `Sæder: ${profile.seatMaterial}`,
    `Dashboard: ${profile.dashboardMaterial}`,
    `Døre: ${profile.doorMaterial}`,
    `Gulv: ${profile.floorMaterial}`,
    `Lak: ${profile.paintType}`,
    `Fælge: ${profile.wheelFinish}`
  ]);

  resultsSection.hidden = false;
}

function setEditorFromProfile(profile) {
  seatMaterialSelect.value = profile.seatMaterial;
  dashboardMaterialSelect.value = profile.dashboardMaterial;
  doorMaterialSelect.value = profile.doorMaterial;
  floorMaterialSelect.value = profile.floorMaterial;
  paintTypeSelect.value = profile.paintType;
  wheelFinishSelect.value = profile.wheelFinish;
}

function getProfileFromEditor() {
  return {
    seatMaterial: seatMaterialSelect.value,
    dashboardMaterial: dashboardMaterialSelect.value,
    doorMaterial: doorMaterialSelect.value,
    floorMaterial: floorMaterialSelect.value,
    paintType: paintTypeSelect.value,
    wheelFinish: wheelFinishSelect.value
  };
}

function renderList(listElement, values) {
  listElement.innerHTML = "";
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    listElement.appendChild(item);
  });
}

function fillMaterialSelect(selectElement, values) {
  selectElement.innerHTML = "";
  values.forEach((value) => appendOption(selectElement, value, value));
}

function appendOption(selectElement, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  selectElement.appendChild(option);
}
