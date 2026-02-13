const carProfiles = {
  "Tesla Model 3": {
    materials: ["vegan-læder", "alcantara", "plastik-trim", "glas", "mat lak"],
    interior: [
      "Interiørrens til vegansk læder",
      "Skånsom alcantara-rens",
      "Antistatisk dashboard-rens",
      "Glasrens uden striber"
    ],
    exterior: [
      "pH-neutral forvask",
      "Keramisk shampoo",
      "Felgrens til coatede fælge",
      "Spray-sealant til mat lak"
    ]
  },
  "BMW 3-serie": {
    materials: ["læder", "blødt plast", "aluminiumslister", "klarlak", "stofmåtte"],
    interior: [
      "Læderrens + conditioner",
      "Interiørrens til plastdetaljer",
      "Mikrofiber-rens til måtter",
      "Lugtfjerner til kabine"
    ],
    exterior: [
      "Aktiv skumforvask",
      "Bilshampoo med voks",
      "Tjærefjerner",
      "Dækglans + fælgbeskyttelse"
    ]
  },
  "Volkswagen Golf": {
    materials: ["tekstil", "hård plast", "gummilister", "metallak", "stofmåtte"],
    interior: [
      "Tekstilrens til sæder",
      "Universal interiørrens",
      "Gummifornyer til lister",
      "Glasrens til rude og spejle"
    ],
    exterior: [
      "Citrus-forvask",
      "pH-neutral shampoo",
      "Insektfjerner",
      "Sprayvoks til metallak"
    ]
  },
  "Mercedes C-Klasse": {
    materials: ["nappa-læder", "træpaneler", "pianolak", "klarlak", "alcantara-loft"],
    interior: [
      "Premium læderrens",
      "Træ- og panelrens",
      "Blid rens til pianolak",
      "Alcantara-opfrisker"
    ],
    exterior: [
      "Snow foam",
      "SiO2 shampoo",
      "Clay-lube og claybar",
      "Keramisk quick detailer"
    ]
  }
};

const plateLookup = {
  AB12345: "Tesla Model 3",
  CX98765: "BMW 3-serie",
  DD11223: "Volkswagen Golf",
  EF44556: "Mercedes C-Klasse"
};

const brandModels = {
  Tesla: ["Model 3"],
  BMW: ["3-serie"],
  Volkswagen: ["Golf"],
  Mercedes: ["C-Klasse"]
};

const brandSelect = document.getElementById("brand");
const modelSelect = document.getElementById("model");
const plateInput = document.getElementById("plate");
const carForm = document.getElementById("car-form");
const clearButton = document.getElementById("clear");

const resultsSection = document.getElementById("results");
const carSummary = document.getElementById("car-summary");
const exteriorList = document.getElementById("exterior-list");
const interiorList = document.getElementById("interior-list");
const materialsList = document.getElementById("materials-list");

Object.keys(brandModels).forEach((brand) => {
  const option = document.createElement("option");
  option.value = brand;
  option.textContent = brand;
  brandSelect.appendChild(option);
});

brandSelect.addEventListener("change", () => {
  const selectedBrand = brandSelect.value;
  const models = brandModels[selectedBrand] ?? [];
  modelSelect.innerHTML = '<option value="">Vælg model</option>';

  models.forEach((model) => {
    const option = document.createElement("option");
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });

  modelSelect.disabled = models.length === 0;
});

plateInput.addEventListener("input", () => {
  plateInput.value = plateInput.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
});

carForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const plate = plateInput.value.trim();
  const matchedByPlate = plateLookup[plate];

  let selectedCar;
  if (matchedByPlate) {
    selectedCar = matchedByPlate;
  } else if (brandSelect.value && modelSelect.value) {
    selectedCar = `${brandSelect.value} ${modelSelect.value}`;
  }

  if (!selectedCar || !carProfiles[selectedCar]) {
    alert("Kunne ikke finde bilen. Vælg mærke/model eller brug en kendt nummerplade.");
    return;
  }

  renderRecommendations(selectedCar, carProfiles[selectedCar]);
});

clearButton.addEventListener("click", () => {
  carForm.reset();
  modelSelect.disabled = true;
  modelSelect.innerHTML = '<option value="">Vælg model</option>';
  resultsSection.hidden = true;
});

function renderRecommendations(carName, profile) {
  exteriorList.innerHTML = "";
  interiorList.innerHTML = "";
  materialsList.innerHTML = "";

  profile.exterior.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    exteriorList.appendChild(li);
  });

  profile.interior.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    interiorList.appendChild(li);
  });

  profile.materials.forEach((material) => {
    const li = document.createElement("li");
    li.textContent = material;
    materialsList.appendChild(li);
  });

  carSummary.textContent = `Bil fundet: ${carName}. Produkter er tilpasset materialerne i bilen.`;
  resultsSection.hidden = false;
}
