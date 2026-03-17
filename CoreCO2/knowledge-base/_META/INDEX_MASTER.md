---
file: INDEX_MASTER.md
version: "1.0"
domain: "Emissões de CO₂ em Materiais Cimentícios e Estruturas de Concreto"
source: "Boletim Técnico IBRACON/ABECE/ABCIC — CT 101, 1ª Edição, 2024"
last_updated: "2025-03-05"
total_chunks: 24
total_recipes: 2
---

# Knowledge Base — CoreCO2 (CT 101)

> **Ponto de entrada obrigatório.** O agente deve sempre começar aqui antes de navegar qualquer outro arquivo.

---

## PROTOCOLO DE USO PARA O AGENTE

```
PASSO 1: Identificar intenção → Seção "Índice por Intenção" abaixo
PASSO 2: Seguir o caminho indicado (L3 Overview ou L4 Recipe diretamente)
PASSO 3: Ler chunks L1 dependentes conforme necessário
PASSO 4: Se ainda ambíguo → consultar L2_index/dependency_graph.json
```

---

## ÍNDICE POR INTENÇÃO

### Quero entender um conceito

| Conceito / Tópico | Iniciar em | Complexidade |
|---|---|---|
| Método CT 101 completo (visão geral) | L3_compiled/co2_emissions/CO2_EMISSIONS_OVERVIEW.md | Básico |
| Módulos do ciclo de vida (A1-D) | L1_chunks/.../fundamentals/CT101_LCA_LIFECYCLE_MODULES.md | Básico |
| Unidade funcional vs declarada | L1_chunks/.../fundamentals/CT101_LCA_FUNCTIONAL_UNIT.md | Básico |
| Equação fundamental C=Σ(q×e) | L1_chunks/.../fundamentals/CT101_LCA_FUNDAMENTAL_EQUATION.md | Básico |
| Fatores de emissão (combustíveis) | L1_chunks/.../emission_factors/CT101_FUEL_EMISSION_FACTORS.md | Básico |
| Fatores de emissão (carbonatos) | L1_chunks/.../emission_factors/CT101_CARBONATE_EMISSION_FACTORS.md | Básico |
| Cálculo de transporte | L1_chunks/.../emission_factors/CT101_TRANSPORT_FORMULA.md | Intermediário |
| Estágio de produto A1-A3 | L1_chunks/.../lifecycle_stages/CT101_PRODUCT_STAGE_A1A3.md | Intermediário |
| Desdobramento A1/A2/A3 | L1_chunks/.../lifecycle_stages/CT101_A1A2A3_SPLIT.md | Avançado |
| Processo construtivo A5 | L1_chunks/.../lifecycle_stages/CT101_CONSTRUCTION_A5.md | Intermediário |
| Substituições B4 | L1_chunks/.../lifecycle_stages/CT101_REPLACEMENT_B4.md | Avançado |
| Fim de vida C1-C4 | L1_chunks/.../lifecycle_stages/CT101_END_OF_LIFE_C1C4.md | Avançado |
| Propagação de incertezas | L1_chunks/.../uncertainty/CT101_UNCERTAINTY_TAYLOR.md | Avançado |

### Quero implementar algo em código

| O que implementar | Recipe direta | Linguagem |
|---|---|---|
| Cálculo A1-A3 (estágio de produto) | L4_recipes/co2_emissions/CT101_CO2_PRODUCT_STAGE_RECIPE.md | C# |
| Cálculo A4-C4 (ciclo completo) | L4_recipes/co2_emissions/CT101_CO2_FULL_LIFECYCLE_RECIPE.md | C# |

### Quero verificar/validar algo

| O que verificar | Consultar |
|---|---|
| Fator de emissão de um combustível | L1: CT101_FUEL_EMISSION_FACTORS → Tabela 2 |
| Fator de emissão de um carbonato | L1: CT101_CARBONATE_EMISSION_FACTORS → Tabela 3 |
| Fator de transporte por tipo de veículo | L1: CT101_TRANSPORT_EMISSION_FACTORS |
| Fator de emissão da eletricidade | L1: CT101_TRANSPORT_EMISSION_FACTORS (seção eletricidade) |
| Se posso omitir item do inventário | L1: CT101_CUTOFF_CRITERIA |
| Unidades de uma equação | L1 chunk da equação → tabela de símbolos |
| Valores de referência (benchmarks) | L3: CO2_EMISSIONS_OVERVIEW → "Valores de Referência" |
| Constantes da Eq. 9 (biomassa) | L1: CT101_BIOMASS_EMISSION → 0.5 (fração C), 44/12 (razão CO₂/C) |

