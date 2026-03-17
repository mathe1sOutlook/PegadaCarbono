---
id: "CT101_END_OF_LIFE_C1C4"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.3.4"
  page: "p. 38-40"
  equation: "Eq. 35-40"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["end_of_life", "C1", "C2", "C3", "C4", "demolition", "waste"]
depends_on:
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_TRANSPORT_FORMULA"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Estágio de Fim de Vida (C1-C4)

### Contexto
O fim de vida inclui demolição (C1), transporte de resíduos (C2), processamento para reciclagem (C3) e disposição final (C4). NÃO faz parte do escopo mínimo, mas o CT 101 fornece orientações.

### Formulação Matemática

```
C_f = C_C1 + C_C2 + C_C3 + C_C4     (Eq. 35)
```

```
C_C1 = C_elet,C1 + C_comb,C1                                    (Eq. 36)
C_elet,C1 = q_elet,C1 × e_elet                                  (Eq. 36*)
C_comb,C1 = Σ (q_comb(i,C1) × e_comb,i)                        (Eq. 37)
C_C2 = Σ (q_res(i,C1→C4) × m_i/1000 × d_r,i × e_t,i)          (Eq. 38)
C_C3 = Σ (q_res,demol(i) × e_recicl(i))                        (Eq. 39)
C_C4 = Σ (q_res,demol(i,C4) × e_res(i,C4))                    (Eq. 40)
```

| Módulo | Descrição | Equação |
|--------|-----------|---------|
| C1 | Demolição (eletricidade + combustíveis) | Eq. 36-37 |
| C2 | Transporte de resíduos | Eq. 38 |
| C3 | Processamento para reciclagem | Eq. 39 |
| C4 | Disposição final | Eq. 40 |

### Destinos típicos de resíduos de demolição
| Material | Destino | Módulo |
|----------|---------|--------|
| Concreto | Aterro de RCD ou reciclagem como agregado | C3/C4 |
| Aço | Reciclagem (sucata metálica) | C3 |
| Madeira | Incineração sem recuperação energética | C4 |

### Hipóteses e Validade
- [ ] Faltam fatores de emissão representativos do contexto brasileiro para C3/C4
- [ ] Dados de demolição dependem do sistema construtivo

### Referência Direta
"A seguir, são dadas orientações sobre como calcular os indicadores referentes às etapas C1, C2, C3 e C4." — CT 101, p. 38
