# 12.1. Exemplo — Produção de Concreto Dosado em Central

*(Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101)*

## 12.1.1. Dados de entrada

Uma central de concreto quer informar as emissões de CO₂ incorporadas para os três tipos de concreto que produz, do berço ao portão da central.

### Tabela 4 — Traços dos concretos

| Material | Unid. | 25 MPa | 30 MPa | 35 MPa |
|---|---|---|---|---|
| Cimento CP II F | kg/m³ | 294 | 343 | 377 |
| Areia | kg/m³ | 784 | 760 | 733 |
| Brita | kg/m³ | 1074 | 1029 | 1005 |
| Aditivo redutor de água | kg/m³ | 1.47 | 1.96 | 2.45 |
| Água | L/m³ | 176 | 189 | 189 |

A central também disponibiliza informações sobre o consumo mensal de eletricidade, diesel (dos equipamentos internos à central, sem considerar os caminhões betoneira), água (para limpeza da central), além da quantidade de resíduos de concreto encaminhada ao aterro de inertes e a produção de cada concreto por mês.

### Tabela 5 — Informações mensais da central de concreto

| Mês | Eletricidade (kWh) | Diesel (L) | Geração de água (m³) | Geração de resíduo (m³) | Produção 25 MPa (m³) | Produção 30 MPa (m³) | Produção 35 MPa (m³) |
|---|---|---|---|---|---|---|---|
| 1 | 31725 | 2980 | 630 | 142 | 2500 | 2900 | 2600 |
| 2 | 25515 | 2180 | 445 | 154 | 2700 | 2700 | 2700 |
| ... | ... | ... | ... | ... | ... | ... | ... |
| 12 | 24150 | 3927 | 630 | 164 | 2550 | 3600 | 2600 |

### Tabela 6 — Distâncias de transporte

| Local | Modo de transporte | Distância (km) |
|---|---|---|
| Fábrica de cimento | Caminhão carreta (5 eixos) | 350 |
| Fornecedor de areia | Caminhão truck (3 eixos) | 150 |
| Fornecedor de brita | Caminhão truck (3 eixos) | 80 |
| Fornecedor de aditivo | Caminhão toco (2 eixos) | 200 |
| Aterro de inertes | Caminhão truck (3 eixos) | 30 |

O fornecedor de cimento dispõe de uma DAP do seu produto: fator de emissão de CO₂ = **750 kg CO₂/t cimento**.

## 12.1.2. Escopo

- **Objetivo:** avaliar o desempenho ambiental dos três tipos de concreto, do berço ao portão da central
- **Unidade declarada:** 1 m³ de concreto
- **Etapas do ciclo de vida:** A1 (produção das matérias-primas), A2 (transporte até a central de concreto), A3 (produção do concreto propriamente dita)

## 12.1.3. Mapeamento do sistema de produto

> **Figura 8:** Fluxograma do sistema de produto da produção de concreto dosado em central, do berço ao portão. Mostra a cadeia: produção de cimento → transporte → central de concreto → três tipos de concreto (25, 30, 35 MPa). Os processos elementares tracejados não foram considerados no escopo do estudo por se enquadrarem nas regras de corte.

## 12.1.4. Elaboração do inventário

O inventário da produção dos concretos deve informar as quantidades das entradas e saídas em relação à unidade declarada (1 m³ de cada tipo de concreto).

### Cálculo do índice de perdas

A central informa uma perda total de concreto de 1920 m³ e no mesmo período produziu 96000 m³ de concreto. O índice de perdas "p" é:

```
p = Σq_perdas / Σq_produção = 1920 / 96000 = 2%
```

### Quantidades com perdas

As quantidades de material informadas nos traços teóricos devem ser aumentadas em 2%:

```
q_mat,i = q'_mat,i × (1 + p)
```

Exemplo para cimento do concreto f_ck 30 MPa:
```
q_cim,30 = 343 × (1 + 0.02) = 350 kg/m³
```

### Consumos unitários da central

