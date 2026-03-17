---
id: "CT101_CO2_PRODUCT_STAGE_RECIPE"
type: recipe
language: csharp
framework: net9
implements:
  - "CT101_LCA_FUNDAMENTAL_EQUATION"
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_CALCINATION_EMISSION"
  - "CT101_BIOMASS_EMISSION"
  - "CT101_TRANSPORT_FORMULA"
  - "CT101_UNCERTAINTY_RANGE"
  - "CT101_UNCERTAINTY_TAYLOR"
  - "CT101_MATERIAL_CONSUMPTION"
  - "CT101_CARBONATION_REMOVAL"
  - "CT101_A1A2A3_SPLIT"
depends_on_recipes: []
status: verified
tested: true
last_updated: "2025-03-05"
---

# Recipe: Calculo de Emissoes A1-A3 (Estagio de Produto)

## Proposito
> Calcula as emissoes de CO2 incorporadas no estagio de produto (berco ao portao), com desdobramento A1/A2/A3 conforme Anexo A do CT 101.

**Usar quando:** Quantificar emissoes de materiais cimenticios ou do estagio de produto de estruturas.
**Nao usar quando:** Calculos incluem estagios alem de A3 -> usar `CT101_CO2_FULL_LIFECYCLE_RECIPE`.

## Conceitos Implementados
- `CT101_LCA_FUNDAMENTAL_EQUATION` -- Metodo `CalculateSimpleEmission` (Eq. 5)
- `CT101_COMBUSTION_EMISSION` -- Metodo `CalculateCombustionEmission` (Eq. 7)
- `CT101_CALCINATION_EMISSION` -- Metodo `CalculateCalcinationEmission` (Eq. 8)
- `CT101_BIOMASS_EMISSION` -- Metodo `CalculateBiomassEmission` (Eq. 9)
- `CT101_TRANSPORT_FORMULA` -- Metodo `CalculateTransportEmission` (Eq. 10)
- `CT101_CARBONATION_REMOVAL` -- Campo `CarbonationRemoval` no `Inventory` (Eq. 11)
- `CT101_PRODUCT_STAGE_A1A3` -- Metodo `CalculateProductStage` (Eq. 12-20)
- `CT101_A1A2A3_SPLIT` -- Desdobramento dentro de `CalculateProductStage` (Eq. 44-55)
- `CT101_UNCERTAINTY_RANGE` -- Campos `TotalMin`/`TotalMax` no resultado (Eq. 41-42)
- `CT101_UNCERTAINTY_TAYLOR` -- Metodo `PropagateUncertainty` (Eq. 57-58)
- `CT101_MATERIAL_CONSUMPTION` -- Campo `MaterialConsumption` no resultado (Eq. 43)

## Contrato de Interface

### Inputs -- Inventory

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| ProductName | string | Sim | Ex.: "Concreto 30 MPa" |
| FunctionalUnit | string | Sim | Ex.: "1 m3 de concreto" |
| Entries | List<InventoryEntry> | Sim | Entradas, saidas e produtos do inventario |
| EmissionFactors | Dict<string, EmissionFactor> | Sim | Fator por item (chave = ItemName) |
| LossRatio | decimal | Nao | Indice de perdas (ex.: 0.02 = 2%). Default 0 |
| DirectEmission | decimal | Nao | Emissao direta em kg CO2/UF. Default 0 |
| CarbonationRemoval | decimal | Nao | Remocao por carbonatacao em kg CO2/UF. Default 0 |

### InventoryEntry

| Parametro | Tipo | Obrigatorio | Descricao |
|---|---|---|---|
| ItemName | string | Sim | Nome do item (chave para EmissionFactors) |
| Category | EmissionCategory | Sim | Categoria de emissao |
| FlowType | InventoryFlowType | Sim | Input, Output ou Product |
| Quantity | decimal | Sim | Quantidade por UF/UD |
| DeclaredUnit | string | Sim | "kg", "L", "kWh", "m3" |
| TransportMode | TransportMode? | Nao | Modo de transporte |
| TransportDistanceKm | decimal | Nao | Distancia (ida+volta). Default 0 |
| MassConversionFactor | decimal | Nao | kg/UD. Default 1 |
| DisposalEmissionFactor | decimal | Nao | kg CO2/kg para residuos. Default 0 |

### Outputs -- CO2Result

