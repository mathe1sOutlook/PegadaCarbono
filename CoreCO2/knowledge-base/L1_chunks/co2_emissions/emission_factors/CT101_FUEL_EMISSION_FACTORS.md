---
id: "CT101_FUEL_EMISSION_FACTORS"
type: concept
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 29-30"
domain: ["co2_emissions", "emission_factors"]
tags: ["fuel", "combustion", "fossil", "emission_factor", "table"]
depends_on: []
used_by:
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_END_OF_LIFE_C1C4"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Fatores de Emissão de CO₂ para Combustíveis Fósseis

### Contexto
A queima de combustíveis fósseis é uma das fontes diretas de emissão de CO₂. Os fatores desta tabela são usados em todos os estágios do ciclo de vida onde há combustão (A3, A5, C1).

### Tabela 2 — Fatores de emissão de CO₂ para combustíveis fósseis

| Combustível | Fator de emissão | Unidade | Nota |
|---|---|---|---|
| Álcool etílico hidratado | 0 | kg CO₂/L | Biomassa renovável → zero |
| Carvão mineral | 2.28 | kg CO₂/kg | — |
| Carvão vegetal não renovável | 3.03 | kg CO₂/kg | — |
| Carvão vegetal renovável | 0 | kg CO₂/kg | Biomassa renovável → zero |
| Coque de carvão mineral | 2.73 | kg CO₂/kg | — |
| Coque de petróleo | 3.42 | kg CO₂/kg | Maior fator da tabela |
| GLP (gás liquefeito de petróleo) | 2.93 | kg CO₂/kg | — |
| Gás natural | 2.74 | kg CO₂/m³ | ⚠️ Unidade em m³, não kg |
| Gasolina automotiva | 1.61 | kg CO₂/L | — |
| Lenha não renovável | 366 | kg CO₂/st | ⚠️ st = metro cúbico estéreo |
| Lenha renovável | 0 | kg CO₂/st | Biomassa renovável → zero |
| Óleo combustível | 3.11 | kg CO₂/L | — |
| Óleo diesel | 2.29 | kg CO₂/L | Combustível mais usado em obras |
| Resíduos de madeira renovável | 0 | kg CO₂/kg | Biomassa renovável → zero |
| Resíduos de óleo | 3.11 | kg CO₂/kg | — |
| Resíduo de pneu | 3.14 | kg CO₂/kg | — |
| Resíduo plástico | 1.98 | kg CO₂/kg | — |

### Hipóteses e Validade
- [ ] Combustíveis de biomassa renovável têm emissão zero (biogênico renovável)
- [ ] Os fatores consideram apenas CO₂ (não CO₂ equivalente/GWP)
- [ ] Fonte: Tabela 2 do CT 101 (IBRACON, 2024), baseada em IPCC EFDB

### Casos Especiais
- **Biomassa renovável (álcool, carvão vegetal, lenha renovável, resíduos de madeira renovável):** Emissão = 0. O CO₂ emitido na queima foi absorvido durante o crescimento da planta.
- **Gás natural:** Fator em **m³** (não kg). Atenção na conversão.
- **Lenha:** Fator em **st** (metro cúbico estéreo), unidade volumétrica da indústria madeireira.
- **Óleo diesel:** O combustível mais relevante em canteiros de obra (bombeamento, gruas, transporte interno).

### Restrições Explícitas
⚠️ ATENTAR às unidades:
- Diesel e gasolina → kg CO₂/**L** (litros)
- Carvões e coques → kg CO₂/**kg**
- Gás natural → kg CO₂/**m³**
- Lenha → kg CO₂/**st** (metro cúbico estéreo)

### Referência Direta
"Os fatores de emissão de combustíveis fósseis no sistema de produto indicam a quantidade de CO₂ emitida por quantidade de combustível queimado." — CT 101, p. 29
