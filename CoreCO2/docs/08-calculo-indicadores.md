# 9. Cálculo dos Indicadores

*(Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101)*

## 9.1. Emissão de CO₂

O cálculo da emissão de CO₂ incorporada em um produto (material ou estrutura) pode ser resumido como a multiplicação da quantidade unitarizada (e alocada) de cada item do inventário de ciclo de vida do produto pelos respectivos fatores de emissão de CO₂.

### Equação fundamental (Equação 5)

```
C_j = Σ (q_i,j × e_i)
```

Onde:
- **C_j:** emissão de CO₂ de um produto "j" (kg CO₂/UF)
- **q_i,j:** quantidade unitária do item "i" alocada ao produto "j" (UD/UF)
- **e_i:** fator de emissão de CO₂ do item "i" (kg CO₂/UD)

### Categorias de fatores de emissão de CO₂ (Equação 6)

Os fatores de emissão se diferenciam entre:

**Emissões diretas de CO₂ devidas a:**
- Queima de combustíveis fósseis no sistema de produto (C_cf)
- Decomposição de carbonatos no sistema de produto (C_calc)
- Queima ou decomposição de biomassa não renovável no sistema de produto (C_biomassa,nr)

**Emissões indiretas de CO₂ devidas a:**
- Emissões incorporadas aos materiais processados (C_mp), em função dos processos a montante necessários à fabricação destes materiais
- Emissões incorporadas à energia elétrica (C_elet), em função dos processos necessários à geração da eletricidade (conforme a fonte)
- Emissões associadas à disposição final dos resíduos (C_res), em função dos processos a jusante necessários para tal disposição
- Emissões associadas ao transporte (C_transp), seja de materiais, combustíveis ou resíduos

### 9.1.1. Fatores de emissão de CO₂

#### Tabela 2 — Fatores de emissão de CO₂ para combustíveis fósseis

| Combustível | Fator de emissão de CO₂ | Unidade |
|---|---|---|
| Álcool etílico hidratado | 0* | kg CO₂/L |
| Carvão mineral | 2.28 | kg CO₂/kg |
| Carvão vegetal não renovável | 3.03 | kg CO₂/kg |
| Carvão vegetal renovável | 0* | kg CO₂/kg |
| Coque de carvão mineral | 2.73 | kg CO₂/kg |
| Coque de petróleo | 3.42 | kg CO₂/kg |
| Gás liquefeito de petróleo (GLP) | 2.93 | kg CO₂/kg |
| Gás natural | 2.74 | kg CO₂/m³ |
| Gasolina automotiva | 1.61 | kg CO₂/L |
| Lenha não renovável* | 366 | kg CO₂/st** |
| Lenha renovável | 0* | kg CO₂/st |
| Óleo combustível | 3.11 | kg CO₂/L |
| Óleo diesel | 2.29 | kg CO₂/L |
| Resíduos de madeira renovável | 0* | kg CO₂/kg |
| Resíduos de óleo | 3.11 | kg CO₂/kg |
| Resíduo de pneu | 3.14 | kg CO₂/kg |
| Resíduo plástico | 1.98 | kg CO₂/kg |

*Estes combustíveis apresentam emissão de CO₂ iguais a zero pois são constituídos de biomassa renovável.*
*st = metro cúbico estéreo.*

#### Tabela 3 — Fatores de emissão de CO₂ para calcinação de carbonatos

| Fórmula molecular | Nome do mineral | Fator de emissão (kg CO₂/kg carbonato) |
|---|---|---|
| CaCO₃ | Calcita | 0.44 |
| MgCO₃ | Magnesita | 0.52 |
| CaMg(CO₃)₂ | Dolomita | 0.48 |
| FeCO₃ | Siderita | 0.38 |
| Ca(Fe,Mg,Mn)(CO₃)₂ | Ankerita | 0.41-0.48 |
| MnCO₃ | Rodocrosita | 0.38 |
| Na₂CO₃ | Carbonato de sódio | 0.41 |

#### Queima de combustíveis fósseis (Equação 7)

```
C_comb = Σ (q_comb,i × e_comb,i)
```

#### Decomposição de carbonatos (Equação 8)

```
C_calc = q_calc × e_calc
```

#### Queima/decomposição de biomassa não renovável (Equação 9)

