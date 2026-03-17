---
id: "CT101_TRANSPORT_FORMULA"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 30-31"
  equation: "Eq. 10"
domain: ["co2_emissions", "emission_factors"]
tags: ["transport", "logistics", "indirect_emission"]
depends_on:
  - "CT101_TRANSPORT_EMISSION_FACTORS"
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_TRANSPORT_A4"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_END_OF_LIFE_C1C4"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Fórmula de Emissões de Transporte

### Contexto
A fórmula de transporte é usada em TODOS os estágios do ciclo de vida que envolvem movimentação de materiais ou resíduos (A2, A4, A5, B4, C2). A mesma fórmula se aplica, mudando apenas os itens e distâncias.

### Formulação Matemática

```
C_t = Σ (q_i × m_i/1000 × d_t,i × e_t,i)     (Eq. 10)
```

| Símbolo | Significado | Unidade | Observação |
|---------|-------------|---------|------------|
| C_t | Emissão total de transporte | kg CO₂/UF | — |
| q_i | Quantidade do item "i" | UD/UF | Unitarizado |
| m_i | Fator de conversão em massa | kg/UD | Para converter UD para kg |
| m_i/1000 | Conversão kg → t | t/UD | ⚠️ Divisão por 1000 obrigatória |
| d_t,i | Distância de transporte | km | Tráfego, não linha reta |
| e_t,i | Fator de emissão do transporte | kg CO₂/t.km | Tabela de fatores |

### Exemplo numérico (cimento para concreto 25 MPa)
```
q_cimento = 300 kg/m³
m_cimento = 1 (já em kg)
d_t = 700 km (ida + volta)
e_t = 0.0691 kg CO₂/t.km (carreta 5 eixos)
C_t = 300 × 1/1000 × 700 × 0.0691 = 14.5 kg CO₂/m³
```

### Hipóteses e Validade
- [ ] Distância de tráfego (não em linha reta)
- [ ] Se veículo retorna vazio: distância × 2
- [ ] m_i converte UD para kg (ex: se UD=L, m_i=densidade)
- [ ] Fator de transporte depende do tipo de veículo

### Restrições Explícitas
⚠️ ATENTAR:
- Divisão por 1000 para converter kg em toneladas — erro comum é esquecer
- Unidade do fator é t.km (não kg.km)
- Distâncias dos exemplos do CT 101 já incluem ida e volta

### Referência Direta
"A emissão de transporte é calculada conforme a Equação 10." — CT 101, p. 30-31
