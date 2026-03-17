# Índice por Intenção do Agente

> Use esta tabela como primeiro ponto de entrada. Encontre a intenção mais próxima e siga o caminho indicado.

## Intenções de Compreensão

| Quando o agente quer... | Ler primeiro | Depois |
|---|---|---|
| Entender o método CT 101 do zero | L3: CO2_EMISSIONS_OVERVIEW | L1 fundamentals |
| Saber quais módulos do ciclo de vida existem | CT101_LCA_LIFECYCLE_MODULES | CT101_LCA_FUNCTIONAL_UNIT |
| Entender como calcular emissão de CO₂ | CT101_LCA_FUNDAMENTAL_EQUATION | CT101_PRODUCT_STAGE_A1A3 |
| Saber os fatores de emissão de combustíveis | CT101_FUEL_EMISSION_FACTORS | CT101_COMBUSTION_EMISSION |
| Saber os fatores de carbonatos | CT101_CARBONATE_EMISSION_FACTORS | CT101_CALCINATION_EMISSION |
| Entender como funciona o transporte | CT101_TRANSPORT_FORMULA | CT101_TRANSPORT_EMISSION_FACTORS |
| Entender o escopo mínimo | CT101_LCA_LIFECYCLE_MODULES → seção "Escopo Mínimo" | — |
| Entender critérios de corte | CT101_CUTOFF_CRITERIA | — |
| Entender como lidar com incertezas | CT101_UNCERTAINTY_RANGE | CT101_UNCERTAINTY_TAYLOR |

## Intenções de Implementação

| Quando o agente quer... | Ir direto para | Verificar também |
|---|---|---|
| Implementar cálculo A1-A3 para materiais | L4: CT101_CO2_PRODUCT_STAGE_RECIPE | CT101_PRODUCT_STAGE_A1A3 |
| Implementar cálculo A1-A5 para estruturas | L4: CT101_CO2_FULL_LIFECYCLE_RECIPE | CT101_CONSTRUCTION_A5 |
| Implementar cálculo de transporte | CT101_TRANSPORT_FORMULA | CT101_TRANSPORT_EMISSION_FACTORS |
| Implementar propagação de incertezas | CT101_UNCERTAINTY_TAYLOR | CT101_UNCERTAINTY_RANGE |
| Implementar substituições B4 | CT101_REPLACEMENT_B4 | CT101_REPLACEMENT_COUNT |
| Implementar fim de vida C1-C4 | CT101_END_OF_LIFE_C1C4 | — |
| Encontrar valores numéricos de referência | CT101_PRODUCT_STAGE_A1A3 → "Valores de referência" | Exemplos CT 101 (docs/) |

## Intenções de Diagnóstico

| Quando o agente quer... | Consultar |
|---|---|
| Verificar se uma equação está correta | L1 chunk da equação → seção "Formulação" |
| Verificar unidades | L1 chunk → tabela de símbolos |
| Verificar se pode omitir um item do inventário | CT101_CUTOFF_CRITERIA |
| Entender por que resultado está errado | L1 chunk → "Restrições Explícitas" + "Armadilhas" |
| Verificar se fatores de emissão estão atualizados | CT101_FUEL_EMISSION_FACTORS ou CT101_CARBONATE_EMISSION_FACTORS |
| Conferir exemplos numéricos | CT101_PRODUCT_STAGE_A1A3 → "Valores de referência" |
