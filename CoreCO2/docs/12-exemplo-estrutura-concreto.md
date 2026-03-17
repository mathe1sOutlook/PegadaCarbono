# 12.2. Exemplo — Produção de Estrutura de Concreto Armado

*(Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101)*

## 12.2.1. Dados de entrada

Uma empresa construtora deseja calcular o consumo de material e as emissões de CO₂ incorporadas em uma estrutura de concreto armado moldada in-loco, do berço à obra. Trata-se de um edifício de 24 pavimentos tipo, com uma área construída por pavimento de 614 m².

### Tabela 14 — Quantitativos de concreto e aço por pavimento tipo

| Parâmetro | Unid. | Pilares | Vigas | Lajes |
|---|---|---|---|---|
| Volume de concreto | m³ | 52 | 23 | 65 |
| Quantidade de aço | kg | 6140 | 2545 | 5510 |
| Área de fôrmas | m² | 345 | 304 | 534 |

Nos 12 primeiros pavimentos-tipo, utiliza-se concreto de f_ck 35 MPa e nos 12 últimos, concreto de f_ck 30 MPa. O aço utilizado corresponde a vergalhão CA-50. Para a etapa de obra, a construtora estima os seguintes parâmetros:

### Tabela 15 — Estimativas de parâmetros para a etapa de obra

| Parâmetro | Unid. | Valor |
|---|---|---|
| Índice de perdas — concreto | % | 5% |
| Índice de perdas — aço | % | 1% |
| Consumo de diesel para bombeamento do concreto | L/m³ | 0.5 |

A construtora utiliza fôrmas de compensado plastificado, com 12 reutilizações para cada jogo de fôrmas. O aço é adquirido cortado e dobrado. O escoramento utilizado é metálico.

### Tabela 16 — Distâncias de transporte

| Local | Modo de transporte | Distância (km) |
|---|---|---|
| Central de concreto | Caminhão betoneira | 10 |
| Fornecedor de aço | Carreta (4 eixos) | 150 |
| Fornecedor de compensado | Carreta (4 eixos) | 250 |
| Fornecedor de madeira serrada | Carreta (4 eixos) | 120 |
| Aterro de RCD | Caminhão truck (3 eixos) | 30 |
| Usina de reciclagem de aço | Carreta (4 eixos) | 20 |
| Incineração de resíduos de madeira | Carreta (4 eixos) | 80 |

Os resíduos de concreto são encaminhados a um aterro de RCD. Os resíduos de aço são encaminhados para reciclagem, enquanto os de madeira (provenientes das fôrmas) são encaminhados para incineração sem recuperação energética.

## 12.2.2. Escopo

- **Objetivo:** calcular consumo de material e emissões de CO₂ incorporadas na estrutura, do berço à obra
- **Unidade declarada:** 1 m² de edifício, considerando sua área construída
- **Etapas do ciclo de vida:** A1-A3 (estágio de produto dos materiais), A4 (transporte até a obra), A5 (construção da estrutura)

## 12.2.3. Mapeamento do sistema de produto

> **Figura 11:** Fluxograma do sistema de produto da produção da estrutura de concreto armado, do berço à obra. Inclui: produção de cimento/aço/compensado/madeira → transporte → canteiro de obras → estrutura de concreto armado. Processos tracejados não foram considerados no escopo.

## 12.2.4. Elaboração do inventário

### Estágio de produto (A1-A3) — Sem perdas

Cálculo da quantidade de concreto por m² de área construída:

```
q'_c,PA = (n_pav × Q_pav) / (n × A_pav) = (12 × 140) / (24 × 614) = 0.114 m³/m²
```

No caso do aço, como não há diferenciação entre pavimentos, basta dividir a quantidade especificada para 1 pavimento pela área do pavimento:

```
q'_aço = Q_aço,pav / A_pav = 11190 / 614 = 18.2 kg/m²
```

#### Tabela 17 — Inventário da estrutura, estágio de produto (A1-A3)

