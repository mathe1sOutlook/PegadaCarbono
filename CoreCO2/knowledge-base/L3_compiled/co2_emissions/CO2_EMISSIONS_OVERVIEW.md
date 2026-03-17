---
id: "CO2_EMISSIONS_OVERVIEW"
type: overview
domain: ["co2_emissions"]
chunks_included:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_LCA_LIFECYCLE_MODULES"
  - "CT101_LCA_FUNCTIONAL_UNIT"
  - "CT101_REPLACEMENT_COUNT"
  - "CT101_INVENTORY_UNITIZATION"
  - "CT101_ALLOCATION"
  - "CT101_CUTOFF_CRITERIA"
  - "CT101_CARBONATION_REMOVAL"
  - "CT101_MATERIAL_CONSUMPTION"
  - "CT101_FUEL_EMISSION_FACTORS"
  - "CT101_CARBONATE_EMISSION_FACTORS"
  - "CT101_TRANSPORT_EMISSION_FACTORS"
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_CALCINATION_EMISSION"
  - "CT101_BIOMASS_EMISSION"
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_TRANSPORT_A4"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_REPLACEMENT_B4"
  - "CT101_END_OF_LIFE_C1C4"
  - "CT101_A1A2A3_SPLIT"
  - "CT101_UNCERTAINTY_RANGE"
  - "CT101_UNCERTAINTY_TAYLOR"
recipes_available:
  - "CT101_CO2_PRODUCT_STAGE_RECIPE"
  - "CT101_CO2_FULL_LIFECYCLE_RECIPE"
status: verified
last_updated: "2025-03-05"
---

# Visao Geral: Emissoes de CO2 em Materiais Cimenticios e Estruturas de Concreto

## O que e este topico

O Boletim Tecnico CT 101 (IBRACON/ABECE/ABCIC, 2024) apresenta um metodo harmonizado para quantificar as emissoes de CO2 incorporadas (*embodied carbon*) em materiais cimenticios e estruturas de concreto no contexto brasileiro. O metodo e baseado na Avaliacao do Ciclo de Vida (ACV) simplificada, focando apenas no CO2 (responsavel por >90% do GWP de materiais de construcao).

**Diferenca da ACV convencional:** Este metodo calcula apenas emissoes de CO2 (nao CO2 equivalente/GWP completo), usando dados primarios verificaveis.

## Mapa do Topico

```
[Unidade Funcional/Declarada]
    |
    +---> [Inventario: Unitarizacao (Eq.2) + Alocacao (Eq.3-4)]
    |        |
    |        +---> [Criterios de Corte]
    |
    +---> [Equacao Fundamental: C = Soma(q x e)]  (Eq.5)
    |        |
    |        +---> [Fatores de Emissao]
    |        |      +-- Combustiveis Fosseis (Tab.2, Eq.7)
    |        |      +-- Carbonatos (Tab.3, Eq.8)
    |        |      +-- Biomassa (Eq.9)
    |        |      +-- Transporte (Eq.10)
    |        |      +-- Eletricidade / Mat. Processados
    |        |
    |        +---> [Estagios do Ciclo de Vida]
    |        |      +-- A1-A3: Produto (Eq.12-20, Anexo A: Eq.44-55)
    |        |      +-- A4: Transporte (Eq.21)
    |        |      +-- A5: Construcao (Eq.22-29)
    |        |      +-- B4: Substituicao (Eq.30-34, usa Eq.1)
    |        |      +-- C1-C4: Fim de Vida (Eq.35-40)
    |        |
    |        +---> [Carbonatacao: Remocao] (Eq.11)
    |        |
    |        +---> [Incertezas]
    |               +-- Faixa Min-Max (Eq.41-42)
    |               +-- Taylor (Eq.57-58)
    |
    +---> [Consumo de Material] (Eq.43)
```

## Ordem de Estudo Recomendada

1. **CT101_LCA_FUNCTIONAL_UNIT** -- Base: o que e UF/UD
2. **CT101_LCA_LIFECYCLE_MODULES** -- Quais modulos existem (A1-D)
3. **CT101_INVENTORY_UNITIZATION** -- Como normalizar o inventario
4. **CT101_LCA_FUNDAMENTAL_EQUATION** -- A equacao central C = Soma(q x e)
5. **CT101_FUEL_EMISSION_FACTORS** -- Tabela 2: combustiveis
6. **CT101_CARBONATE_EMISSION_FACTORS** -- Tabela 3: carbonatos
7. **CT101_TRANSPORT_EMISSION_FACTORS** -- Fatores de transporte
8. **CT101_COMBUSTION_EMISSION** -- Eq. 7: combustao
9. **CT101_CALCINATION_EMISSION** -- Eq. 8: calcinacao
10. **CT101_BIOMASS_EMISSION** -- Eq. 9: biomassa
11. **CT101_TRANSPORT_FORMULA** -- Eq. 10: transporte
12. **CT101_PRODUCT_STAGE_A1A3** -- Eq. 12-20: estagio de produto
13. **CT101_TRANSPORT_A4** -- Eq. 21: transporte ate obra
14. **CT101_CONSTRUCTION_A5** -- Eq. 22-29: processo construtivo
15. **CT101_A1A2A3_SPLIT** -- Eq. 44-55: desdobramento A1/A2/A3
16. **CT101_REPLACEMENT_COUNT** -- Eq. 1: no. de reposicoes
17. **CT101_REPLACEMENT_B4** -- Eq. 30-34: substituicao
18. **CT101_END_OF_LIFE_C1C4** -- Eq. 35-40: fim de vida
19. **CT101_UNCERTAINTY_RANGE** -- Eq. 41-42: incerteza simples
20. **CT101_UNCERTAINTY_TAYLOR** -- Eq. 57-58: incerteza estatistica
21. **CT101_CUTOFF_CRITERIA** -- Criterios de corte
22. **CT101_CARBONATION_REMOVAL** -- Eq. 11: carbonatacao
23. **CT101_MATERIAL_CONSUMPTION** -- Eq. 43: consumo de material

