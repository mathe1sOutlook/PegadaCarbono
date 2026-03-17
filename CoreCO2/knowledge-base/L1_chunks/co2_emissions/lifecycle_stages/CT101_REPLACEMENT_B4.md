---
id: "CT101_REPLACEMENT_B4"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.3.3"
  page: "p. 37-38"
  equation: "Eq. 30-34"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["replacement", "B4", "use_stage", "maintenance"]
depends_on:
  - "CT101_REPLACEMENT_COUNT"
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_TRANSPORT_FORMULA"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Substituição de Materiais (B4)

### Contexto
Materiais com vida útil inferior ao período de referência precisam ser substituídos. B4 contabiliza: produção dos novos materiais + transporte + resíduos dos materiais antigos. NÃO faz parte do escopo mínimo.

### Formulação Matemática

```
C_B4 = C_B4(A1-A3) + C_B4,A4 + C_B4,C2 + C_B4,C3-C4     (Eq. 30)
```

```
C_B4(A1-A3) = Σ (q_mp(i,B4) × e_mp(i,A1-A3))              (Eq. 31)
C_B4,A4 = Σ (q_mp(i,B4) × m_i/1000 × d_t,i × e_t,i)      (Eq. 32)
C_B4,C2 = Σ (q_res(i,B4) × m_i/1000 × d_r,i × e_t,i)     (Eq. 33)
C_B4,C3-C4 = Σ (q_res(i,B4) × e_res(i,C3-C4))             (Eq. 34)
```

As quantidades q_mp(i,B4) devem ser multiplicadas pelo número de reposições n_i (Eq. 1).

### Hipóteses e Validade
- [ ] Período de referência definido (normalmente = VUP)
- [ ] Vida útil de cada material conhecida
- [ ] n_i calculado pela Eq. 1
- [ ] Quantidades incluem eventuais perdas na substituição

### Referência Direta
"Seguem orientações sobre como calcular os indicadores referentes à etapa B4 (substituição de produtos com vida útil inferior ao período de referência)." — CT 101, p. 37
