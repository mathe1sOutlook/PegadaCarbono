---
id: "CT101_REPLACEMENT_COUNT"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 8 — Análise do Inventário"
  section: "8.1.3"
  page: "p. 27"
  equation: "Eq. 1"
domain: ["co2_emissions", "lca"]
tags: ["replacement", "lifecycle", "B4", "use_stage"]
depends_on: []
used_by:
  - "CT101_REPLACEMENT_B4"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Número de Reposições de Material

### Contexto
Para avaliações que incluem o estágio de uso (B4), é necessário calcular quantas vezes cada material será substituído ao longo da vida útil da edificação. Materiais com vida útil inferior ao período de referência precisam ser repostos.

### Formulação Matemática

```
n_i = ⌈PR / VU_i⌉ − 1     (Eq. 1)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| n_i | Número de reposições do material "i" | adimensional | Inteiro ≥ 0 |
| PR | Período de referência da avaliação | anos | Normalmente = VUP da edificação |
| VU_i | Vida útil do material "i" | anos | > 0 |
| ⌈x⌉ | Função teto (ceiling) | — | Arredonda para cima o resultado da divisão |

### Exemplos numéricos

| Material | VU (anos) | PR (anos) | ⌈PR/VU⌉ | n (reposições) |
|----------|-----------|-----------|---------|----------------|
| Telha cerâmica | 20 | 50 | 3 | 2 |
| Selante de junta | 10 | 50 | 5 | 4 |
| Aço estrutural | 60 | 50 | 1 | 0 |
| Concreto estrutural | 50 | 50 | 1 | 0 |

### Hipóteses e Validade
- [ ] VU_i > 0 (vida útil positiva)
- [ ] PR definido conforme VUP (ABNT NBR 15575-1)
- [ ] Se VU_i ≥ PR → n_i = 0 (sem substituição)

### Restrições Explícitas
⚠️ NÃO aplicar quando:
- VU_i ≤ 0 (inválido)
- O módulo B4 não está no escopo da análise (escopo mínimo não exige)

### Referência Direta
"As quantidades referentes à substituição de materiais cuja vida útil seja inferior à da edificação (módulo B4) deve ser calculado levando em consideração o número de reposições estimado para cada material." — CT 101, p. 27
