---
id: "CT101_LCA_FUNDAMENTAL_EQUATION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1"
  page: "p. 28"
  equation: "Eq. 5"
domain: ["co2_emissions", "lca"]
tags: ["fundamental", "emission_calculation", "indicator"]
depends_on: []
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_PRODUCT_STAGE_STRUCTURES"
  - "CT101_UNCERTAINTY_RANGE"
  - "CT101_UNCERTAINTY_TAYLOR"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Equação Fundamental de Emissão de CO₂

### Contexto
Esta é a equação base de todo o método CT 101. Todo cálculo de emissão de CO₂ incorporada — seja para materiais cimentícios ou estruturas — se reduz à multiplicação de quantidades do inventário pelos respectivos fatores de emissão.

### Formulação Matemática

```
C_j = Σ (q_i,j × e_i)     (Eq. 5)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_j | Emissão de CO₂ do produto "j" | kg CO₂/UF | Resultado principal |
| q_i,j | Quantidade unitária do item "i" alocada ao produto "j" | UD/UF | Já unitarizada (Eq. 2) e alocada (Eq. 3) |
| e_i | Fator de emissão de CO₂ do item "i" | kg CO₂/UD | Pode ser específico (DAP) ou genérico (Sidac) |

### Hipóteses e Validade
- [ ] Todos os q_i,j estão expressos por unidade funcional (UF) ou declarada (UD)
- [ ] Os fatores de emissão e_i são consistentes com as unidades de q_i,j
- [ ] A alocação foi feita conforme Eq. 3 (se processo com múltiplos produtos)
- [ ] Critérios de corte foram aplicados (seção 8.2): <1% massa individual, <5% acumulado

### Restrições Explícitas
⚠️ NÃO aplicar quando:
- Os fatores de emissão não estão na mesma base de unidade que as quantidades
- A alocação entre co-produtos não foi feita (se aplicável)
- O inventário não foi verificado quanto ao balanço de massa

### Relação com Outros Conceitos
- **Depende de:** CT101_INVENTORY_UNITIZATION (fornece q_i,j unitarizado), CT101_ALLOCATION (fornece alocação)
- **Compõe:** Todos os cálculos de estágio (A1-A3, A4, A5, B4, C1-C4)
- **Alternativas:** Nenhuma — esta é a equação base universal do método

### Referência Direta
"O cálculo da emissão de CO₂ incorporada em um produto (material ou estrutura) pode ser resumido como a multiplicação da quantidade unitarizada (e alocada) de cada item do inventário de ciclo de vida do produto pelos respectivos fatores de emissão de CO₂." — CT 101, p. 28
