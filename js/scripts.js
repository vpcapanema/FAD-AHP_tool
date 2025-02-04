// Variáveis globais
let criteriaCount = 0;
let criteria = [];
let pairwiseValues = {};

// 1: Processa a quantidade de critérios selecionada
function processCriteriaCount() {
  const countSelect = document.getElementById("criteria-count");
  criteriaCount = parseInt(countSelect.value);
  // Avança para a 2ª etapa
  document.getElementById("step1-section").classList.add("hidden");
  showNamesSection();
  document.getElementById("names-section").classList.remove("hidden");
}

// 2: Gera os campos para nomes dos critérios
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

// 2: Processa e valida os nomes dos critérios
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
  // Avança para a 3ª etapa
  document.getElementById("names-section").classList.add("hidden");
  generatePairwiseForm();
  document.getElementById("pairwise-section").classList.remove("hidden");
}

// Volta da etapa 3 para a etapa 2
function backToNames() {
  document.getElementById("pairwise-section").classList.add("hidden");
  document.getElementById("names-section").classList.remove("hidden");
}

// 3: Gera a matriz de comparação pareada
function generatePairwiseForm() {
  const container = document.getElementById("pairwise-form");
  let html = "<table>";
  // Cabeçalho: linha com células vazia + nomes dos critérios
  html += "<tr><th></th>";
  for (let j = 0; j < criteria.length; j++) {
    html += `<th>${criteria[j]}</th>`;
  }
  html += "</tr>";
  // Linhas da matriz
  for (let i = 0; i < criteria.length; i++) {
    html += `<tr>`;
    // Primeira coluna com o nome do critério
    html += `<th>${criteria[i]}</th>`;
    for (let j = 0; j < criteria.length; j++) {
      if (i === j) {
        // Diagonal: 1 em negrito
        html += `<td><strong>1</strong></td>`;
      } else if (i < j) {
        // Células acima da diagonal: select para escolher valor
        html += `<td>${createSelectInput(i, j)}</td>`;
      } else {
        // Células abaixo da diagonal: exibem o recíproco da célula simétrica
        const key = "pair_" + j + "_" + i;
        const currentVal = pairwiseValues[key] || 1;
        const reciprocal = (1 / currentVal).toFixed(4);
        html += `<td id="recip_${j}_${i}">${reciprocal}</td>`;
      }
    }
    html += `</tr>`;
  }
  html += "</table>";
  container.innerHTML = html;
}

// Cria o select para a célula de comparação (para i < j)
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
  // Valor inicial
  pairwiseValues[selectId] = 1;
  return selectHtml;
}

// Atualiza o valor selecionado e a célula recíproca correspondente
function storePairwiseValue(i, j) {
  const selectId = "pair_" + i + "_" + j;
  const val = parseFloat(document.getElementById(selectId).value);
  pairwiseValues[selectId] = val;
  updateReciprocal(i, j);
}

// Atualiza a célula da parte inferior (recíproco) para o par (i, j)
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

// 3/4: Calcula os pesos e as métricas do AHP
function calculateAHP() {
  const nCriteria = criteria.length;
  let matrix = [];
  // Constrói a matriz de comparação completa
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

  // Cálculo dos pesos usando o método da média geométrica
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

  // Cálculo de λ máximo
  let lambdaVector = [];
  for (let i = 0; i < nCriteria; i++) {
    let sumRow = 0;
    for (let j = 0; j < nCriteria; j++) {
      sumRow += matrix[i][j] * weights[j];
    }
    lambdaVector[i] = sumRow / weights[i];
  }
  let lambdaMax = lambdaVector.reduce((a, b) => a + b, 0) / nCriteria;

  // Índice de Consistência (CI)
  let CI = (lambdaMax - nCriteria) / (nCriteria - 1);

  // Razão de Consistência (CR)
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

// Volta da etapa 4 para a etapa 3
function backToPairwise() {
  document.getElementById("result-section").classList.add("hidden");
  document.getElementById("pairwise-section").classList.remove("hidden");
}

// 4: Exibe os resultados
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
  if (CR > 0.1) {
    html += `<p style="color: red;">A consistência das comparações não é aceitável (CR > 0.1). Revise os julgamentos.</p>`;
  } else {
    html += `<p style="color: green;">A consistência das comparações é aceitável (CR ≤ 0.1).</p>`;
  }
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
}
