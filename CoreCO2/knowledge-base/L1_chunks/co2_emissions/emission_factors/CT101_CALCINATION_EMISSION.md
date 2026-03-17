---
id: "CT101_CALCINATION_EMISSION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 30"
  equation: "Eq. 8"
domain: ["co2_emissions", "emission_factors"]
tags: ["calcination", "carbonate", "direct_emission", "cement"]
depends_on:
  - "CT101_CARBONATE_EMISSION_FACTORS"
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Emissão por Decomposição de Carbonatos (Calcinação)

### Contexto
Na produção de clínquer (cimento), o calcário (CaCO₃) é decomposto termicamente, liberando CO₂ estequiometricamente. É a principal fonte direta de CO₂ na cadeia do cimento — tipicamente responde por ~60% das emissões de uma fábrica de cimento.

### Formulação Matemática

```
C_calc = q_calc × e_calc     (Eq. 8)
```

Para múltiplos carbonatos (Anexo A, Eq. 51):
```
C_calc,A3 = Σ (q_carb(i,A3) × e_calc,i)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_calc | Emissão por calcinação | kg CO₂/UF | — |
| q_calc | Quantidade de carbonato calcinado | kg/UF | — |
| e_calc | Fator de emissão do carbonato | kg CO₂/kg | Tabela 3 |

### Hipóteses e Validade
- [ ] Assume 100% de calcinação (conversão completa)
- [ ] Aplicável apenas a processos com decomposição térmica de carbonatos
- [ ] Na perspectiva da estrutura (não do cimento), a calcinação está embutida no fator A1-A3 do cimento

### Referência Direta
"A emissão de CO₂ devida à decomposição de carbonatos é calculada pela Equação 8." — CT 101, p. 30
