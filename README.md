# SIGMA AHP Calculator

## 📊 Análise Hierárquica de Processo (AHP)

Sistema web completo para análise de decisão multicritério usando o método AHP (Analytic Hierarchy Process) de Thomas Saaty.

## 🎯 Características Principais

### ✨ Funcionalidades

- **Processo Guiado em 5 Etapas**
  1. Definição de critérios (1-20)
  2. Nomeação dos critérios
  3. Seleção do método de comparação (Matriz ou Formulário)
  4. Comparações pareadas com Escala de Saaty
  5. Visualização de resultados com métricas completas

- **🆕 Upload de Matriz**
  - Faça upload de matrizes pré-preenchidas (CSV ou JSON)
  - Validação automática de consistência
  - Pule direto para os resultados
  - Arquivos de exemplo incluídos

- **Métodos de Comparação**
  - **Matriz Direta**: Interface de tabela completa com células editáveis
  - **Formulário**: Comparações par a par em lista
  - Cálculo automático de valores recíprocos

- **Métricas AHP Completas**
  - λ_max (Lambda Máximo)
  - CI (Índice de Consistência)
  - CR (Razão de Consistência) com status visual
  - Pesos normalizados com barras de visualização

- **Exportação de Resultados**
  - CSV ✅ (funcional)
  - JSON ✅ (funcional)
  - PDF ⚠️ (requer biblioteca)
  - Excel ⚠️ (requer biblioteca)

### 🎨 Design System PLI