## Sintese dos Conceitos

### Equacao Fundamental (Eq. 5)
A base de todo o metodo: multiplicar quantidades unitarizadas pelos fatores de emissao. Todas as equacoes dos estagios sao variacoes desta. Chunk: `CT101_LCA_FUNDAMENTAL_EQUATION`

### Fatores de Emissao
Tres tipos de dados tabelados: combustiveis fosseis (16 itens, Tabela 2), carbonatos (7 minerais, Tabela 3), e transporte (5 modos, Sidac). Eletricidade da rede = 0.07 kg CO2/kWh. Chunks: `CT101_FUEL_EMISSION_FACTORS`, `CT101_CARBONATE_EMISSION_FACTORS`, `CT101_TRANSPORT_EMISSION_FACTORS`

### Estagio de Produto A1-A3
Escopo minimo obrigatorio. Para fabricantes: Eq. 12-19 (detalhado). Para projetistas de estrutura: Eq. 20 (usando fator A1-A3 dos materiais). Chunk: `CT101_PRODUCT_STAGE_A1A3`

### Processo Construtivo A5
Inclui eletricidade + diesel + perdas de materiais + formas + residuos. Tipicamente 5-10% do total berco-a-obra. Chunk: `CT101_CONSTRUCTION_A5`

### Incertezas
Duas abordagens: faixa min-max (conservadora, facil) e propagacao de Taylor (realista, requer estimativa central). Chunks: `CT101_UNCERTAINTY_RANGE`, `CT101_UNCERTAINTY_TAYLOR`

## Decisoes Comuns no Dominio

| Situacao | Decisao | Ver chunk |
|---|---|---|
| Material ou estrutura? | Escopo minimo = A1-A3; estrutura: A1-A5 recomendado | CT101_LCA_LIFECYCLE_MODULES |
| Usar DAP ou dados genericos? | DAP = sem incerteza no fator; generico = com faixa | CT101_PRODUCT_STAGE_A1A3 |
| Posso omitir o aditivo? | Verificar criterio de corte por EMISSAO, nao so massa | CT101_CUTOFF_CRITERIA |
| Combustivel renovavel? | Fator = 0, mas incluir no inventario | CT101_FUEL_EMISSION_FACTORS |
| Como calcular transporte? | Eq. 10: atencao a divisao por 1000 (kg para t) | CT101_TRANSPORT_FORMULA |

## Armadilhas Globais do Topico

- **Unidades inconsistentes:** Gas natural em m3, diesel em L, carvao em kg, lenha em st -> SEMPRE verificar
- **Esquecer a divisao por 1000** na formula de transporte (converter kg para toneladas)
- **Confundir perspectivas:** Eq. 12-19 (fabricante) vs. Eq. 20 (projetista de estrutura)
- **Perdas no modulo errado:** Sem perdas em A1-A3, com perdas em A5
- **Excluir itens com alto fator de emissao** pelo criterio de massa (ex: aditivos)
- **Somar modulo D com A1-C4:** D e reportado separadamente
- **Confundir emissoes incorporadas com operacionais** (B6/B7)
- **DAP informa GWP, nao CO2:** GWP fossil ~= CO2 (conservador, aceito pelo CT 101)
- **Distancia de transporte ida + volta** se veiculo retorna vazio

## Valores de Referencia (Benchmarks do CT 101)

### Concreto dosado em central (A1-A3, berco ao portao)
| Concreto | Emissao min (kg CO2/m3) | Emissao max (kg CO2/m3) |
|---|---|---|
| 25 MPa | ~265 | ~285 |
| 30 MPa | ~306 | ~332 |
| 35 MPa | ~333 | ~347 |

### Estrutura de concreto armado (A1-A5, berco a obra)
| Indicador | Valor |
|---|---|
| Emissao total | 70-111 kg CO2/m2 |
| Consumo de material | 591 kg/m2 |
| Contribuicao A1-A3 | ~91% |
| Contribuicao transporte | ~1% |
| Contribuicao A5 (obra) | ~8% |

### Contribuicao por material (estrutura)
| Material | % da massa | % do CO2 |
|---|---|---|
| Concreto | 96% | 77% |
| Aco | 3% | 18% |
| Madeira/transporte | 1% | 5% |

## Recipes Disponiveis

| Recipe | Implementa | Linguagem | Status |
|---|---|---|---|
| CT101_CO2_PRODUCT_STAGE_RECIPE | Eq. 5, 7-20, 41-42, 43, 57-58 | C# | verified |
| CT101_CO2_FULL_LIFECYCLE_RECIPE | Eq. 1, 21-40 (A4, A5, B4, C1-C4) | C# | verified |
