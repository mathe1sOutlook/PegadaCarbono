---
id: "CT101_MATERIAL_CONSUMPTION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.2"
  page: "p. 40-41"
  equation: "Eq. 43"
domain: ["co2_emissions", "lca"]
tags: ["material_consumption", "indicator", "structure"]
depends_on:
  - "CT101_INVENTORY_UNITIZATION"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Consumo de Material (Indicador)

### Contexto
Além da emissão de CO₂, o consumo de material (kg/UF) é um indicador complementar para estruturas de concreto. A análise conjunta permite avaliar consistência dos resultados e criar benchmarks para desmaterialização.

### Formulação Matemática

```
M = Σ (q_i × m_i)     (Eq. 43)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| M | Consumo de material da estrutura | kg/UF | Resultado |
| q_i | Quantidade unitária do item "i" | UD/UF | Sem perdas |
| m_i | Fator de conversão em massa | kg/UD | Ex: 1 para kg, ~2400 para m³ de concreto |

### Regras específicas
- Incluir APENAS recursos materiais e materiais processados
- **NÃO** incluir combustíveis (embora tenham massa)
- **NÃO** usar fatores de alocação econômica (apenas alocação por massa)
- Quantidades **sem perdas** (perdas são contabilizadas separadamente no A5)

### Exemplo (estrutura de edifício — CT 101 p. 65)
| Material | A1-A3 (kg/m²) | A5 (kg/m²) | Total (kg/m²) |
|----------|---------------|------------|---------------|
| Concreto 30 MPa | 269 | 13 | 282 |
| Concreto 35 MPa | 271 | 14 | 284 |
| Aço | 18 | 0.18 | 18 |
| Compensado | — | 2.8 | 2.9 |
| Madeira | — | 2.4 | 2.4 |
| **Total** | **559** | **32** | **591** |

### Hipóteses e Validade
- [ ] Alocação feita por massa (não econômica)
- [ ] Apenas materiais (não combustíveis)
- [ ] Quantidades sem perdas no estágio de produto

### Referência Direta
"Recomenda-se que seja calculado o indicador de consumo de material para estruturas. A análise conjunta dos dois indicadores permite avaliar a consistência dos resultados." — CT 101, p. 40