| Categoria | Entrada/saída | Pilares | Vigas | Laje | Total | Unid. |
|---|---|---|---|---|---|---|
| **ENTRADAS** | | | | | | |
| Material processado | Concreto 30 MPa | 0.042 | 0.019 | 0.053 | 0.114 | m³ |
| | Concreto 35 MPa | 0.042 | 0.019 | 0.053 | 0.114 | m³ |
| | Aço | 0.10 | 0.041 | 0.041 | 0.18 | kg |
| | Compensado | 0.11 | 0.002 | 0.11 | 0.32 | m³ |
| | Madeira serrada bruta | 0.0023 | 0.0017 | 0.00023 | 0.0045 | m³ |
| **SAÍDAS** | | | | | | |
| Produto | Estrutura | — | — | — | 1 | m² |

### Estágio de construção (A4-A5) — Com perdas

A quantidade de materiais desperdiçados (concreto ou aço) pode ser calculada:

```
q^d_c,PA = q'_c,PA × p = 0.114 × 0.05 = 0.0057 m³/m²
```

#### Tabela 18 — Inventário para transporte (A4), por m² de área construída

| Entrada/saída | Qtde (kg/m²) | Modo | Dist. (km) | Qtde. (t.km/m²) |
|---|---|---|---|---|
| | Pilares | Vigas | Lajes | Total | | | Pilares | Vigas | Lajes | Total |
| Concreto 30 MPa | 100 | 44 | 125 | 269 | Betoneira | 20 | 3.0 | 0.88 | 2.5 | 5.4 |
| Concreto 35 MPa | 101 | 44 | 126 | 271 | Betoneira | 20 | 3.0 | 0.89 | 2.5 | 5.4 |
| Aço | 10 | 4.1 | 4.1 | 18 | Carreta 4E | 300 | 3.0 | 1.2 | 1.2 | 5.5 |

### Consumo de fôrmas (Tabela 19)

Cálculo dos consumos unitários de material para as fôrmas, considerando composições do SINAPI com 12 reutilizações:

| Item | Qtde. | Unid. | Observação |
|---|---|---|---|
| **Fôrma para pilares** | 1 | m² | SINAPI 92435 e 92264 |
| Compensado plastificado (17 mm) | 0.13 | m²/m² | 0.084 m² fôrma para parede/1.34 m² de fôrma |
| Madeira serrada bruta | 0.0031 | m³/m² | sarrafo e pontalete |
| **Fôrma para vigas** | 1 | m² | SINAPI 92472 e 92266 |
| Compensado plastificado | 0.17 | m²/m² | 0.148 m² fôrma para vigas/área de fôrma |
| Madeira serrada bruta | 0.0031 | m³/m² | sarrafo e pontalete |
| **Fôrma para laje maciça** | 1 | m² | SINAPI 92530 e 92266 |
| Compensado plastificado | 0.13 | m²/m² | 0.122 m² fôrma para laje/área de fôrma |
| Madeira serrada bruta | 0.00017 | m³/m² | ripa de madeira |

### Tabela 20 — Inventário da etapa de construção (A5)

Inventário da estrutura de concreto armado, etapa de construção (A5), considerando a produção dos materiais desperdiçados, as fôrmas, o consumo de diesel para bombeamento do concreto e a geração de resíduos. Valores por m² de área construída:

| Categoria | Entrada ou saída | Pilares | Vigas | Laje | Total | Unid. |
|---|---|---|---|---|---|---|
| **ENTRADAS** | | | | | | |
| Material processado | Concreto 30 MPa | 0.0021 | 0.00094 | 0.0028 | 0.0057 | m³ |
| | Concreto 35 MPa | 0.0021 | 0.00094 | 0.0028 | 0.0057 | m³ |
| | Aço | 0.10 | 0.041 | 0.041 | 0.18 | kg |
| | Compensado | 0.11 | 0.092 | 0.11 | 0.32 | m² |
| | Madeira serrada bruta | 0.0023 | 0.0017 | 0.00023 | 0.0045 | m³ |
| Combustível | Óleo diesel | 0.044 | 0.020 | 0.056 | 0.12 | L |
| **SAÍDAS** | | | | | | |
| Resíduos | Resíduo de concreto (aterro de RCD) | 10 | 4.4 | 13 | 27 | kg |
| | Resíduo de aço (reciclagem) | 0.10 | 0.041 | 0.041 | 0.18 | kg |
| | Resíduo de madeira | 0.0044 | 0.0033 | 0.0023 | 0.01 | m³ |
| CO₂ (emissão) | CO₂ (diesel) | 0.10 | 0.045 | 0.13 | 0.27 | kg |
| **PRODUTOS** | Estrutura | — | — | — | 1 | m² |