```
C_biomassa = biomassa_seca × 0.5 × 44/12
```

Onde:
- 0,5: 50% da biomassa seca é carbono
- 44/12: relação entre a massa molecular do CO₂ (44) e a massa atômica do carbono (12)

#### Emissões de transporte (Equação 10)

```
C_t = Σ (q_i × m_i/1000 × d_t,i × e_t,i)
```

Onde:
- **q_i:** quantidade unitária do item "i" a ser transportado (UD/UF)
- **m_i:** fator de conversão em massa do item "i" (kg/UD)
- **d_t,i:** distância de transporte do item "i" (km)
- **e_t,i:** fator de emissão de CO₂ do modo de transporte adotado para o item "i" (kg CO₂/t.km)

### Tipos de dados para fatores de emissão (Quadro 4)

| Tipo de processo | Genéricos | Específicos (DAPs) |
|---|---|---|
| **Processos de primeiro plano (foreground)** | | |
| - Produção de materiais processados (e_mp) | X | (X) |
| **Processos de segundo plano (background)** | | |
| - Geração de energia elétrica da rede (e_elet) | X | (X) |
| - Processos de transporte (e_transp) | X | |
| - Disposição de resíduos (e_res) | X | |
| **Reações químicas** | | |
| - Queima de combustíveis fósseis (e_comb) | X | (X) |
| - Decomposição de carbonatos (e_calc) | X | |
| - Queima/decomposição de biomassa não renovável (e_biomassa) | X | |

*X: aplicável. (X): possível.*

> **Importante sobre DAPs:** Quando se utilizam dados específicos (DAPs), não é obrigatório considerar a incerteza do fator de emissão, já que este não será afetado por fontes de incerteza a montante. DAPs normalmente comunicam o GWP, que considera os diferentes gases de efeito estufa e não apenas o CO₂. Caso se opte por utilizar dados de DAP, recomenda-se adotar o GWP fóssil como sendo igual à emissão de CO₂ (ou seja, kg CO₂ equivalente ≈ kg CO₂). Trata-se de uma estimativa conservadora, uma vez que o GWP fóssil sempre será igual ou maior do que apenas a emissão de CO₂.

### 9.1.2. Remoções de CO₂

Ao longo do ciclo de vida de produtos cimentícios e estruturas de concreto, também podem ocorrer **remoções de CO₂**, por exemplo, através da **carbonatação** (natural ou forçada) de materiais cimentícios. Considerando que tal remoção se dá em caráter praticamente permanente, a quantidade de CO₂ absorvida por carbonatação (C_carb) pode ser subtraída das emissões totais de CO₂ (Equação 11):

```
C = C − C_carb     (Equação 11)
```

No caso da carbonatação natural, é necessário quantificar a quantidade de CO₂ absorvida diretamente da atmosfera. No caso de carbonatação forçada utilizando CO₂ industrial, o CO₂ deve ser considerado como material (entrada), que também terá um fator de emissão de CO₂ associado a ele.

> **Nota:** Este documento não considera a compensação de emissões de carbono (*carbon offset*), uma vez que atividades de compensação (por exemplo, reflorestamento) ocorrem fora do sistema de produto em análise.

### 9.1.3. Desdobramento por estágio do ciclo de vida

O indicador de emissão de CO₂ deve ser desdobrado por etapa do ciclo de vida do produto ou do edifício.

#### 9.1.3.1. Estágio de produto (A1-A3)

Normalmente, o estágio de produto é declarado de forma conjunta (módulos A1, A2 e A3 somados). Sob a perspectiva de um fabricante de material de construção, a emissão de CO₂ referente ao estágio de produto pode ser calculada de acordo com as equações a seguir:

```
C_A1-A3 = C_mp(A1-A3) + C_elet,A3 + C_cf,A3 + C_calc,A3 + C_biomassa,A3
          + C_transp(A1-A3) + C_perdas(A1-A3) + C_res(A1-A3)     (Equação 12)
```

**Componentes principais:**

