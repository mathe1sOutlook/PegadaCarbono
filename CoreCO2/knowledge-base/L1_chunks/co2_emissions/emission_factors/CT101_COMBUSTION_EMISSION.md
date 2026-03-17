---
id: "CT101_COMBUSTION_EMISSION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 29"
  equation: "Eq. 7"
domain: ["co2_emissions", "emission_factors"]
tags: ["combustion", "fossil_fuel", "direct_emission"]
depends_on:
  - "CT101_FUEL_EMISSION_FACTORS"
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_END_OF_LIFE_C1C4"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Emissão por Queima de Combustíveis Fósseis

### Contexto
A combustão de combustíveis fósseis é uma emissão DIRETA de CO₂ (ocorre dentro do sistema de produto). Aplica-se em fábricas (A3), canteiros de obra (A5), e demolição (C1).

### Formulação Matemática

```
C_comb = Σ (q_comb,i × e_comb,i)     (Eq. 7)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_comb | Emissão total por combustão | kg CO₂/UF | — |
| q_comb,i | Quantidade do combustível "i" | UD/UF | Unidade conforme Tabela 2 |
| e_comb,i | Fator de emissão do combustível "i" | kg CO₂/UD | Tabela 2 |

### Exemplo numérico (central de concreto)
```
q_diesel = 0.45 L/m³
e_diesel = 2.29 kg CO₂/L
C_diesel = 0.45 × 2.29 = 1.03 kg CO₂/m³
```

### Hipóteses e Validade
- [ ] Fatores da Tabela 2 aplicáveis
- [ ] Combustíveis renováveis têm fator = 0 (não esquecer de incluir no inventário mesmo assim)
- [ ] Emissão direta → contabilizada no módulo onde a combustão ocorre

### Referência Direta
"A emissão de CO₂ devida à queima de combustíveis fósseis é calculada pela Equação 7." — CT 101, p. 29
