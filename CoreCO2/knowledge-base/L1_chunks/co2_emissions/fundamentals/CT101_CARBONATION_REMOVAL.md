---
id: "CT101_CARBONATION_REMOVAL"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.2"
  page: "p. 31"
  equation: "Eq. 11"
domain: ["co2_emissions", "lca"]
tags: ["carbonation", "removal", "sequestration"]
depends_on:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Remoção de CO₂ por Carbonatação

### Contexto
A carbonatação é a reação do CO₂ atmosférico com materiais cimentícios, formando CaCO₃. O CO₂ absorvido pode ser subtraído das emissões totais, desde que ocorra em caráter praticamente permanente.

### Formulação Matemática

```
C_líquido = C_total − C_carb     (Eq. 11)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_líquido | Emissão líquida de CO₂ | kg CO₂/UF | Pode ser < C_total |
| C_total | Emissão total (Eq. 5) | kg CO₂/UF | Sem desconto |
| C_carb | CO₂ absorvido por carbonatação | kg CO₂/UF | Valor positivo |

### Tipos de carbonatação
- **Natural:** CO₂ absorvido diretamente da atmosfera ao longo da vida útil
- **Forçada (industrial):** CO₂ industrial injetado — neste caso o CO₂ é uma entrada no inventário com seu próprio fator de emissão

### Hipóteses e Validade
- [ ] A carbonatação é permanente (o CO₂ fica fixado como CaCO₃)
- [ ] Se carbonatação forçada: o CO₂ industrial tem fator de emissão próprio
- [ ] NÃO se confunde com compensação de emissões (carbon offset)

### Restrições Explícitas
⚠️ NÃO considerar:
- Compensações de carbono (reflorestamento, créditos) — estão fora do sistema de produto
- Carbonatação sem quantificação comprovada

### Referência Direta
"Considerando que tal remoção se dá em caráter praticamente permanente, a quantidade de CO₂ absorvida por carbonatação pode ser subtraída das emissões totais de CO₂." — CT 101, p. 31
