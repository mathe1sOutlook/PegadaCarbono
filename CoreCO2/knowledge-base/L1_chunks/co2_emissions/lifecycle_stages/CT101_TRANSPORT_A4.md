---
id: "CT101_TRANSPORT_A4"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.3.2"
  page: "p. 34"
  equation: "Eq. 21"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["transport", "A4", "construction_stage"]
depends_on:
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_TRANSPORT_EMISSION_FACTORS"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Transporte até a Obra (A4)

### Contexto
O módulo A4 cobre o transporte dos produtos de construção das fábricas até o canteiro de obras. Aplicável a estruturas de concreto (não faz parte do escopo mínimo de materiais cimentícios).

### Formulação Matemática

```
C_A4 = Σ (q'_i × m_i/1000 × d_t,i × e_t,i)     (Eq. 21)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_A4 | Emissão do transporte até a obra | kg CO₂/UF | — |
| q'_i | Quantidade do item sem perdas | UD/UF | ⚠️ Sem perdas |
| m_i | Fator de conversão em massa | kg/UD | — |
| d_t,i | Distância fábrica→obra | km | Ida e volta |
| e_t,i | Fator de emissão do transporte | kg CO₂/t.km | — |

### Exemplo numérico (estrutura — CT 101)
```
Concreto 30 MPa: 269 kg/m² × 1/1000 × 20 km × 0.096 = 0.52 kg CO₂/m²
Aço CA-50: 18 kg/m² × 1/1000 × 300 km × 0.066 = 0.36 kg CO₂/m²
```

### Hipóteses e Validade
- [ ] Quantidades SEM perdas (perdas no A5)
- [ ] Distâncias específicas de cada obra
- [ ] Modo de transporte apropriado para cada material

### Referência Direta
"Para estruturas, o estágio do processo construtivo é declarado separadamente nas etapas A4 e A5." — CT 101, p. 34
