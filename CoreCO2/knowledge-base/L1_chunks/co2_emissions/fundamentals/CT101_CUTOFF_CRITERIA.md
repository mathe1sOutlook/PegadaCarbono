---
id: "CT101_CUTOFF_CRITERIA"
type: rule
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 8 — Análise do Inventário"
  section: "8.2"
  page: "p. 25-26"
domain: ["co2_emissions", "lca", "inventory"]
tags: ["cutoff", "criteria", "mass", "energy", "inventory"]
depends_on: []
used_by:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Critérios de Corte do Inventário

### Contexto
Nem todos os itens do inventário precisam ser incluídos. Os critérios de corte permitem omitir itens insignificantes, desde que sua omissão conjunta não comprometa a representatividade do inventário.

### Regras (seção 8.2 do CT 101)

**Para materiais e resíduos:**
- Podem ser desconsiderados itens que contribuam individualmente com **< 1% da massa total** de entradas ou saídas
- Desde que a massa conjunta dos itens desconsiderados **não exceda 5% da massa total**

**Para fontes energéticas (eletricidade e combustíveis):**
- Podem ser desconsideradas fontes que contribuam individualmente com **< 1% do consumo energético total**
- Desde que a soma da energia das fontes desconsideradas **não exceda 5% do consumo energético total**

### Exceção Crítica
⚠️ **Mesmo que um item se enquadre nos critérios de massa/energia, NÃO deve ser excluído se:**
- Tiver fator de emissão de CO₂ alto
- Puder contribuir com > 1% da pegada total de CO₂

**Exemplo do CT 101:** Aditivo redutor de água = 0.06%-0.11% da massa do concreto → se enquadra no critério de massa. Porém, com fator de emissão de 1.50 kg CO₂/kg (DAP EFCA), contribui com > 1% da pegada para o concreto de 35 MPa → NÃO pode ser excluído.

### Fórmula de verificação (derivada)
Para verificar se um item pode ser excluído pela emissão:
```
e_item_max = 0.01 × C_min / q_item
```
Se o fator de emissão real do item > e_item_max → NÃO excluir.

### Hipóteses e Validade
- [ ] Avaliação feita com estimativas conservadoras
- [ ] Verificação tanto por massa/energia quanto por contribuição à pegada de CO₂
- [ ] Soma acumulada dos itens excluídos ≤ 5%

### Referência Direta
"Deve-se tomar cuidado para não excluir itens que, mesmo que sejam pouco representativos em massa ou energia, tenham um fator de emissão de CO₂ alto." — CT 101, p. 26