| Equação | Componente | Descrição |
|---------|-----------|-----------|
| Eq. 13 | C_mp(A1-A3) | Emissão dos materiais processados: `Σ(q_mp(i,A3) × e_mp(i,a))` |
| Eq. 14 | C_transp(A1-A3) | Emissão do transporte de insumos: `Σ(q_i,A3 × m_i/1000 × d_t,i × e_t,i)` |
| Eq. 15 | C_elet,A3 | Emissão da eletricidade: `q_elet,A3 × e_elet` |
| Eq. 16 | C_comb,A3 | Emissão dos combustíveis: `Σ(q_comb(i,A3) × e_comb,i)` |
| Eq. 17 | C_calc,A3 | Emissão da calcinação: `Σ(q_carb(i,A3) × e_calc,i)` |
| Eq. 18 | C_transp,res(A1-A3) | Transporte de resíduos: `Σ(q_res(i,A3) × m_i/1000 × d_t,i × e_t,i)` |
| Eq. 19 | C_res(A1-A3) | Disposição de resíduos: `Σ(q_res(i,A3) × e_res(i,C3-C4))` |

Para estruturas, o cálculo é mais simples, pois o estágio de produto diz respeito apenas à produção dos materiais necessários à construção da edificação, sem considerar eventuais perdas que ocorram durante a obra:

```
C_(A1-A3) = C_total = Σ (q^p_mp(i) × e_mp(i,A1-A3))     (Equação 20)
```

Onde:
- **q^p_mp(i):** quantidade unitária do material processado "i" consumida na estrutura, **sem perdas**, conforme especificação de projeto (UD/UF)
- **e_mp(i,A1-A3):** fator de emissão de CO₂ do material processado, do berço ao portão da fábrica (kg CO₂/UD)

#### 9.1.3.2. Estágio do processo construtivo (A4-A5)

Para estruturas, o estágio do processo construtivo é declarado separadamente nas etapas A4 (transporte dos insumos até a obra) e A5 (construção).

```
C_A4 = C_t = Σ (q'_i × m_i/1000 × d_t,i × e_t,i)     (Equação 21)
```

Onde **q'_i** representa a quantidade do insumo transportado, **sem perdas** (ou podendo ser aproximado por q^p_mp(i)).

```
C_A5 = C_elet,A5 + C_comb,A5 + C_perdas,A5     (Equação 22)
```

Onde:
- **C_A5:** emissão de CO₂ da estrutura referente ao processo construtivo (kg CO₂/UF)
- **C_elet,A5:** emissão de CO₂ referente ao consumo de energia elétrica no processo construtivo (kg CO₂/UF)
- **C_comb,A5:** emissão de CO₂ associada aos combustíveis utilizados no processo construtivo (kg CO₂/UF)
- **C_perdas,A5:** emissão de CO₂ associada às perdas de material no processo construtivo (kg CO₂/UF)

```
C_elet,A5 = q_elet,A5 × e_elet     (Equação 23)
```

```
C_comb,A5 = Σ (q_comb(i,A5) × e_comb,i)     (Equação 24)
```

```
C_perdas,A5 = C_A1-A3,desp + C_A4,desp + C_A5,res + C_A5,res,recicl     (Equação 25)
```

Componentes detalhados das perdas:

```
C_A1-A3,desp = Σ (q^d_mp(i,A5) × e_mp(i,A1-A3))     (Equação 26)
```

```
C_A4,desp = Σ (q^d_mp(i,A5) × m_i/1000 × d_t,i × e_t,i)     (Equação 27)
```

```
C_A5,res = Σ (q_res(i,A5) × m_i/1000 × d_r,i × e_t,i)     (Equação 28)
```

```
C_A5,res,recicl = Σ (q_res(i,A5) × e_res(i,C3-C4))     (Equação 29)
```

Onde:
- **q^d_mp(i,A5):** quantidade unitária do material processado "i" desperdiçada no processo construtivo (UD/UF)
- **e_mp(i,A1-A3):** fator de emissão de CO₂ do material processado, do berço ao portão da fábrica (kg CO₂/UD)
- **C_A1-A3,desp:** emissão de CO₂ associada à fabricação dos materiais desperdiçados no processo construtivo (kg CO₂/UF)
- **C_A4,desp:** emissão de CO₂ associada ao transporte dos materiais desperdiçados no processo construtivo (kg CO₂/UF)
- **C_A5,res:** emissão de CO₂ associada ao transporte dos resíduos decorrentes de materiais desperdiçados no processo construtivo até seu local de disposição final (kg CO₂/UF)
- **q_res(i,A5):** quantidade unitária do resíduo "i" gerada no processo construtivo (UD/UF)
- **d_r,i:** distância de transporte do resíduo "i" até seu local de destinação (km)
- **C_A5,res,recicl:** emissão de CO₂ associada ao processamento para reciclagem e/ou disposição final dos resíduos decorrentes de materiais desperdiçados no processo construtivo (kg CO₂/UF)
- **e_res(i,C3-C4):** fator de emissão de CO₂ referente à disposição do resíduo "i" (kg CO₂/UD)