### Quero encontrar uma equação por número

| Equação | Chunk |
|---|---|
| Eq. 1 (nº reposições) | CT101_REPLACEMENT_COUNT |
| Eq. 2 (unitarização) | CT101_INVENTORY_UNITIZATION |
| Eq. 3-4 (alocação) | CT101_ALLOCATION |
| Eq. 5 (fundamental) | CT101_LCA_FUNDAMENTAL_EQUATION |
| Eq. 7 (combustão) | CT101_COMBUSTION_EMISSION |
| Eq. 8 (calcinação) | CT101_CALCINATION_EMISSION |
| Eq. 9 (biomassa) | CT101_BIOMASS_EMISSION |
| Eq. 10 (transporte) | CT101_TRANSPORT_FORMULA |
| Eq. 11 (carbonatação) | CT101_CARBONATION_REMOVAL |
| Eq. 12-20 (A1-A3) | CT101_PRODUCT_STAGE_A1A3 |
| Eq. 21 (A4) | CT101_TRANSPORT_A4 |
| Eq. 22-29 (A5) | CT101_CONSTRUCTION_A5 |
| Eq. 30-34 (B4) | CT101_REPLACEMENT_B4 |
| Eq. 35-40 (C1-C4) | CT101_END_OF_LIFE_C1C4 |
| Eq. 41-42 (incerteza) | CT101_UNCERTAINTY_RANGE |
| Eq. 43 (consumo material) | CT101_MATERIAL_CONSUMPTION |
| Eq. 44-55 (split A1/A2/A3) | CT101_A1A2A3_SPLIT |
| Eq. 57-58 (Taylor) | CT101_UNCERTAINTY_TAYLOR |

---

## MAPA DE DOMÍNIOS

```
knowledge-base/
├── L1_chunks/co2_emissions/
│   ├── fundamentals/       → 9 chunks: equação fundamental, UF/UD, módulos, alocação, corte, etc.
│   ├── emission_factors/   → 7 chunks: Tabelas 2-3, transporte, combustão, calcinação, biomassa
│   ├── lifecycle_stages/   → 6 chunks: A1-A3, A4, A5, B4, C1-C4, split A1/A2/A3
│   └── uncertainty/        → 2 chunks: faixa min-max, propagação Taylor
├── L2_index/
│   ├── dependency_graph.json    → Grafo com 24 nós e 29 arestas
│   ├── tag_index.json           → Índices por domínio, tipo, equação, tabela, status
│   ├── intent_index.md          → Navegação por intenção do agente
│   └── source_map.json          → Mapeamento CT 101 → chunks
├── L3_compiled/co2_emissions/
│   └── CO2_EMISSIONS_OVERVIEW.md → Visão consolidada com mapa, ordem de estudo, benchmarks
├── L4_recipes/co2_emissions/
│   ├── CT101_CO2_PRODUCT_STAGE_RECIPE.md    → Recipe: cálculo A1-A3 (C#)
│   └── CT101_CO2_FULL_LIFECYCLE_RECIPE.md   → Recipe: ciclo completo A4-C4 (C#)
└── _META/
    ├── INDEX_MASTER.md          → Este arquivo
    ├── CONVENTIONS.md           → Convenções de IDs, unidades, status
    └── CHANGELOG.md             → Histórico de mudanças
```

---

## INVENTÁRIO COMPLETO

### Chunks L1 (Conceitos) — 24 chunks

