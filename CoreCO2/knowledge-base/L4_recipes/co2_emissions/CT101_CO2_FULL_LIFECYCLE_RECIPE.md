---
id: "CT101_CO2_FULL_LIFECYCLE_RECIPE"
type: recipe
language: csharp
framework: net9
implements:
  - "CT101_TRANSPORT_A4"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_REPLACEMENT_B4"
  - "CT101_REPLACEMENT_COUNT"
  - "CT101_END_OF_LIFE_C1C4"
depends_on_recipes:
  - "CT101_CO2_PRODUCT_STAGE_RECIPE"
status: verified
tested: true
last_updated: "2025-03-05"
---

# Recipe: Calculo de Ciclo de Vida Completo (A4, A5, B4, C1-C4)

## Proposito
> Calcula as emissoes de CO2 para os estagios alem do produto: transporte A4, construcao A5, substituicoes B4 e fim de vida C1-C4.

**Usar quando:** Analise do berco a obra (A1-A5) ou berco ao tumulo (A1-C4).
**Nao usar quando:** Apenas estagio de produto A1-A3 -> usar `CT101_CO2_PRODUCT_STAGE_RECIPE`.

## Conceitos Implementados
- `CT101_TRANSPORT_A4` -- Metodo `CalculateTransportToSite` (Eq. 21)
- `CT101_CONSTRUCTION_A5` -- Metodo `CalculateConstructionStage` (Eq. 22-29)
- `CT101_REPLACEMENT_COUNT` -- Metodo `CalculateReplacements` (Eq. 1)
- `CT101_REPLACEMENT_B4` -- Metodo `CalculateReplacementStage` (Eq. 30-34)
- `CT101_END_OF_LIFE_C1C4` -- Metodo `CalculateEndOfLife` (Eq. 35-40)

## Contrato de Interface

### CalculateTransportToSite -- A4

| Input | Tipo | Descricao |
|---|---|---|
| items | IEnumerable<TransportItem> | Materiais com massa, distancia e fator |
| **Return** | decimal | Emissao A4 em kg CO2/UF |

### CalculateConstructionStage -- A5 (ConstructionStageInput)

| Campo | Tipo | Descricao |
|---|---|---|
| ElectricityKwh | decimal | kWh/UF na obra (Eq. 23) |
| FuelConsumption | List<(qty, factor)> | Combustiveis (Eq. 24) |
| MaterialLosses | List<(name, wastedQty, a1a3Factor)> | Materiais desperdicados (Eq. 26) |
| DiscardedMaterialTransport | List<TransportItem> | Transporte de perdas (Eq. 27) |
| ConstructionWaste | List<WasteItem> | Residuos: transporte + disposicao (Eq. 28-29) |
| **Return** | decimal | Emissao A5 em kg CO2/UF |

### CalculateReplacementStage -- B4 (ReplacementInput)

| Campo | Tipo | Descricao |
|---|---|---|
| ReferencePeriodYears | int | Periodo de referencia (anos) |
| Materials | List<ReplacementMaterial> | Materiais a substituir |
| **Return** | ReplacementResult | Total + detalhamento por material |

### CalculateEndOfLife -- C1-C4 (EndOfLifeInput)

| Campo | Tipo | Descricao |
|---|---|---|
| DemolitionElectricityKwh | decimal | kWh/UF na demolicao |
| DemolitionFuel | List<(qty, factor)> | Combustiveis na demolicao |
| DemolitionWaste | List<WasteItem> | Residuos: transporte + reciclagem + disposicao |
| **Return** | EndOfLifeResult | Total + C1/C2/C3/C4 separados |

## Codigo -- Localizacao

| Arquivo | Metodo | Equacoes |
|---|---|---|
| `Services/CO2CalculationService.cs` | `CalculateTransportToSite` | Eq. 21 |
| `Services/CO2CalculationService.cs` | `CalculateConstructionStage` | Eq. 22-29 |
| `Services/CO2CalculationService.cs` | `CalculateReplacements` | Eq. 1 |
| `Services/CO2CalculationService.cs` | `CalculateReplacementStage` | Eq. 30-34 |
| `Services/CO2CalculationService.cs` | `CalculateEndOfLife` | Eq. 35-40 |
| `Models/ConstructionStageInput.cs` | -- | Input para A5 |
| `Models/EndOfLifeInput.cs` | -- | Input para C1-C4 |
| `Models/ReplacementInput.cs` | -- | Input para B4 |
| `Models/WasteItem.cs` | -- | Residuos com transporte e disposicao |

## Testes de Sanidade

### Teste 1: Substituicao (Eq. 1)
```
PR=50, VU=20 -> n=2
PR=50, VU=60 -> n=0
PR=50, VU=50 -> n=0
PR=50, VU=10 -> n=4
```

### Teste 2: Estrutura 24 pavimentos (exemplo CT 101, p. 56-65)
```
A1-A3: 91% do total
A4 (transporte): ~1%
A5 (obra): ~8%
Total: 70-111 kg CO2/m2
Consumo de material: 591 kg/m2
```

### Teste 3: A5 -- diesel de bombeamento
```
q_diesel = 0.12 L/m2
e_diesel = 2.29 kg CO2/L
C_comb,A5 = 0.12 x 2.29 = 0.27 kg CO2/m2
```

## Armadilhas Conhecidas

**B4 nao e escopo minimo:** Nao incluir B4 por padrao. So calcular quando o periodo de referencia foi definido.

**C1-C4 carece de fatores brasileiros:** O CT 101 nota que faltam fatores de emissao representativos do contexto brasileiro para os estagios C3/C4.

**Formas no A5:** Compensado e madeira das formas sao materiais do A5, NAO do A1-A3 da estrutura.

**Transporte A4 sem perdas:** A Eq. 21 usa quantidades sem perdas (q'_i), diferente do A5 que usa quantidades com perdas.