#### 9.1.3.3. Estágio de uso (B1-B5)

Embora não faça parte do escopo mínimo, seguem orientações sobre como calcular os indicadores referentes à etapa B4 (substituição de produtos com vida útil inferior ao período de referência da análise):

```
C_B4 = C_B4(A1-A3) + C_B4,A4 + C_B4,C2 + C_B4,C3-C4     (Equação 30)
```

Componentes detalhados:

```
C_B4(A1-A3) = Σ (q_mp(i,B4) × e_mp(i,A1-A3))     (Equação 31)
```

```
C_B4,A4 = Σ (q_mp(i,B4) × m_i/1000 × d_t,i × e_t,i)     (Equação 32)
```

```
C_B4,C2 = Σ (q_res(i,B4) × m_i/1000 × d_r,i × e_t,i)     (Equação 33)
```

```
C_B4,C3-C4 = Σ (q_res(i,B4) × e_res(i,C3-C4))     (Equação 34)
```

Onde:
- **C_B4:** emissão de CO₂ da estrutura referente à substituição de materiais cuja vida útil é inferior ao período de referência, em relação à unidade funcional (kg CO₂/UF)
- **C_B4(A1-A3):** emissão de CO₂ da estrutura referente à produção dos novos materiais necessários para as substituições ao longo do ciclo de vida (kg CO₂/UF)
- **q_mp(i,B4):** quantidade do material processado "i" para substituição, incluindo eventuais perdas (UD/UF)
- **C_B4,A4:** emissão de CO₂ da estrutura referente ao transporte dos materiais necessários para as substituições ao longo do ciclo de vida (kg CO₂/UF)
- **C_B4,C2:** emissão de CO₂ da estrutura referente ao transporte dos resíduos sólidos gerados nas substituições ao longo do ciclo de vida, até sua respectiva destinação final (kg CO₂/UF)
- **q_res(i,B4):** quantidade do resíduo sólido "i" gerada no processo de substituição (UD/UF)
- **C_B4,C3-C4:** emissão de CO₂ da estrutura referente à disposição final dos resíduos sólidos gerados nas substituições ao longo do ciclo de vida (kg CO₂/UF)

A quantidade de cada material "i" que será necessária para as operações de substituição ao longo do período de referência pode ser calculada de acordo com a Equação 1, ou de alguma outra forma que leve a uma estimativa razoável e coerente com a realidade.

#### 9.1.3.4. Estágio de fim de vida (C1-C4)

Embora também não faça parte do escopo mínimo, a seguir, são dadas orientações sobre como calcular os indicadores referentes às etapas C1, C2, C3 e C4.

```
C_f = C_C1 + C_C2 + C_C3 + C_C4     (Equação 35)
```

Componentes detalhados:

```
C_C1 = C_elet,C1 + C_comb,C1     (Equação 36)
```

```
C_elet,C1 = q_elet,C1 × e_elet     (Equação 36*)
```

```
C_comb,C1 = Σ (q_comb(i,C1) × e_comb,i)     (Equação 37)
```

```
C_C2 = Σ (q_res(i,C1→C4) × m_i/1000 × d_r,i × e_t,i)     (Equação 38)
```

```
C_C3 = Σ (q_res,demol(i) × e_recicl(i))     (Equação 39)
```

```
C_C4 = Σ (q_res,demol(i,C4) × e_res(i,C4))     (Equação 40)
```

