---
id: "CT101_CARBONATE_EMISSION_FACTORS"
type: concept
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 30"
domain: ["co2_emissions", "emission_factors"]
tags: ["carbonate", "calcination", "emission_factor", "table"]
depends_on: []
used_by:
  - "CT101_CALCINATION_EMISSION"
  - "CT101_PRODUCT_STAGE_A1A3"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Fatores de Emissão de CO₂ para Calcinação de Carbonatos

### Contexto
A decomposição térmica (calcinação) de carbonatos libera CO₂ estequiometricamente. É a principal fonte direta de CO₂ na produção de clínquer (cimento). Os fatores são derivados da estequiometria da reação química, assumindo 100% de calcinação.

### Tabela 3 — Fatores de emissão de CO₂ para calcinação de carbonatos

| Fórmula molecular | Nome do mineral | Fator (kg CO₂/kg carbonato) | Min | Max |
|---|---|---|---|---|
| CaCO₃ | Calcita | 0.44 | 0.44 | 0.44 |
| MgCO₃ | Magnesita | 0.52 | 0.52 | 0.52 |
| CaMg(CO₃)₂ | Dolomita | 0.48 | 0.48 | 0.48 |
| FeCO₃ | Siderita | 0.38 | 0.38 | 0.38 |
| Ca(Fe,Mg,Mn)(CO₃)₂ | Ankerita | 0.41-0.48 | 0.41 | 0.48 |
| MnCO₃ | Rodocrosita | 0.38 | 0.38 | 0.38 |
| Na₂CO₃ | Carbonato de sódio | 0.41 | 0.41 | 0.41 |

### Base estequiométrica
Reação genérica: MCO₃ → MO + CO₂
Fator = M(CO₂) / M(MCO₃)

Para calcita: 44 / 100 = 0.44 kg CO₂/kg CaCO₃

### Hipóteses e Validade
- [ ] Assume 100% de calcinação (conversão completa)
- [ ] Fatores são estequiométricos (sem incerteza experimental)
- [ ] A Ankerita tem composição variável → faixa 0.41-0.48
- [ ] Fonte: IPCC Guidelines for National Greenhouse Gas Inventories (2006)

### Casos Especiais
- **Ankerita:** Único carbonato com faixa de valores (composição mineral variável)
- **Calcita (CaCO₃):** Principal carbonato na produção de cimento (limestone)

### Restrições Explícitas
⚠️ NÃO confundir:
- Estes fatores são por kg de CARBONATO (matéria-prima), não por kg de PRODUTO (cimento)
- A quantidade de carbonato no cimento depende do tipo de cimento e dos teores de clínquer/filler

### Referência Direta
"A Tabela 3 indica fatores de emissão de CO₂ para decomposição de carbonatos, considerando 100% de calcinação." — CT 101, p. 30
