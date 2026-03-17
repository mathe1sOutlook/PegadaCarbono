---
id: "CT101_TRANSPORT_EMISSION_FACTORS"
type: concept
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 9 — Cálculo dos Indicadores"
  section: "9.1.1"
  page: "p. 30-31"
domain: ["co2_emissions", "emission_factors"]
tags: ["transport", "emission_factor", "truck", "logistics"]
depends_on: []
used_by:
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_TRANSPORT_A4"
  - "CT101_PRODUCT_STAGE_A1A3"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Fatores de Emissão de CO₂ para Transporte Rodoviário

### Contexto
O transporte de materiais, produtos e resíduos gera emissão de CO₂ em todos os estágios do ciclo de vida (A2, A4, A5, B4, C2). Os fatores são expressos em kg CO₂ por tonelada-quilômetro (t.km).

### Fatores de transporte (dados Sidac, Brasil)

| Modo de transporte | Fator (kg CO₂/t.km) | Observação |
|---|---|---|
| Caminhão toco (2 eixos) | 0.0178 | Menor capacidade |
| Caminhão truck (3 eixos) | 0.0601 | Uso geral: agregados, resíduos |
| Caminhão carreta (4 eixos) | 0.066 | Transporte interurbano: aço, compensados |
| Caminhão carreta (5 eixos) | 0.0691 | Grandes distâncias: cimento |
| Caminhão betoneira | 0.096 | ⚠️ Maior fator — transporte de concreto |

### Fator de emissão da eletricidade (dados Sidac)

| Fonte | Fator (kg CO₂/kWh) | Observação |
|---|---|---|
| Rede pública brasileira | 0.07 | Varia com a matriz energética |

### Cálculo de distância
- Se o veículo retorna vazio: **multiplicar distância por 2**
- Usar **distância de tráfego** (não em linha reta)
- Para os exemplos do CT 101, as distâncias já são ida + volta

### Hipóteses e Validade
- [ ] Fatores são para transporte rodoviário brasileiro
- [ ] Incluem o consumo de combustível do veículo (diesel)
- [ ] NÃO incluem retorno vazio (deve ser contabilizado na distância)
- [ ] Fonte: Sidac (Sistema de Informação do Desempenho Ambiental da Construção)

### Restrições Explícitas
⚠️ ATENTAR:
- Unidade é t.km (tonelada-quilômetro), NÃO kg.km → converter massa para toneladas (/1000)
- Betoneira tem fator maior que carretas por ter menor eficiência de carga útil
- Fatores do Sidac podem ter revisões futuras — verificar versão

### Referência Direta
"Os fatores de emissão do Sidac consideram transporte rodoviário brasileiro." — CT 101 (dados compilados dos exemplos)
