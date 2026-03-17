---
id: "CT101_ALLOCATION"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 8 — Análise do Inventário"
  section: "8.3"
  page: "p. 26-27"
  equation: "Eq. 3-4"
domain: ["co2_emissions", "lca", "inventory"]
tags: ["allocation", "co-products", "inventory"]
depends_on:
  - "CT101_INVENTORY_UNITIZATION"
used_by:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Alocação dos Fluxos de Inventário

### Contexto
Quando um processo produz mais de um produto (co-produtos), os fluxos de inventário devem ser divididos entre eles. A alocação pode ser física (proporcional à massa) ou econômica (proporcional à receita).

### Formulação Matemática

**Equação 3 — Alocação:**
```
q_i,j = (Q_i / Q_total,j) × α_aloc,j
```

**Equação 4 — Verificação da alocação:**
```
Q_i = Σ (q_i,j × Q_prod,j)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| q_i,j | Quantidade do item "i" alocada ao produto "j" | UD/UF | Resultado |
| Q_i | Quantidade total do item "i" | UD | Não alocada |
| Q_total,j | Quantidade total do produto "j" | UF | — |
| α_aloc,j | Fator de alocação do produto "j" | % | Σ α_aloc,j = 100% |

### Regras de prioridade para alocação
1. **Evitar** alocação sempre que possível (subdividir processo)
2. **Alocação física** (proporcional à massa ou volume) quando possível
3. **Alocação econômica** (proporcional à receita) quando alocação física não faz sentido
4. Se contribuição de um co-produto < 1% da receita total → pode não alocar nada a ele
5. **Nunca** alocar fluxos de inventário a resíduos (apenas produtos carregam impactos)

### Exemplo clássico — Alto-forno
- Ferro gusa (produto principal) + escória de alto forno (co-produto)
- Alocação física por massa → impacto irreal para escória
- **Usar alocação econômica:** receita do ferro gusa >>> receita da escória

### Hipóteses e Validade
- [ ] Σ α_aloc,j = 100%
- [ ] Verificação (Eq. 4): soma das parcelas alocadas = total original
- [ ] Resíduos NÃO recebem alocação

### Restrições Explícitas
⚠️ NÃO alocar quando:
- O processo tem apenas um produto
- O item é classificado como resíduo (não produto)
- É possível subdividir o processo em subprocessos específicos

### Referência Direta
"A alocação dos fluxos de inventário sempre é necessária em processos que produzem mais de um produto." — CT 101, p. 26
