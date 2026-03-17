---
id: "CT101_CONSTRUCTION_A5"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.3.2"
  page: "p. 34-37"
  equation: "Eq. 22-29"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["construction", "A5", "waste", "losses", "formwork"]
depends_on:
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_PRODUCT_STAGE_A1A3"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Processo Construtivo (A5)

### Contexto
O módulo A5 inclui TUDO que acontece no canteiro de obras: eletricidade, combustão de diesel (bombeamento), perdas de materiais e geração de resíduos. É recomendado (não obrigatório) para estruturas.

### Formulação Matemática

**Equação principal:**
```
C_A5 = C_elet,A5 + C_comb,A5 + C_perdas,A5     (Eq. 22)
```

**Componentes:**
```
C_elet,A5 = q_elet,A5 × e_elet                                    (Eq. 23)
C_comb,A5 = Σ (q_comb(i,A5) × e_comb,i)                          (Eq. 24)
C_perdas,A5 = C_A1-A3,desp + C_A4,desp + C_A5,res + C_A5,res,recicl (Eq. 25)
```

**Detalhamento das perdas:**
```
C_A1-A3,desp = Σ (q^d_mp(i,A5) × e_mp(i,A1-A3))                 (Eq. 26)
C_A4,desp = Σ (q^d_mp(i,A5) × m_i/1000 × d_t,i × e_t,i)        (Eq. 27)
C_A5,res = Σ (q_res(i,A5) × m_i/1000 × d_r,i × e_t,i)           (Eq. 28)
C_A5,res,recicl = Σ (q_res(i,A5) × e_res(i,C3-C4))              (Eq. 29)
```

| Componente | Descrição |
|------------|-----------|
| C_elet,A5 | Eletricidade consumida na obra |
| C_comb,A5 | Combustão de diesel no canteiro |
| C_A1-A3,desp | Emissões de fabricação dos materiais desperdiçados |
| C_A4,desp | Emissões de transporte dos materiais desperdiçados |
| C_A5,res | Transporte dos resíduos até destinação |
| C_A5,res,recicl | Processamento/reciclagem/disposição dos resíduos |

### Valores de referência (exemplo CT 101 — edifício 24 pav)
- Índice de perdas concreto: **5%**
- Índice de perdas aço: **1%**
- Diesel para bombeamento: **0.5 L/m³**
- Fôrmas de compensado: **12 reutilizações** por jogo
- Resultado: A5 ≈ **8%** da emissão total berço-à-obra

### Hipóteses e Validade
- [ ] Índices de perdas podem ser estimados ou medidos
- [ ] Perdas incluem: desperdício + perdas incorporadas (espessura extra)
- [ ] Fôrmas contabilizadas em A5 (não em A1-A3 da estrutura)
- [ ] Escoramento metálico desconsiderado (reutilizável muitas vezes)

### Restrições Explícitas
⚠️ ATENTAR:
- Perdas de material geram emissões em 4 categorias: fabricação + transporte + transporte resíduos + disposição
- Fôrmas são materiais consumidos no A5, não na estrutura permanente

### Referência Direta
"A emissão de CO₂ da etapa de processo construtivo (A5) é calculada pelas Equações 22 a 29." — CT 101, p. 34
