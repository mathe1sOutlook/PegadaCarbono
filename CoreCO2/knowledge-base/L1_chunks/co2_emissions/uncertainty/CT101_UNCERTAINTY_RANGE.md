---
id: "CT101_UNCERTAINTY_RANGE"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.4"
  page: "p. 40"
  equation: "Eq. 41-42"
domain: ["co2_emissions", "uncertainty"]
tags: ["uncertainty", "range", "min_max"]
depends_on:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Faixa de Valores (Incerteza Simplificada)

### Contexto
A forma mais simples de considerar incertezas é calcular limites mínimo e máximo, usando os valores extremos de cada parâmetro. Produz faixa conservadora (probabilidade de ambos extremos simultâneos é baixa).

### Formulação Matemática

```
C_min = Σ (q_i,min × e_i,min)     (Eq. 41)
C_max = Σ (q_i,max × e_i,max)     (Eq. 42)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_min/C_max | Emissão mín/máx | kg CO₂/UF | Faixa de resultados |
| q_i,min/max | Quantidade mín/máx do item "i" | UD/UF | — |
| e_i,min/max | Fator de emissão mín/máx do item "i" | kg CO₂/UD | — |

### Hipóteses e Validade
- [ ] DAPs não precisam considerar incerteza do fator de emissão
- [ ] Se impraticável calcular ambos, usar valores MÁXIMOS (estimativa conservadora)
- [ ] Faixa tende a ser ampla — ver Anexo B para abordagem estatística

### Restrições Explícitas
⚠️ A faixa pode ser excessivamente ampla. Para uma estimativa mais realista, usar propagação de Taylor (Eq. 57-58).

### Referência Direta
"A forma mais simples de considerar as incertezas é calcular a faixa de valores, considerando a variação máxima de cada parâmetro do cálculo." — CT 101, p. 40
