---
id: "CT101_BIOMASS_EMISSION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 30"
  equation: "Eq. 9"
domain: ["co2_emissions", "emission_factors"]
tags: ["biomass", "non_renewable", "direct_emission"]
depends_on: []
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Emissão por Biomassa Não Renovável

### Contexto
Quando biomassa não renovável é queimada ou decomposta, o CO₂ emitido deve ser contabilizado. Biomassa renovável tem emissão zero (o CO₂ foi absorvido durante o crescimento).

### Formulação Matemática

```
C_biomassa = biomassa_seca × 0.5 × (44/12)     (Eq. 9)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_biomassa | Emissão de CO₂ | kg CO₂ | — |
| biomassa_seca | Massa de biomassa seca | kg | — |
| 0.5 | Fração de carbono na biomassa | adimensional | 50% da massa seca é carbono |
| 44/12 | Razão massa molecular CO₂/C | adimensional | ≈ 3.667 |

### Constantes calibradas
- **Fração de carbono:** 0.5 (50%) — valor convencional do IPCC
- **Razão CO₂/C:** 44/12 = 3.6667 — estequiometria exata (C + O₂ → CO₂)

### Exemplo numérico
```
biomassa_seca = 100 kg
C_biomassa = 100 × 0.5 × 3.667 = 183.3 kg CO₂
```

### Hipóteses e Validade
- [ ] Apenas biomassa NÃO renovável gera emissão contabilizável
- [ ] Biomassa renovável → emissão = 0 (ciclo biogênico fechado)
- [ ] Fração de carbono de 50% é valor convencional (IPCC)

### Restrições Explícitas
⚠️ NÃO aplicar para biomassa renovável (carvão vegetal renovável, lenha renovável, etc.)

### Referência Direta
"A emissão de CO₂ devida à queima ou decomposição de biomassa não renovável é calculada pela Equação 9." — CT 101, p. 30