| ID | Título | Domínio | Equação | Status |
|---|---|---|---|---|
| CT101_LCA_FUNDAMENTAL_EQUATION | Equação Fundamental | fundamentals | Eq. 5 | verified |
| CT101_LCA_LIFECYCLE_MODULES | Módulos do Ciclo de Vida | fundamentals | — | verified |
| CT101_LCA_FUNCTIONAL_UNIT | Unidade Funcional/Declarada | fundamentals | — | verified |
| CT101_REPLACEMENT_COUNT | Nº de Reposições | fundamentals | Eq. 1 | verified |
| CT101_INVENTORY_UNITIZATION | Fluxos Unitários | fundamentals | Eq. 2 | verified |
| CT101_ALLOCATION | Alocação | fundamentals | Eq. 3-4 | verified |
| CT101_CUTOFF_CRITERIA | Critérios de Corte | fundamentals | — | verified |
| CT101_CARBONATION_REMOVAL | Carbonatação | fundamentals | Eq. 11 | verified |
| CT101_MATERIAL_CONSUMPTION | Consumo de Material | fundamentals | Eq. 43 | verified |
| CT101_FUEL_EMISSION_FACTORS | Combustíveis Fósseis | emission_factors | Tab. 2 | verified |
| CT101_CARBONATE_EMISSION_FACTORS | Carbonatos | emission_factors | Tab. 3 | verified |
| CT101_TRANSPORT_EMISSION_FACTORS | Transporte | emission_factors | Sidac | verified |
| CT101_COMBUSTION_EMISSION | Combustão | emission_factors | Eq. 7 | verified |
| CT101_CALCINATION_EMISSION | Calcinação | emission_factors | Eq. 8 | verified |
| CT101_BIOMASS_EMISSION | Biomassa | emission_factors | Eq. 9 | verified |
| CT101_TRANSPORT_FORMULA | Transporte | emission_factors | Eq. 10 | verified |
| CT101_PRODUCT_STAGE_A1A3 | Estágio de Produto | lifecycle_stages | Eq. 12-20 | verified |
| CT101_TRANSPORT_A4 | Transporte A4 | lifecycle_stages | Eq. 21 | verified |
| CT101_CONSTRUCTION_A5 | Construção A5 | lifecycle_stages | Eq. 22-29 | verified |
| CT101_REPLACEMENT_B4 | Substituição B4 | lifecycle_stages | Eq. 30-34 | verified |
| CT101_END_OF_LIFE_C1C4 | Fim de Vida C1-C4 | lifecycle_stages | Eq. 35-40 | verified |
| CT101_A1A2A3_SPLIT | Split A1/A2/A3 | lifecycle_stages | Eq. 44-55 | verified |
| CT101_UNCERTAINTY_RANGE | Faixa Min-Max | uncertainty | Eq. 41-42 | verified |
| CT101_UNCERTAINTY_TAYLOR | Taylor | uncertainty | Eq. 57-58 | verified |

### Recipes L4 — 2 recipes

| ID | Título | Implementa | Linguagem | Status |
|---|---|---|---|---|
| CT101_CO2_PRODUCT_STAGE_RECIPE | Cálculo A1-A3 | Eq. 5-20, 41-43, 44-55, 57-58 | C# | verified |
| CT101_CO2_FULL_LIFECYCLE_RECIPE | Ciclo Completo | Eq. 1, 21-40 | C# | verified |

---

## CONVENÇÕES RÁPIDAS

- **IDs:** `UPPER_SNAKE_CASE` — prefixo `CT101_` — nunca mudam após criação
- **Unidades:** sempre declaradas na tabela de símbolos de cada chunk
- **Fatores de emissão:** Tabela 2 (combustíveis), Tabela 3 (carbonatos), Sidac (transporte/eletricidade)
- **Status `verified`:** confrontado com o CT 101 e a implementação C# existente
- **Caminhos relativos:** `L1_chunks/.../` = `L1_chunks/co2_emissions/`

---

## CONSTANTES CALIBRADAS (referência rápida)

| Constante | Valor | Fonte | Usado em |
|---|---|---|---|
| Fração de carbono na biomassa | 0.5 | IPCC | Eq. 9 |
| Razão CO₂/C (massa molecular) | 44/12 = 3.6667 | Estequiometria | Eq. 9 |
| Fator eletricidade rede BR | 0.07 kg CO₂/kWh | Sidac | Eq. 15, 23, 36 |
| Fator diesel | 2.29 kg CO₂/L | CT 101 Tab. 2 | Eq. 7, 24, 37 |
| Calcita (CaCO₃) | 0.44 kg CO₂/kg | CT 101 Tab. 3 | Eq. 8, 17, 51 |
| Caminhão betoneira | 0.096 kg CO₂/t.km | Sidac | Eq. 10, 21 |

---

## CHANGELOG RESUMIDO

| Data | Mudança |
|------|---------|
| 2025-03-05 | Criação inicial: 24 chunks L1, 4 arquivos L2, 1 overview L3, 2 recipes L4 |
| 2025-03-05 | Todas as 58 equações do CT 101 mapeadas |
| 2025-03-05 | Calibração contra Tabelas 2, 3 e exemplos numéricos do CT 101 |