### Tabela 21 — Inventário de transporte de materiais desperdiçados e resíduos (A4 + C2)

Valores por m² de área construída:

| Entrada ou saída | Qtde. (kg/m²) | | | | Transporte | | Qtde. (t.km/m²) | | | |
|---|---|---|---|---|---|---|---|---|---|---|
| | Pilares | Vigas | Lajes | Total | Modo | Dist. (km) | Pilares | Vigas | Lajes | Total |
| Concreto 30 MPa | 3.0 | 2.2 | 6.2 | 13 | Betoneira | 20 | 0.10 | 0.044 | 0.13 | 0.21 |
| Concreto 35 MPa | 3.0 | 2.2 | 6.2 | 14 | Betoneira | 20 | 0.10 | 0.044 | 0.13 | 0.21 |
| Aço | 0.10 | 0.041 | 0.041 | 0.18 | Carreta 4E | 300 | 0.009 | 0.012 | 0.012 | 0.033 |
| Compensado | 1.0 | 0.90 | 1.17 | 2.8 | Carreta 4E | 500 | 0.30 | 0.42 | 0.52 | 1.4 |
| Madeira | 1.3 | 0.90 | 0.17 | 2.4 | Carreta 4E | 240 | 0.22 | 0.042 | 0.042 | 0.6 |
| Resíduo concreto | 10 | 4.4 | 13 | 27 | Truck 3E | 60 | 0.40 | 0.27 | 0.75 | 1.6 |
| Resíduo aço | 0.10 | 0.041 | 0.041 | 0.18 | Carreta 4E | 40 | 0.0040 | 0.0012 | 0.0016 | 0.0072 |
| Resíduo madeira | 2.3 | 1.7 | 1.2 | 5.3 | Carreta 4E | 160 | 0.37 | 0.28 | 0.19 | 0.84 |

### Inventário consolidado do berço à obra (Tabela 22)

| Categoria | Entrada ou saída | Pilares | Vigas | Laje | Total | Un. | Modo | Dist. (km) |
|---|---|---|---|---|---|---|---|---|
| **ENTRADAS** | | | | | | | | |
| Material processado | Concreto 30 MPa | 0.044 | 0.020 | 0.056 | 0.12 | m³ | Betoneira | 20 |
| | Concreto 35 MPa | 0.044 | 0.020 | 0.056 | 0.12 | m³ | Betoneira | 20 |
| | Aço | 0.10 | 0.041 | 0.041 | 0.18 | t | Carreta 4E | 300 |
| | Compensado | 0.11 | 0.092 | 0.11 | 0.32 | m² | Carreta 4E | 500 |
| | Madeira | 0.0025 | 0.0017 | 0.0003 | 0.004 | m³ | Carreta 4E | 240 |
| Combustível | Óleo diesel | 0.044 | 0.020 | 0.056 | 0.12 | L | — | — |
| **SAÍDAS** | | | | | | | | |
| Resíduos | Concreto (RCD) | 10 | 4.4 | 13 | 27 | kg | Truck 3E | 60 |
| | Aço (reciclagem) | 0.10 | 0.041 | 0.041 | 0.18 | kg | Carreta 4E | 40 |
| | Madeira | 0.0044 | 0.0033 | 0.0023 | 0.01 | m³ | Carreta 4E | 160 |
| CO₂ (diesel) | CO₂ | 0.10 | 0.045 | 0.13 | 0.27 | kg | — | — |
| **PRODUTOS** | Estrutura | — | — | — | 1 | m² | — | — |

## 12.2.5. Cálculo da emissão de CO₂

### Tabela 23 — Fatores de emissão de CO₂