- Interface profissional com padrão visual PLI
- Cores oficiais: Azul escuro (#0f203e), Verde principal (#5cb65c)
- Tipografia Montserrat
- Componentes reutilizáveis
- Responsivo e acessível (ARIA labels)
- Sistema de notificações interativo

## 🚀 Como Usar

### Método 1: Processo Manual (Tradicional)

1. Abra `sigma-ahp.html` ou `step1-criterios.html`
2. Selecione **Método Manual**
3. Escolha a quantidade de critérios (recomendado: 3-9)
4. Nomeie cada critério
5. Escolha o método de comparação (matriz ou formulário)
6. Realize as comparações usando a Escala de Saaty (1-9)
7. Visualize resultados, pesos e métricas de consistência
8. Exporte os resultados em CSV ou JSON

### Método 2: Upload de Matriz (Novo! 🎉)

1. Abra `step1-criterios.html`
2. Selecione **Upload de Matriz**
3. Baixe o modelo (CSV ou JSON)
4. Preencha a matriz no formato escolhido
5. Faça upload do arquivo
6. Sistema valida automaticamente e exibe resultados
7. Exporte em diferentes formatos

**Veja a documentação completa**: [UPLOAD_MATRIX_GUIDE.md](UPLOAD_MATRIX_GUIDE.md)

### Exemplos de Arquivos

- `exemplo_matriz_ahp.csv` - Modelo CSV com 4 critérios
- `exemplo_matriz_ahp.json` - Modelo JSON com instruções

## 📁 Estrutura do Projeto

```
AHP_tool/
├── sigma-ahp.html              # Página inicial com introdução ao AHP
├── step1-criterios.html        # Etapa 1: Seleção de critérios ou upload
├── step2-nomes.html            # Etapa 2: Nomeação dos critérios
├── step3-metodo.html           # Etapa 3: Escolha do método de comparação
├── step4-comparacao.html       # Etapa 4: Interface de comparações
├── step5-resultados.html       # Etapa 5: Resultados e exportação
├── sigma-ahp.css               # Estilos PLI Design System
├── js/
│   └── script.js               # Lógica AHP e manipulação de dados
├── img_folder/                 # Imagens e recursos visuais
├── exemplo_matriz_ahp.csv      # Exemplo de matriz CSV
├── exemplo_matriz_ahp.json     # Exemplo de matriz JSON
├── README.md                   # Este arquivo
└── UPLOAD_MATRIX_GUIDE.md      # Guia detalhado de upload
```

## 🔧 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design System PLI com CSS Variables
- **JavaScript Vanilla**: Sem dependências externas
- **localStorage**: Persistência de dados no navegador
- **Font Awesome 6.4.2**: Ícones
- **Montserrat Font**: Tipografia oficial

## 📐 Escala de Saaty

| Valor | Definição | Explicação |
|-------|-----------|------------|
| 1 | Igual importância | Dois critérios contribuem igualmente |
| 3 | Importância moderada | Experiência e julgamento favorecem um critério |
| 5 | Importância forte | Um critério é fortemente favorecido |
| 7 | Importância muito forte | Um critério é muito fortemente dominante |
| 9 | Importância extrema | A evidência favorece um critério no mais alto grau |
| 2, 4, 6, 8 | Valores intermediários | Quando é necessário compromisso entre valores |

**Valores recíprocos**: Se A comparado a B = 5, então B comparado a A = 1/5 (0.2)

## 📊 Interpretação de Resultados

### Lambda Máximo (λ_max)
- Maior autovalor da matriz de comparação
- Quanto mais próximo de n (número de critérios), melhor
- Indica a consistência geral das comparações

### Índice de Consistência (CI)
- Formula: CI = (λ_max - n) / (n - 1)
- Valor ideal: 0 (perfeitamente consistente)
- Mede o desvio da consistência perfeita

### Razão de Consistência (CR)
- Formula: CR = CI / RI (Índice Aleatório)
- **CR < 0.10 (10%)**: ✅ Comparações aceitáveis e consistentes
- **CR ≥ 0.10**: ❌ Recomenda-se revisar as comparações
- Métrica final para validação da análise

## 🌐 Como Executar

### Opção 1: Servidor HTTP Local (Python)

```bash
# Python 3
cd AHP_tool
python -m http.server 8000

# Acesse: http://localhost:8000/sigma-ahp.html
```

### Opção 2: Servidor HTTP Local (Node.js)

```bash
# Instalar http-server globalmente
npm install -g http-server

cd AHP_tool
http-server -p 8000

# Acesse: http://localhost:8000/sigma-ahp.html
```

### Opção 3: Live Server (VS Code)

1. Instale a extensão "Live Server"
2. Clique com botão direito em `sigma-ahp.html`
3. Selecione "Open with Live Server"

## 🔍 Validações de Upload

### Arquivo CSV
- Primeira linha: nomes dos critérios
- Primeira coluna: nomes dos critérios (mesmos da primeira linha)
- Diagonal principal = 1
- Valores numéricos válidos
- Matriz quadrada (n×n)
- Reciprocidade verificada (tolerância: 0.01)

### Arquivo JSON
```json
{
  "criteria": ["Critério 1", "Critério 2", "Critério 3"],
  "matrix": [
    [1, valor, valor],
    [1/valor, 1, valor],
    [1/valor, 1/valor, 1]
  ]
}
```

## 💡 Casos de Uso

- **Seleção de Fornecedores**: Comparar custos, qualidade, prazos
- **Escolha de Tecnologias**: Avaliar frameworks, ferramentas, plataformas
- **Priorização de Projetos**: Ranquear iniciativas por impacto/esforço
- **Avaliação de Riscos**: Classificar riscos por probabilidade/impacto
- **Decisões de Investimento**: Analisar retorno, risco, liquidez
- **Planejamento Estratégico**: Definir prioridades organizacionais

## 📚 Referências

- SAATY, T. L. (1990). How to make a decision: The analytic hierarchy process. *European Journal of Operational Research*, 48(1), 9-26.
- SAATY, T. L. (1991). Response to Holder's Comments on the Analytic Hierarchy Process. *Behaviormetrika*, 18(29), 1-10.

## 🤝 Contribuindo

Este é um projeto do **SIGMA - Sistema Integrado de Gestão, Monitoramento e Apoio técnico ao PLI/SP-2050**.

## 📄 Licença

© 2025 SIGMA PLI/SP-2050. Todos os direitos reservados.

## 🆘 Suporte

Para questões e suporte:
- Consulte a documentação: `UPLOAD_MATRIX_GUIDE.md`
- Verifique os exemplos: `exemplo_matriz_ahp.csv` e `exemplo_matriz_ahp.json`
- Teste com a aplicação de exemplo

## 🎯 Roadmap

### Implementado ✅
- [x] Interface multi-etapas
- [x] Dois métodos de comparação
- [x] Cálculos AHP completos (λ_max, CI, CR)
- [x] Exportação CSV e JSON
- [x] Sistema de notificações
- [x] **Upload de matriz (CSV/JSON)**
- [x] **Validação automática**
- [x] Design System PLI
- [x] Acessibilidade (ARIA)

### Planejado ⚠️
- [ ] Exportação PDF (requer jsPDF)
- [ ] Exportação Excel (requer SheetJS)
- [ ] Gráficos de visualização (Chart.js)
- [ ] Histórico de análises
- [ ] Comparação de cenários
- [ ] Tutorial interativo
- [ ] Modo escuro
- [ ] Internacionalização (i18n)

## 📈 Versão

**Versão 2.0** - Nova funcionalidade de Upload de Matriz implementada!

### Changelog

#### v2.0 (2025-10-29)
- ✨ Adicionada funcionalidade de upload de matriz
- ✨ Suporte para formatos CSV e JSON
- ✨ Validação automática de matrizes
- ✨ Sistema de notificações toast
- ✨ Documentação completa de upload
- ✨ Arquivos de exemplo incluídos
- 🎨 Melhorias na interface do Step 1
- 🐛 Correções de compatibilidade entre métodos

#### v1.0
- Lançamento inicial com processo manual completo
- 5 etapas guiadas
- Métricas AHP completas
- Exportação CSV/JSON
- Design System PLI