| Campo | Tipo | Unidade | Descricao |
|---|---|---|---|
| TotalMin | decimal | kg CO2/UF | Emissao minima |
| TotalMax | decimal | kg CO2/UF | Emissao maxima |
| ByModule | Dict<LifeCycleModule, decimal> | kg CO2/UF | A1, A2, A3 separados |
| ByCategory | Dict<EmissionCategory, decimal> | kg CO2/UF | Por tipo de emissao |
| Hotspots | List<HotspotItem> | -- | Analise de contribuicao |
| MaterialConsumption | decimal | kg/UF | Consumo de material (Eq. 43) |

## Codigo -- Localizacao na Implementacao

### Arquivos-chave
| Arquivo | Responsabilidade |
|---|---|
| `Services/CO2CalculationService.cs` | Logica principal de calculo |
| `Services/EmissionFactorProvider.cs` | Acesso aos fatores de emissao |
| `Data/FuelEmissionFactors.cs` | Tabela 2 do CT 101 |
| `Data/CarbonateEmissionFactors.cs` | Tabela 3 do CT 101 |
| `Data/TransportEmissionFactors.cs` | Fatores de transporte Sidac |
| `Data/ElectricityEmissionFactors.cs` | Fator da rede eletrica |
| `Models/Inventory.cs` | Modelo de inventario |
| `Models/CO2Result.cs` | Modelo de resultado |

### Metodos principais
```csharp
// Eq. 5: Emissao fundamental
decimal CalculateSimpleEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> items);

// Eq. 7: Combustao
decimal CalculateCombustionEmission(IEnumerable<(decimal quantity, decimal emissionFactor)> fuelQuantities);

// Eq. 8: Calcinacao
decimal CalculateCalcinationEmission(decimal carbonateQuantityKg, decimal emissionFactor);

// Eq. 9: Biomassa (constantes: 0.5 fracao C, 44/12 razao CO2/C)
decimal CalculateBiomassEmission(decimal dryBiomassKg);

// Eq. 10: Transporte (via TransportItem.Emission = qty/1000 x dist x factor)
decimal CalculateTransportEmission(IEnumerable<TransportItem> items);

// Eq. 12-20, 44-55: Estagio de produto completo com desdobramento A1/A2/A3
CO2Result CalculateProductStage(Inventory inventory);

// Eq. 57-58: Propagacao de incertezas
UncertaintyResult PropagateUncertainty(
    IEnumerable<(decimal quantity, decimal factorMin, decimal factorMax)> items);
```

## Decisoes de Design

| Decisao | Justificativa |
|---|---|
| `record` para Input/Result | Imutabilidade -- parametros de calculo nao alteraveis |
| `Validate()` nao implementado em Inventory | Validacao feita via `IInventoryValidator` separado |
| Desdobramento A1/A2/A3 dentro de CalculateProductStage | Evita duplicacao -- um unico loop processa tudo |
| Min/Max via dois caminhos no mesmo loop | Performance: calcula ambos em uma passagem |
| Hotspots calculados com valores MAX | Conservador: hotspots baseados no pior caso |
| dp(e_i) = (max-min)/4 | Convencao: +/-2sigma cobre ~95% da faixa |
| `factor > 100` para detectar kg CO2/t | Heuristica: se fator > 100 e unidade=kg, assume que fator e por tonelada |

## Testes de Sanidade

### Teste 1: Concreto 25 MPa (exemplo CT 101, p. 45-56)
```
Input: Cimento=300kg, Areia=800kg, Brita=1100kg, perdas=2%
       e_cimento=750 kgCO2/t, e_areia=0-0.01023, e_brita=0-0.01603
       Diesel=0.45 L/m3, e_diesel=2.29
Esperado: C_min ~ 265 kg CO2/m3, C_max ~ 285 kg CO2/m3
```

### Teste 2: Equacao 9 (biomassa)
```
Input: biomassa_seca = 100 kg
Esperado: 100 x 0.5 x (44/12) = 183.33 kg CO2
```

### Teste 3: Equacao 1 (substituicoes)
```
Input: PR=50 anos, VU=20 anos
Esperado: ceil(50/20) - 1 = 3 - 1 = 2 substituicoes
```

## Armadilhas Conhecidas

**Heuristica `factor > 100`:** O metodo `CalculateMaterialEmission` converte kg->t quando o fator e > 100 e a unidade e "kg". Se um material processado tiver fator real > 100 kg CO2/kg (improvavel mas possivel), o resultado sera incorreto.

**Fatores de transporte do Sidac:** Os valores nos exemplos do CT 101 (Tabela 8: truck=0.0601; Tabela 23: truck=0.068) diferem ligeiramente. A implementacao usa os valores da Tabela 8.

**Eletricidade:** O fator 0.07 kg CO2/kWh e da rede brasileira. Varia anualmente com a matriz energetica. Verificar atualizacao do Sidac.
