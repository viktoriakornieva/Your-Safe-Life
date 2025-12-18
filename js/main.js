// Your Safe Life — main JS (calculator logic)

function formatUAH(value) {
  const num = Number(value);
  if (!isFinite(num)) return "0.00 грн";
  return num.toFixed(2) + " грн";
}

function byId(id) {
  return document.getElementById(id);
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function createOption(value, label) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function initCalculator() {
  const form = byId("calcForm");
  if (!form) return;

  const typeSelect = byId("insuranceType");
  const monthsSelect = byId("termMonths");
  const sumInput = byId("insuredSum");
  const subTypeSelect = byId("subType");
  const subTypeWrap = byId("subTypeWrap");
  const optionsWrap = byId("optionsWrap");
  const optionsList = byId("optionsList");

  const resultBlock = byId("resultBlock");
  const resultValue = byId("resultValue");
  const resultNote = byId("resultNote");

  // Fill months 1..48
  if (monthsSelect && monthsSelect.options.length === 0) {
    for (let m = 1; m <= 48; m++) {
      monthsSelect.appendChild(createOption(String(m), String(m)));
    }
    monthsSelect.value = "12";
  }

  // Fill insurance type options
  if (typeSelect && typeSelect.options.length === 0) {
    typeSelect.appendChild(createOption("property", INSURANCE_DATA.property.label));
    typeSelect.appendChild(createOption("health", INSURANCE_DATA.health.label));
    typeSelect.appendChild(createOption("travel", INSURANCE_DATA.travel.label));
  }

  // Preselect type from query string if present
  const preset = getQueryParam("type");
  if (preset && INSURANCE_DATA[preset] && typeSelect) {
    typeSelect.value = preset;
  }

  function rebuildSubTypeAndOptions() {
    const typeKey = typeSelect.value;
    const data = INSURANCE_DATA[typeKey];

    // Sub-type: show only for property (multiple risk categories)
    if (typeKey === "property") {
      subTypeWrap.classList.remove("hidden");
      clearNode(subTypeSelect);
      Object.keys(data.risks).forEach((k) => {
        subTypeSelect.appendChild(createOption(k, data.risks[k].label));
      });
    } else {
      subTypeWrap.classList.add("hidden");
      clearNode(subTypeSelect);
      // keep a safe value
      subTypeSelect.appendChild(createOption(Object.keys(data.risks)[0], data.risks[Object.keys(data.risks)[0]].label));
    }

    // Options (checkbox list)
    clearNode(optionsList);
    const optionKeys = Object.keys(data.options);
    optionKeys.forEach((ok) => {
      const opt = data.options[ok];

      const label = document.createElement("label");
      label.className = "check";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "options";
      input.value = ok;

      const textWrap = document.createElement("div");

      const title = document.createElement("div");
      title.className = "check-title";
      title.textContent = opt.label;

      const desc = document.createElement("div");
      desc.className = "check-desc";
      desc.textContent = "Доплата: " + formatUAH(opt.price);

      textWrap.appendChild(title);
      textWrap.appendChild(desc);

      label.appendChild(input);
      label.appendChild(textWrap);

      optionsList.appendChild(label);
    });

    // Set note about franchise
    if (resultNote) {
      resultNote.textContent = "Безумовна франшиза: " + FRANCHISE_PERCENT + "% (умова виплат, не впливає на розрахунок премії).";
    }
  }

  function calcPremium() {
    const typeKey = typeSelect.value;
    const data = INSURANCE_DATA[typeKey];

    const months = Number(monthsSelect.value);
    const sum = Number(sumInput.value);

    if (!isFinite(sum) || sum <= 0) {
      resultValue.textContent = "Введіть суму страхування";
      resultBlock.classList.remove("hidden");
      return;
    }

    const riskKey = subTypeSelect.value;
    const riskCoef = data.risks[riskKey] ? Number(data.risks[riskKey].coef) : 1.0;

    const baseRateAnnual = Number(data.baseRateAnnual);
    const basePart = sum * baseRateAnnual * (months / 12) * riskCoef;

    // Options fixed sum
    let optSum = 0;
    const checks = optionsList.querySelectorAll("input[type='checkbox']");
    checks.forEach((ch) => {
      if (ch.checked && data.options[ch.value]) {
        optSum += Number(data.options[ch.value].price);
      }
    });

    const premium = basePart + optSum;

    resultValue.textContent = formatUAH(premium);
    resultBlock.classList.remove("hidden");
  }

  // Build initial UI
  rebuildSubTypeAndOptions();

  // Listeners
  typeSelect.addEventListener("change", () => {
    rebuildSubTypeAndOptions();
    // Hide result until recalc to avoid confusion
    resultBlock.classList.add("hidden");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calcPremium();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initCalculator();
});
