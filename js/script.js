// ---------------------------------------------
// Variáveis globais (declaração única)
// ---------------------------------------------
let criteriaCount = 0;
let criteria = [];
let pairwiseValues = {};
let exportData = {};
let chosenMethod = "direct"; // "direct" ou "form"

// -----------------------------------------------------------
// 1: Processa a quantidade de critérios selecionada
// -----------------------------------------------------------
function processCriteriaCount() {
  const countSelect = document.getElementById("criteria-count");
  criteriaCount = parseInt(countSelect.value);
  document.getElementById("step1-section").classList.add("hidden");
  showNamesSection();
  document.getElementById("names-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// 2: Gera os campos para nomes dos critérios
// -----------------------------------------------------------
function showNamesSection() {
  const container = document.getElementById("names-container");
  container.innerHTML = "";
  for (let i = 0; i < criteriaCount; i++) {
    container.innerHTML += `
      <div class="name-field">
        <label>${i + 1}.</label>
        <input type="text" id="criteria_${i}" placeholder="Nome do critério ${i + 1}">
      </div>
    `;
  }
}

// Volta da etapa 2 para a etapa 1
function backToStep1() {
  document.getElementById("names-section").classList.add("hidden");
  document.getElementById("step1-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// 2: Processa e valida os nomes dos critérios
// -----------------------------------------------------------
function processCriteriaNames() {
  criteria = [];
  for (let i = 0; i < criteriaCount; i++) {
    let input = document.getElementById("criteria_" + i);
    let name = input.value.trim();
    if (name === "") {
      alert(`Preencha o nome do critério ${i + 1}!`);
      input.focus();
      return;
    }
    if (name.length < 3) {
      alert(`O nome do critério ${i + 1} deve ter mais de três caracteres`);
      input.focus();
      return;
    }
    criteria.push(name);
  }
  alert("Critérios preenchidos com sucesso!");
  document.getElementById("names-section").classList.add("hidden");
  document.getElementById("comparison-method-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// Volta da seleção do método para a etapa 2
// -----------------------------------------------------------
function backToNames() {
  document.getElementById("comparison-method-section").classList.add("hidden");
  document.getElementById("names-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// Lê o método selecionado e direciona para a interface de comparação
// -----------------------------------------------------------
function selectComparisonMethod() {
  const radios = document.getElementsByName("comparisonMethod");
  for (let radio of radios) {
    if (radio.checked) {
      chosenMethod = radio.value; // "direct" ou "form"
      break;
    }
  }
  document.getElementById("comparison-method-section").classList.add("hidden");
  document.getElementById("pairwise-section").classList.remove("hidden");
  
  const h2 = document.querySelector("#pairwise-section h2");
  if (chosenMethod === "direct") {
    h2.textContent = "4. Matriz direta de comparação pareada dos critérios";
    generateDirectMatrix();
  } else {
    h2.textContent = "4. Formulário de comparação pareada dos critérios";
    generatePairwiseFormMethod();
  }
}

// -----------------------------------------------------------
// Volta da seção de comparação para a seleção do método
// -----------------------------------------------------------
function backToComparisonMethod() {
  document.getElementById("pairwise-section").classList.add("hidden");
  document.getElementById("comparison-method-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// Método 1: Gera a interface de comparação com matriz completa (Matriz Direta)
// -----------------------------------------------------------
function generateDirectMatrix() {
  const container = document.getElementById("pairwise-form");
  let html = "<table>";
  html += "<tr><th></th>";
  for (let j = 0; j < criteria.length; j++) {
    html += `<th>${criteria[j]}</th>`;
  }
  html += "</tr>";
  for (let i = 0; i < criteria.length; i++) {
    html += `<tr>`;
    html += `<th>${criteria[i]}</th>`;
    for (let j = 0; j < criteria.length; j++) {
      if (i === j) {
        html += `<td><strong>1</strong></td>`;
      } else if (i < j) {
        html += `<td>${createSelectInput(i, j)}</td>`;
      } else {
        const key = "pair_" + j + "_" + i;
        const currentVal = pairwiseValues[key] || 1;
        const reciprocal = (1 / currentVal).toFixed(4);
        html += `<td id="recip_${j}_${i}">${reciprocal}</td>`;
      }
    }
    html += "</tr>";
  }
  html += "</table>";
  container.innerHTML = html;
}

// -----------------------------------------------------------
// Método 2: Gera a interface de comparação pelo formulário (tabela com três colunas)
// -----------------------------------------------------------
function generatePairwiseFormMethod() {
  const container = document.getElementById("pairwise-form");
  container.innerHTML = "";
  let html = "<table><tr><th>Critério 1</th><th>Critério 2</th><th>Importância (Escala AHP)</th></tr>";
  for (let i = 0; i < criteria.length - 1; i++) {
    for (let j = i + 1; j < criteria.length; j++) {
      html += "<tr>";
      html += `<td>${criteria[i]}</td>`;
      html += `<td>${criteria[j]}</td>`;
      html += `<td>${createSelectInput(i, j)}</td>`;
      html += "</tr>";
    }
  }
  html += "</table>";
  container.innerHTML = html;
}

// -----------------------------------------------------------
// Cria o select para a célula de comparação (para i < j)
// -----------------------------------------------------------
function createSelectInput(i, j) {
  const options = [
    {value: 1/9, label: "1/9"},
    {value: 1/8, label: "1/8"},
    {value: 1/7, label: "1/7"},
    {value: 1/6, label: "1/6"},
    {value: 1/5, label: "1/5"},
    {value: 1/4, label: "1/4"},
    {value: 1/3, label: "1/3"},
    {value: 1/2, label: "1/2"},
    {value: 1,   label: "1"},
    {value: 2,   label: "2"},
    {value: 3,   label: "3"},
    {value: 4,   label: "4"},
    {value: 5,   label: "5"},
    {value: 6,   label: "6"},
    {value: 7,   label: "7"},
    {value: 8,   label: "8"},
    {value: 9,   label: "9"}
  ];
  const selectId = "pair_" + i + "_" + j;
  let selectHtml = `<select id="${selectId}" onchange="storePairwiseValue(${i}, ${j})">`;
  for (let opt of options) {
    let selected = (Number(opt.value) === 1) ? "selected" : "";
    selectHtml += `<option value="${opt.value}" ${selected}>${opt.label}</option>`;
  }
  selectHtml += "</select>";
  pairwiseValues[selectId] = 1;
  return selectHtml;
}

// -----------------------------------------------------------
// Atualiza o valor selecionado e a célula recíproca correspondente
// -----------------------------------------------------------
function storePairwiseValue(i, j) {
  const selectId = "pair_" + i + "_" + j;
  const val = parseFloat(document.getElementById(selectId).value);
  pairwiseValues[selectId] = val;
  updateReciprocal(i, j);
}

// -----------------------------------------------------------
// Atualiza a célula da parte inferior (recíproco) para o par (i, j)
// -----------------------------------------------------------
function updateReciprocal(i, j) {
  const reciprocalCellId = "recip_" + j + "_" + i;
  const selectId = "pair_" + i + "_" + j;
  const val = parseFloat(document.getElementById(selectId).value);
  const reciprocal = (1 / val).toFixed(4);
  const cell = document.getElementById(reciprocalCellId);
  if (cell) {
    cell.innerHTML = reciprocal;
  }
}

// -----------------------------------------------------------
// 3/4: Calcula os pesos e as métricas do AHP e exibe os resultados
// -----------------------------------------------------------
function calculateAHP() {
  const nCriteria = criteria.length;
  let matrix = [];
  for (let i = 0; i < nCriteria; i++) {
    matrix[i] = [];
    for (let j = 0; j < nCriteria; j++) {
      if (i === j) {
        matrix[i][j] = 1;
      } else if (i < j) {
        const key = "pair_" + i + "_" + j;
        const val = pairwiseValues[key] || parseFloat(document.getElementById(key).value);
        matrix[i][j] = val;
      } else {
        const key = "pair_" + j + "_" + i;
        const reciprocal = 1 / (pairwiseValues[key] || parseFloat(document.getElementById(key).value));
        matrix[i][j] = reciprocal;
      }
    }
  }
  let geoMeans = [];
  let sumGeo = 0;
  for (let i = 0; i < nCriteria; i++) {
    let prod = 1;
    for (let j = 0; j < nCriteria; j++) {
      prod *= matrix[i][j];
    }
    geoMeans[i] = Math.pow(prod, 1 / nCriteria);
    sumGeo += geoMeans[i];
  }
  let weights = geoMeans.map(gm => gm / sumGeo);
  let lambdaVector = [];
  for (let i = 0; i < nCriteria; i++) {
    let sumRow = 0;
    for (let j = 0; j < nCriteria; j++) {
      sumRow += matrix[i][j] * weights[j];
    }
    lambdaVector[i] = sumRow / weights[i];
  }
  let lambdaMax = lambdaVector.reduce((a, b) => a + b, 0) / nCriteria;
  let CI = (lambdaMax - nCriteria) / (nCriteria - 1);
  const RI_values = {
    1: 0.00,
    2: 0.00,
    3: 0.58,
    4: 0.90,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49
  };
  let RI = RI_values[nCriteria] || 1.5;
  let CR = RI === 0 ? 0 : CI / RI;
  displayResults(weights, lambdaMax, CI, CR, matrix);
}

// -----------------------------------------------------------
// Volta da etapa 5 para a seção de comparação (etapa 4)
// -----------------------------------------------------------
function backToPairwise() {
  document.getElementById("result-section").classList.add("hidden");
  document.getElementById("pairwise-section").classList.remove("hidden");
}

// -----------------------------------------------------------
// 4/5: Exibe os resultados e armazena os dados para exportação
// -----------------------------------------------------------
function displayResults(weights, lambdaMax, CI, CR, matrix) {
  const resultsDiv = document.getElementById("results");
  let html = "<h3>Pesos dos Critérios:</h3><ul>";
  for (let i = 0; i < criteria.length; i++) {
    html += `<li>${criteria[i]}: ${(weights[i] * 100).toFixed(2)}%</li>`;
  }
  html += "</ul>";
  html += "<h3>Métricas de Consistência:</h3>";
  html += `<p>λ máximo (lambda max): ${lambdaMax.toFixed(4)}</p>`;
  html += `<p>Índice de Consistência (CI): ${CI.toFixed(4)}</p>`;
  html += `<p>Razão de Consistência (CR): ${CR.toFixed(4)}</p>`;
  html += "<h3>Matriz de Comparação:</h3>";
  html += "<table><tr><th></th>";
  for (let i = 0; i < criteria.length; i++) {
    html += `<th>${criteria[i]}</th>`;
  }
  html += "</tr>";
  for (let i = 0; i < criteria.length; i++) {
    html += `<tr><th>${criteria[i]}</th>`;
    for (let j = 0; j < criteria.length; j++) {
      html += `<td>${matrix[i][j].toFixed(4)}</td>`;
    }
    html += "</tr>";
  }
  html += "</table>";
  resultsDiv.innerHTML = html;
  document.getElementById("pairwise-section").classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");
  exportData = {
    criteria: criteria,
    weights: weights,
    lambdaMax: lambdaMax,
    CI: CI,
    CR: CR,
    matrix: matrix
  };
}

// -----------------------------------------------------------
// Exporta os dados em PDF, CSV ou XLSX
// -----------------------------------------------------------
function exportDataReport() {
  const format = document.getElementById("export-format").value;
  if (format === "PDF") {
    exportPDF();
  } else if (format === "CSV") {
    exportCSV();
  } else if (format === "XLSX") {
    exportXLSX();
  } else {
    alert("Formato de exportação desconhecido.");
  }
}

// -----------------------------------------------------------
// Exporta o relatório inteiro para PDF
// -----------------------------------------------------------
function exportPDF() {
  const results = document.getElementById('results');
  const opt = {
    margin: 1,
    filename: 'resultados_ahp.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(results).save();
}

// -----------------------------------------------------------
// Exporta a matriz e métricas para CSV
// -----------------------------------------------------------
function exportCSV() {
  if (!exportData || !exportData.matrix) {
    alert("Dados de exportação não encontrados.");
    return;
  }
  let csvContent = "";
  csvContent += "," + exportData.criteria.join(",") + "\n";
  for (let i = 0; i < exportData.criteria.length; i++) {
    let row = exportData.criteria[i];
    for (let j = 0; j < exportData.criteria.length; j++) {
      row += "," + exportData.matrix[i][j].toFixed(4);
    }
    csvContent += row + "\n";
  }
  csvContent += "\nMétricas de Consistência\n";
  csvContent += "λ máximo," + exportData.lambdaMax.toFixed(4) + "\n";
  csvContent += "CI," + exportData.CI.toFixed(4) + "\n";
  csvContent += "CR," + exportData.CR.toFixed(4) + "\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "matriz_ahp.csv";
  link.click();
}

// -----------------------------------------------------------
// Exporta a matriz e métricas para XLSX
// -----------------------------------------------------------
function exportXLSX() {
  if (!exportData || !exportData.matrix) {
    alert("Dados de exportação não encontrados.");
    return;
  }
  let ws_data = [];
  let header = [""].concat(exportData.criteria);
  ws_data.push(header);
  for (let i = 0; i < exportData.criteria.length; i++) {
    let row = [exportData.criteria[i]];
    for (let j = 0; j < exportData.criteria.length; j++) {
      row.push(exportData.matrix[i][j].toFixed(4));
    }
    ws_data.push(row);
  }
  ws_data.push([]);
  ws_data.push(["Métricas de Consistência"]);
  ws_data.push(["λ máximo", exportData.lambdaMax.toFixed(4)]);
  ws_data.push(["CI", exportData.CI.toFixed(4)]);
  ws_data.push(["CR", exportData.CR.toFixed(4)]);
  let ws = XLSX.utils.aoa_to_sheet(ws_data);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório AHP");
  XLSX.writeFile(wb, "matriz_ahp.xlsx");
}
