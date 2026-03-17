---
id: "CT101_LCA_FUNCTIONAL_UNIT"
type: definition
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 7 — Definição do Escopo"
  section: "7.2"
  page: "p. 13-14"
domain: ["co2_emissions", "lca"]
tags: ["functional_unit", "declared_unit", "scope", "definition"]
depends_on: []
used_by:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_INVENTORY_UNITIZATION"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Unidade Funcional e Unidade Declarada

### Contexto
A unidade funcional (UF) ou declarada (UD) é a base de referência para TODOS os indicadores de emissão de CO₂. A escolha incorreta da unidade invalida comparações e pode levar a decisões erradas. Para estruturas, recomenda-se usar área construída (m²).

### Definição

**Unidade Funcional (UF):** Desempenho quantificado de um sistema de produto para utilização como unidade de referência (ABNT NBR ISO 14040). Deve considerar o desempenho técnico do produto.

**Unidade Declarada (UD):** Usada quando a função e o cenário de referência para o ciclo de vida completo não podem ser estabelecidos — típico para materiais isolados.

### Exemplos

| Objeto | Tipo | Exemplo de unidade | Observação |
|--------|------|-------------------|------------|
| Cimento | UD | 1 kg de CP II Z 40 | Não é possível definir UF sem o contexto da obra |
| Concreto | UD | 1 m³ de concreto slump 100mm | Inclui classe de resistência |
| Aço | UD | 1 kg de vergalhão CA-50 | — |
| Estrutura de edifício | UF | 1 m² de área construída | **Recomendado para estruturas** |

### Hipóteses e Validade
- [ ] Comparações entre alternativas exigem mesma UF
- [ ] Alternativas comparadas devem ter desempenho técnico equivalente
- [ ] Se UD → não permite comparação direta entre produtos com funções diferentes
- [ ] Fluxos de referência derivam da UF (quantidades de materiais para cumprir a função)

### Restrições Explícitas
⚠️ NÃO comparar:
- Produtos com unidades funcionais diferentes
- Materiais com UD diferentes sem normalização (ex: kg vs m³)
- Alternativas com desempenho técnico diferente usando apenas UF

### Referência Direta
"A unidade funcional é o 'desempenho quantificado de um sistema de produto para utilização como unidade de referência', ou seja, ela deve considerar o desempenho do produto em questão." — CT 101, p. 13
