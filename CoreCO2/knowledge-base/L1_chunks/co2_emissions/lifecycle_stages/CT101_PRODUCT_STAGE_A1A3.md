---
id: "CT101_PRODUCT_STAGE_A1A3"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.3.1"
  page: "p. 31-34"
  equation: "Eq. 12-20"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["product_stage", "A1", "A2", "A3", "manufacturing"]
depends_on:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_CALCINATION_EMISSION"
  - "CT101_BIOMASS_EMISSION"
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_FUEL_EMISSION_FACTORS"
  - "CT101_CARBONATE_EMISSION_FACTORS"
  - "CT101_TRANSPORT_EMISSION_FACTORS"
used_by:
  - "CT101_A1A2A3_SPLIT"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Estágio de Produto A1-A3

### Contexto
O estágio de produto (berço ao portão) é o escopo mínimo obrigatório para materiais cimentícios e estruturas. Engloba extração de matérias-primas (A1), transporte até a fábrica (A2) e fabricação (A3). Normalmente declarado de forma agregada (A1+A2+A3).

### Formulação Matemática

**Para materiais (perspectiva do fabricante) — Eq. 12:**
```
C_A1-A3 = C_mp + C_elet,A3 + C_cf,A3 + C_calc,A3 + C_biomassa,A3 + C_transp + C_perdas + C_res
```

| Componente | Equação | Fórmula | Descrição |
|------------|---------|---------|-----------|
| C_mp | Eq. 13 | Σ(q_mp(i,A3) × e_mp(i,a)) | Materiais processados |
| C_transp | Eq. 14 | Σ(q_i,A3 × m_i/1000 × d_t,i × e_t,i) | Transporte de insumos |
| C_elet,A3 | Eq. 15 | q_elet,A3 × e_elet | Eletricidade na fábrica |
| C_cf,A3 | Eq. 16 | Σ(q_comb(i,A3) × e_comb,i) | Combustíveis na fábrica |
| C_calc,A3 | Eq. 17 | Σ(q_carb(i,A3) × e_calc,i) | Calcinação |
| C_transp,res | Eq. 18 | Σ(q_res(i,A3) × m_i/1000 × d_r,i × e_t,i) | Transporte de resíduos |
| C_res | Eq. 19 | Σ(q_res(i,A3) × e_res(i,C3-C4)) | Disposição de resíduos |

**Para estruturas (perspectiva do projetista) — Eq. 20:**
```
C_A1-A3 = Σ (q^p_mp(i) × e_mp(i,A1-A3))
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| q^p_mp(i) | Quantidade do material "i" sem perdas | UD/UF | Conforme projeto |
| e_mp(i,A1-A3) | Fator berço ao portão do material | kg CO₂/UD | De DAP ou Sidac |

### Diferença entre perspectivas
- **Fabricante de material:** Calcula cada componente (Eq. 12-19) com dados primários da fábrica
- **Projetista de estrutura:** Usa diretamente o fator A1-A3 do material (Eq. 20), que já inclui todos os componentes

### Hipóteses e Validade
- [ ] Quantidades SEM perdas para Eq. 20 (perdas → módulo A5)
- [ ] Fatores e_mp(i,A1-A3) incluem A1+A2+A3 do material
- [ ] Se usando DAP: GWP fóssil ≈ emissão de CO₂ (estimativa conservadora)

### Valores de referência (exemplos CT 101)

| Material | Fator A1-A3 min | Fator A1-A3 max | Unidade | Fonte |
|----------|----------------|----------------|---------|-------|
| Cimento CP II F | 750 | 750 | kg CO₂/t | DAP |
| Concreto 25 MPa | ~265 | ~285 | kg CO₂/m³ | Exemplo CT101 |
| Concreto 30 MPa | ~306 | ~332 | kg CO₂/m³ | Exemplo CT101 |
| Concreto 35 MPa | ~333 | ~347 | kg CO₂/m³ | Exemplo CT101 |
| Concreto 30 MPa (Sidac) | 228 | 339 | kg CO₂/m³ | Sidac |
| Concreto 35 MPa (Sidac) | 257 | 374 | kg CO₂/m³ | Sidac |
| Aço CA-50 | 0.45 | 1.1 | kg CO₂/kg | Sidac |
| Areia | 0 | 0.01023 | kg CO₂/kg | Sidac |
| Brita | 0 | 0.01603 | kg CO₂/kg | Sidac |

### Restrições Explícitas
⚠️ NÃO confundir:
- Eq. 12-19 (fabricante) com Eq. 20 (projetista de estrutura)
- Fatores de DAP (sem incerteza) com fatores genéricos (com faixa min-max)
- Quantidades sem perdas (A1-A3) com quantidades totais (com perdas → A5)

### Referência Direta
"O estágio de produto é declarado de forma conjunta (módulos A1, A2 e A3 somados)." — CT 101, p. 31