| Item | Fator min. | Fator max. | Unid. | Fonte |
|---|---|---|---|---|
| **Matérias-primas** | | | | |
| Concreto 30 MPa | 228 | 339 | kg CO₂/m³ | Sidac |
| Concreto 35 MPa | 257 | 374 | kg CO₂/m³ | Sidac |
| Aço CA-50 | 0.45 | 1.1 | kg CO₂/kg | Sidac |
| Madeira serrada bruta (ipê) | 17 | 35 | kg CO₂/m³ | — |
| Compensado plastificado 17mm | 7.2 | 10.8 | kg CO₂/m² | EPD* |
| **Transporte** | | | | |
| Caminhão betoneira | 0.096 | 0.096 | kg CO₂/t.km | Sidac |
| Caminhão truck (3 eixos) | 0.068 | 0.068 | kg CO₂/t.km | Sidac |
| Caminhão carreta (4 eixos) | 0.066 | 0.066 | kg CO₂/t.km | Sidac |

*Estimativa com base em uma EPD de uma associação austríaca de produtos de madeira (EPD-S P-00604). Arbitrou-se uma variação de ± 20%.*

### Tabela 24 — Resultados por etapa do ciclo de vida

Os resultados detalhados mostram as emissões de CO₂ por item de inventário, desdobradas nas etapas A1-A3 (produção das matérias-primas), A4+C2 (transporte), A5 (etapa de construção, incluindo produção dos materiais desperdiçados, fôrmas e geração de resíduos).

### Tabela 25 — Consumo de material, do berço à obra

| Material | Etapas A1-A3 (kg/m²) | Etapa A5 (kg/m²) | A1-A5 (kg/m²) |
|---|---|---|---|
| | Pilares | Vigas | Laje | Total | Pilares | Vigas | Laje | Total | Total |
| Concreto 30 MPa | 100 | 44 | 125 | 269 | 5.0 | 2.2 | 6.2 | 13 | 282 |
| Concreto 35 MPa | 101 | 44 | 126 | 271 | 5.0 | 2.2 | 6.2 | 14 | 284 |
| Aço | 10 | 4.1 | 4.1 | 18 | 0.10 | 0.041 | 0.041 | 0.18 | 18 |
| Compensado | — | — | — | — | 1.0 | 0.85 | 1.0 | 2.8 | 2.9 |
| Madeira | — | — | — | — | 1.3 | 0.90 | 0.17 | 2.4 | 2.4 |
| **Total** | 211 | 93 | 255 | 559 | 12 | 6.2 | 14 | 32 | 591 |

## 12.2.6. Interpretação dos resultados

A estrutura de concreto armado analisada apresenta um consumo total de material de **591 kg/m²** e uma emissão total de CO₂ varia entre **70 e 111 kg CO₂/m²**.

### Análise por etapa do ciclo de vida

> **Figura 12a (Consumo de material):** As etapas A1-A3 representam 95% do consumo de material, enquanto a etapa A5 (obra) contribuiu com apenas 5%.
>
> **Figura 12b (Emissão de CO₂):** As etapas A1-A3 representam 91% das emissões de CO₂ do berço à obra. A etapa de transporte contribuiu com apenas 1%, enquanto a obra propriamente dita contribuiu com 8% (devido sobretudo às perdas de concreto e consumo de fôrmas).

### Análise por insumo

> **Figura 13a (Consumo de material):** O concreto é responsável por 96% do consumo de material e 77% da pegada de CO₂, enquanto o aço representa apenas 3% da massa total de material, mas contribuiu com 18% das emissões de CO₂ do berço à obra.
>
> **Figura 13b (Emissão de CO₂):** A madeira e o transporte representam 0.2% e 2%, respectivamente.

### Ações prioritárias

Com base nesses resultados, para reduzir o impacto ambiental desta estrutura em questão, é necessário **reduzir as emissões de CO₂ associadas ao concreto e ao aço**, seja reduzindo seu consumo por meio da otimização do projeto [23], seja selecionando fornecedores com menor emissão de CO₂, ou ambas conjuntamente.

### Comparação com benchmarks

> **Figura 14:** Comparação dos indicadores de desempenho ambiental (do berço ao portão) obtidos para a estrutura de concreto armado e benchmark [23]:
>
> **(a) Consumo de material:** a estrutura analisada apresenta valores próximos à mediana do benchmark
>
> **(b) Emissão de CO₂:** considerando os fatores de emissão máximos, a emissão se encontra acima da mediana, sugerindo potencial de melhoria
>
> Consideraram-se apenas os edifícios com altura entre 21 e 30 pavimentos no benchmark para permitir uma comparação adequada.

*(p. 56-65 do documento)*
