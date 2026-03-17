---
id: "CT101_UNCERTAINTY_TAYLOR"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Anexo B"
  section: "—"
  page: "p. 71"
  equation: "Eq. 57-58"
domain: ["co2_emissions", "uncertainty"]
tags: ["uncertainty", "taylor", "propagation", "statistics"]
depends_on:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_UNCERTAINTY_RANGE"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Propagação de Incertezas (Série de Taylor)

### Contexto
Alternativa à faixa min-max (Eq. 41-42). Usa expansão de Taylor de 1ª ordem para propagar incertezas nos fatores de emissão, produzindo estimativa central e desvio padrão. Mesmo procedimento usado pelo Sidac.

### Formulação Matemática

**Estimativa central (Eq. 57):**
```
C̄ = Σ (q_i × ē_i)
```

**Desvio padrão (Eq. 58):**
```
dp(C) = √(Σ (q_i² × dp(e_i)²))
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C̄ | Estimativa central da emissão | kg CO₂/UF | Valor mais provável |
| q_i | Quantidade do item "i" | UD/UF | Fixa (sem variação) |
| ē_i | Estimativa central do fator de emissão | kg CO₂/UD | (min + max) / 2 |
| dp(C) | Desvio padrão da emissão | kg CO₂/UF | — |
| dp(e_i) | Desvio padrão do fator de emissão | kg CO₂/UD | ≈ (max - min) / 4 |

### Cálculo do desvio padrão do fator
Assumindo distribuição normal com ±2σ cobrindo ~95% da faixa:
```
ē_i = (e_i,min + e_i,max) / 2
dp(e_i) = (e_i,max - e_i,min) / 4
```

### Hipóteses e Validade
- [ ] Apenas incerteza no fator de emissão (quantidades fixas)
- [ ] Fatores de emissão estatisticamente independentes entre si
- [ ] Distribuição aproximadamente normal
- [ ] Expansão de Taylor de 1ª ordem (termos de ordem superior desprezados)

### Referência Direta
"Apresenta-se um procedimento alternativo para propagação de incertezas, baseado na expansão de série de Taylor de 1ª ordem." — CT 101, p. 71