```
q_elet = Σq_elet,total / Σq_conc,total = 288000 / 96000 = 3.0 kWh/m³
q_diesel = Σq_diesel / Σq_conc,total = 43200 / 96000 = 0.45 L/m³
```

A combustão do diesel gera uma emissão direta de CO₂ na central de concreto:
```
C_diesel = q_diesel × e_diesel = 0.45 × 2.29 = 1.03 kg CO₂/m³
```

### Geração de resíduos

```
q_res = p × ρ_média = 0.02 × 2322 = 46 kg/m³
```

### Água de limpeza

```
q_água,limp = Σq_água,limp / Σq_conc = 7680 / 96000 = 0.08 m³/m³ = 80 L/m³
```

Quantidade total de água (exemplo para 35 MPa):
```
q_água,35 = 189 × (1 + 0.02) + 80 = 273 L/m³
```

## 12.1.5. Cálculo da emissão de CO₂

### Tabela 7 — Inventário da produção dos concretos dosados em central

| Categoria | Entrada/saída | Unid. | 25 MPa | 30 MPa | 35 MPa | Modo | Distância (km) |
|---|---|---|---|---|---|---|---|
| **ENTRADAS** | | | | | | | |
| Material processado | Cimento CP II F | kg | 300 | 350 | 385 | Carreta 5E | 700 |
| | Areia | kg | 800 | 775 | 750 | Truck 3E | 300 |
| | Brita | kg | 1100 | 1050 | 1025 | Truck 3E | 160 |
| | Aditivo | kg | 1.50 | 2.00 | 2.50 | Toco 2E | 200 |
| Eletricidade | Eletricidade rede | kWh | 3.0 | 3.0 | 3.0 | — | — |
| Combustível | Óleo diesel | L | 0.45 | 0.45 | 0.45 | — | — |
| Água | Água da rede | L | 260 | 273 | 273 | — | — |
| **SAÍDAS** | | | | | | | |
| Resíduos | Resíduo inerte | kg | 46 | 46 | 46 | Truck 3E | 60 |
| CO₂ (emissão) | CO₂ (diesel) | t | 1.03 | 1.03 | 1.03 | — | — |
| Efluente | Efluente | m³ | 0.08 | 0.08 | 0.08 | — | — |
| **PRODUTOS** | Concreto | m³ | 1 | 1 | 1 | — | — |

### Tabela 8 — Fatores de emissão de CO₂

| Item | Fator min. | Fator max. | Unid. | Fonte |
|---|---|---|---|---|
| **Matérias-primas** | | | | |
| Cimento CP II F | 750 | 750 | kg CO₂/t | DAP |
| Areia | 0* | 0.01023 | kg CO₂/kg | Sidac |
| Brita | 0* | 0.01603 | kg CO₂/kg | Sidac |
| Aditivo redutor de água | — | Indisponível | — | — |
| **Energia** | | | | |
| Eletricidade rede pública | 0.07 | 0.07 | kg CO₂/kWh | Sidac |
| **Transporte** | | | | |
| Caminhão toco (2 eixos) | 0.0178 | 0.0178 | kg CO₂/t.km | Sidac |
| Caminhão truck (3 eixos) | 0.0601 | 0.0601 | kg CO₂/t.km | Sidac |
| Caminhão carreta (5 eixos) | 0.0691 | 0.0691 | kg CO₂/t.km | Sidac |

*Na realidade, é improvável produzir areia e brita com um fator de emissão de CO₂ igual a zero, pois ainda que o consumo unitário de energia desses materiais sejam baixos (comparados à produção de cimento), os equipamentos de mineração são usualmente movidos a combustível fóssil.*

### Quantidades de transporte (t.km)

Exemplo para cimento no concreto 25 MPa:
```
q_cim,c25 × m/1000 × d_t = 300 × 1/1000 × 700 = 210 t.km
```

### Tabela 9 — Quantidades de transporte

