---
id: "CT101_INVENTORY_UNITIZATION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 8 — Análise do Inventário"
  section: "8.3"
  page: "p. 26"
  equation: "Eq. 2"
domain: ["co2_emissions", "lca", "inventory"]
tags: ["inventory", "unitization", "quantity"]
depends_on: []
used_by:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_ALLOCATION"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Fluxos Unitários de Inventário

### Contexto
Antes de aplicar a equação fundamental (Eq. 5), as quantidades absolutas do inventário devem ser convertidas para a unidade funcional ou declarada. Esta equação faz a normalização.

### Formulação Matemática

```
q_i = Q_i / Q_total     (Eq. 2)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| q_i | Quantidade unitária do item "i" | UD/UF | Resultado normalizado |
| Q_i | Quantidade total do item "i" (entrada ou saída) | UD | Valor absoluto do período |
| Q_total | Quantidade total do produto | UF | Produção total do período |

### Exemplo numérico
Central de concreto:
- Consumo mensal de eletricidade: Q_elet = 8.000 kWh/mês
- Produção mensal: Q_total = 4.000 m³/mês
- q_elet = 8.000 / 4.000 = **2,0 kWh/m³**

### Hipóteses e Validade
- [ ] Q_total > 0
- [ ] Q_i e Q_total medidos no mesmo período (recomendado ≥ 12 meses)
- [ ] Unidades compatíveis entre numerador e denominador
- [ ] Se o traço do concreto já fornece quantidades em kg/m³, a unitarização já está feita

### Restrições Explícitas
⚠️ ATENTAR:
- Verificar análise dimensional sempre
- Para processos com múltiplos produtos, aplicar alocação (Eq. 3) APÓS a unitarização

### Referência Direta
"O cálculo dos fluxos unitários de inventário deve ser feito conforme a Equação 2." — CT 101, p. 26