Onde:
- **C_f:** emissão de CO₂ total do estágio de fim de vida (kg CO₂/UF)
- **C_C1:** emissão de CO₂ referente ao processo de desconstrução/demolição da estrutura (kg CO₂/UF)
- **C_elet,C1:** emissão de CO₂ devida ao consumo de energia elétrica pelos equipamentos utilizados na etapa de demolição da estrutura (kg CO₂/UF)
  - q_elet,C1: quantidade de energia elétrica consumida no processo de demolição (kWh/UF)
- **C_comb,C1:** emissão de CO₂ devida ao consumo de combustível pelos equipamentos utilizados na etapa de demolição da estrutura (kg CO₂/UF)
  - q_comb(i,C1): quantidade do combustível "i" consumida no processo de demolição (UD/UF)
- **C_C2:** emissão de CO₂ referente ao transporte dos resíduos de demolição até sua destinação (kg CO₂/UF)
  - q_res(i,C1→C4): quantidade do resíduo sólido "i" gerada no processo de desconstrução/demolição da estrutura (UD/UF)
  - d_r,i: distância de transporte do resíduo "i" até seu local de destinação (km)
- **C_C3:** emissão de CO₂ referente ao processamento dos resíduos sólidos da demolição, antes de sua destinação ao reuso/reciclagem ou aterro (kg CO₂/UF)
  - q_res,demol(i): quantidade do resíduo sólido "i" destinada ao processamento para reuso/reciclagem (UD/UF)
  - e_recicl(i): fator de emissão de CO₂ relativo ao processamento dos resíduos sólidos para reuso/reciclagem (kg CO₂/UD)
- **C_C4:** emissão de CO₂ referente ao processo de disposição final dos resíduos gerados na demolição da estrutura (kg CO₂/UF)
  - q_res,demol(i,C4): quantidade do resíduo sólido "i" destinada ao processo de disposição final dos resíduos gerados na demolição (UD/UF)
  - e_res(i,C4): fator de emissão de CO₂ relativo ao processo de disposição final (kg CO₂/UD)

### 9.1.4. Consideração de incertezas

Os fatores utilizados no cálculo da emissão de CO₂ podem ter incertezas. Recomenda-se que o cálculo da emissão de CO₂ leve em consideração as incertezas.

A forma mais simples de considerar as incertezas é calcular a **faixa de valores**, considerando a variação máxima de cada parâmetro do cálculo:

```
C_min = Σ (q_i,min × e_i,min)     (Equação 41)
C_max = Σ (q_i,max × e_i,max)     (Equação 42)
```

Onde:
- **C_min / C_max:** emissão de CO₂ mínima / máxima de um material ou estrutura (kg CO₂/UF)
- **q_i,min / q_i,max:** quantidade mínima / máxima do item "i" (UD/UF)
- **e_i,min / e_i,max:** fator de emissão de CO₂ mínimo / máximo do item "i" (kg CO₂/UD)

Caso se utilizem dados específicos (DAPs), não é obrigatório considerar a incerteza do fator de emissão. O procedimento implica a realização de pelo menos dois cálculos para o produto ou edifício em questão. Caso, por razões práticas, isso não seja possível, recomenda-se que o cálculo seja feito com os valores máximos de quantidades e fatores de emissão, de modo a se ter uma estimativa conservadora da emissão de CO₂ (deste modo, eventuais refinamentos tenderão a reduzir, e não a aumentar, o indicador de emissão de CO₂).

> O Anexo B descreve outras formas de propagação de incertezas para o cálculo das emissões de CO₂.

## 9.2. Consumo de material (estruturas)

Além do indicador de emissão de CO₂, recomenda-se que seja calculado o indicador de **consumo de material** para estruturas. A análise conjunta dos dois indicadores permite avaliar a consistência dos resultados, além de criar valores de referência para subsidiar decisões voltadas à desmaterialização de estruturas.

```
M = Σ (q_i × m_i)     (Equação 43)
```

Onde:
- **M:** consumo de material de uma estrutura (kg/UF)
- **q_i:** quantidade unitária do item "i" (UD/UF), sendo que o item deve ser um recurso material ou material processado, sem perdas
- **m_i:** fator de conversão em massa do item "i" (kg/UD)

Para o cálculo deste indicador, as quantidades de cada material contido na estrutura (q_i) devem sempre considerar a alocação por massa; do contrário, poderia se chegar a um indicador que não reflete a composição em massa da estrutura.

*(p. 28-41 do documento)*