| Entrada/saída | 25 MPa | 30 MPa | 35 MPa | Modo | Dist. (km) |
|---|---|---|---|---|---|
| Cimento | 210 | 245 | 270 | Carreta 5E | 700 |
| Areia | 240 | 233 | 225 | Truck 3E | 300 |
| Brita | 176 | 168 | 164 | Truck 3E | 160 |
| Aditivo | 0.30 | 0.40 | 0.50 | Toco 2E | 200 |
| Resíduo | 2.77 | 2.77 | 2.77 | Truck 3E | 60 |

### Critério de corte para o aditivo

O aditivo representa entre 0.06% e 0.11% da massa do concreto, portanto pelo critério de corte de massa, ele poderia ser omitido da análise. Porém, deve-se verificar se sua emissão de CO₂ representaria menos de 1% da emissão total de CO₂ do concreto.

#### Tabela 12 — Fatores de emissão máximos do aditivo

| Parâmetro | Unidade | 25 MPa | 30 MPa | 35 MPa |
|---|---|---|---|---|
| C_min (concreto) | kg CO₂/m³ | 268 | 306 | 333 |
| q_aditivo | kg/m³ | 1.5 | 2.0 | 2.5 |
| e_aditivo,max | kg CO₂/kg | 1.79 | 1.53 | 1.33 |

Se o aditivo tiver um fator de emissão de até 1.33 kg CO₂/kg aditivo, ele se enquadra no critério de corte e pode ser omitido. De acordo com a DAP da EFCA para plastificantes e superplastificantes, o GWP fóssil deste tipo de aditivo é 1.50 kg CO₂/kg. Ou seja, com base nesses valores, seria incorreto omitir o aditivo do cálculo da pegada de CO₂ para o concreto de 35 MPa.

## 12.1.6. Interpretação dos resultados

### Resultados finais (Tabelas 10, 11, 12)

| Componente | 25 MPa | 30 MPa | 35 MPa | Unidade |
|---|---|---|---|---|
| **Emissão matérias-primas (min.)** | ~225 | ~263 | ~289 | kg CO₂/m³ |
| **Emissão matérias-primas (max.)** | ~228 | ~268 | ~295 | kg CO₂/m³ |
| **Emissão transporte** | ~3 | ~3 | ~3 | kg CO₂/m³ |
| **Emissão total (min.)** | ~265 | ~306 | ~333 | kg CO₂/m³ |
| **Emissão total (max.)** | ~285 | ~332 | ~347 | kg CO₂/m³ |

### Comparação com Sidac

> **Figura 9:** Os resultados dos concretos da central estudada estão próximos ao limite superior das faixas de valores de concretos equivalentes disponíveis no Sidac. Sendo assim, há espaço para melhorar o desempenho ambiental destes concretos.

### Análise de contribuição (hotspot)

> **Figura 10:** A principal contribuição para as emissões de CO₂ dos concretos analisados neste exemplo é a **produção de cimento**, que responde por uma parcela entre 80% e 83% das emissões totais. A produção dos agregados contribui com algo entre 4% e 8% das emissões. Já o transporte das matérias-primas e dos resíduos contribuiu conjuntamente com 12% a 15%. As emissões associadas à geração de energia elétrica apresentam uma contribuição irrisória (inferior a 0.1%), ao passo que as emissões devidas à combustão de diesel na central representam entre 0.3% e 0.4% das emissões de CO₂ do berço ao portão.

### Ações prioritárias identificadas

A ação prioritária para reduzir as emissões incorporadas de CO₂ nos concretos analisados neste exemplo hipotético consiste em **reduzir as emissões associadas ao consumo de cimento**, seja otimizando a dosagem do concreto, seja buscando um fornecedor de cimento que tenha uma emissão de CO₂ menor, ou ambas conjuntamente. Isto ilustra como a quantificação das emissões de CO₂ com base na abordagem do ciclo de vida pode apoiar decisões de tecnologia do concreto para desmaterializar o material, mantendo o seu desempenho.

*(p. 45-56 do documento)*
