# CoreCO2 — Servico de Calculo de Emissoes de CO2

Biblioteca .NET 9.0 para quantificacao de emissoes de CO2 incorporadas em materiais cementicios e estruturas de concreto, conforme o Boletim Tecnico IBRACON/ABECE/ABCIC CT 101 (1a Edicao, 2024).

## Registro via DI

```xml
<!-- No .csproj do projeto consumidor -->
<ProjectReference Include="..\CoreCO2\CoreCO2.csproj" />
```

```csharp
using CoreCO2.Extensions;

// No MauiProgram.cs ou Startup:
services.AddCoreCO2();
```

Registra 3 singletons:
- `ICO2CalculationService` — calculos de emissao
- `IEmissionFactorProvider` — fatores de emissao embutidos
- `IInventoryValidator` — validacao de inventario

---

## Arquitetura

```
CoreCO2/
├── Models/          # Enums, records, tipos de dominio
├── Data/            # Tabelas de fatores embutidas (static classes)
├── Abstractions/    # Interfaces (ICO2CalculationService, etc.)
├── Services/        # Implementacoes
├── Extensions/      # AddCoreCO2() para DI
└── docs/            # 16 .md com conhecimento completo do CT 101
```

---

## Referencia Rapida de Tipos

### Enums

| Enum | Valores | Uso |
|------|---------|-----|
| `LifeCycleModule` | A1, A2, A3, A4, A5, B1-B5, C1-C4, D | Modulos do ciclo de vida |
| `EmissionCategory` | FuelCombustion, CarbonateCalcination, NonRenewableBiomass, ProcessedMaterial, Electricity, Transport, WasteDisposal, Carbonation | Categorias de emissao |
| `FuelType` | OleoDiesel, GasNatural, GLP, CoquePetroleo, CoqueCarvaoMineral, CarvaoMineral, ... (17 tipos) | Combustiveis fosseis |
| `CarbonateType` | Calcite, Magnesite, Dolomite, Siderite, Ankerite, Rhodochrosite, SodiumCarbonate | Carbonatos |
| `TransportMode` | Toco2Eixos, Truck3Eixos, Truck4Eixos, Carreta5Eixos, Betoneira | Transporte rodoviario |
| `InventoryFlowType` | Input, Output, Product | Tipo de fluxo no inventario |

### Records

```csharp
// Fator de emissao com faixa min/max
record EmissionFactor(string ItemId, decimal ValueMin, decimal ValueMax, string Unit, string Source);

// Entrada do inventario
record InventoryEntry(
    string ItemName,               // "Cimento CP II F", "Areia"
    EmissionCategory Category,
    InventoryFlowType FlowType,
    decimal Quantity,              // quantidade por UF
    string DeclaredUnit,           // "kg", "L", "kWh", "m3"
    TransportMode? TransportMode = null,
    decimal TransportDistanceKm = 0m,
    decimal MassConversionFactor = 1m,   // kg/UD (para kg=1)
    decimal DisposalEmissionFactor = 0m); // Eq. 19/55 — fator de disposicao (kg CO2/kg)

// Item de transporte
record TransportItem(string ItemName, decimal MassKg, decimal DistanceKm,
    TransportMode Mode, decimal EmissionFactorPerTonKm);
    // Propriedade calculada: TonKm = MassKg / 1000 * DistanceKm
    // Propriedade calculada: Emission = TonKm * EmissionFactorPerTonKm

// Resultado de calculo
record CO2Result(
    decimal TotalMin,              // kg CO2/UF (cenario otimista)
    decimal TotalMax,              // kg CO2/UF (cenario conservador)
    IReadOnlyDictionary<LifeCycleModule, decimal> ByModule,   // A1, A2, A3 separados
    IReadOnlyDictionary<EmissionCategory, decimal> ByCategory,
    IReadOnlyList<HotspotItem> Hotspots,
    decimal MaterialConsumption);  // kg/UF (Eq. 43)

// Hotspot
record HotspotItem(string ItemName, decimal EmissionKgCO2, decimal Percentage);

// Propagacao de incertezas
record UncertaintyResult(decimal CentralEstimate, decimal StandardDeviation);

// Resultado fim de vida C1-C4
record EndOfLifeResult(decimal Total, decimal C1Demolition, decimal C2Transport,
    decimal C3Recycling, decimal C4Disposal);

// Resultado substituicoes B4
record ReplacementResult(decimal Total, decimal ProductionEmission,
    decimal TransportEmission, decimal WasteEmission,
    IReadOnlyList<ReplacementDetail> Details);
record ReplacementDetail(string ItemName, int ReplacementCount, decimal EmissionKgCO2);

// Item de residuo (usado em A5, B4, C1-C4)
record WasteItem(string ItemName, decimal QuantityKg, TransportMode TransportMode,
    decimal TransportDistanceKm,
    decimal DisposalEmissionFactor = 0m,     // Eq. 40 — fator de disposicao final C4 (kg CO2/kg)
    decimal RecyclingEmissionFactor = 0m);   // Eq. 39 — fator de reciclagem C3 (kg CO2/kg)

// Material de substituicao (B4)
record ReplacementMaterial(string ItemName, int MaterialLifeYears,
    decimal QuantityPerReplacement, decimal A1A3Factor,
    TransportItem? TransportToSite = null, WasteItem? Waste = null);
```

### Inputs para Estagios A5, B4, C1-C4

```csharp
// A5 - Processo construtivo (Eq. 22-29)
class ConstructionStageInput {
    decimal ElectricityKwh;           // kWh consumidos na obra
    IReadOnlyList<(decimal Quantity, decimal EmissionFactor)> FuelConsumption;
    IReadOnlyList<(string ItemName, decimal WastedQuantity, decimal A1A3Factor)> MaterialLosses;
    IReadOnlyList<TransportItem> DiscardedMaterialTransport;
    IReadOnlyList<WasteItem> ConstructionWaste;
}

// C1-C4 - Fim de vida (Eq. 35-40)
class EndOfLifeInput {
    decimal DemolitionElectricityKwh;
    IReadOnlyList<(decimal Quantity, decimal EmissionFactor)> DemolitionFuel;
    IReadOnlyList<WasteItem> DemolitionWaste;
}

// B4 - Substituicoes (Eq. 30-34)
class ReplacementInput {
    required int ReferencePeriodYears;      // periodo de referencia (ex.: 50)
    required IReadOnlyList<ReplacementMaterial> Materials;
}
```

### Inventory (classe)

```csharp
class Inventory {
    required string ProductName;           // "Concreto 25 MPa"
    required string FunctionalUnit;        // "1 m3 de concreto"
    required IReadOnlyList<InventoryEntry> Entries;
    required IReadOnlyDictionary<string, EmissionFactor> EmissionFactors; // chave = ItemName
    decimal LossRatio;           // 0.02 = 2% de perdas
    decimal DirectEmission;      // kg CO2/UF (combustao na fabrica)
    decimal CarbonationRemoval;  // kg CO2/UF (credito de carbonatacao, Eq. 11)
    // Computed: Inputs, Outputs, Products (filtros de Entries por FlowType)
}
```

---

## Mapa Equacao → Metodo

| Equacao | Metodo | Descricao |
|---------|--------|-----------|
| Eq. 1 | `CalculateReplacements(PR, VU)` | n = ceil(PR/VU) - 1 |
| Eq. 5 | `CalculateSimpleEmission(items)` | C = Sum(q * e) |
| Eq. 7 | `CalculateCombustionEmission(items)` | Combustao de fosseis |
| Eq. 8 | `CalculateCalcinationEmission(qty, factor)` | Decomposicao de carbonatos |
| Eq. 9 | `CalculateBiomassEmission(dryMassKg)` | biomassa * 0.5 * 44/12 |
| Eq. 10 | `CalculateTransportEmission(items)` | Transporte A2 (materia-prima -> fabrica) |
| Eq. 11 | `Inventory.CarbonationRemoval` | Credito de carbonatacao (subtraido) |
| Eq. 12-19, 44-55 | `CalculateProductStage(inventory)` | Estagio A1-A3 completo, desdobrado conforme Anexo A |
| Eq. 21 | `CalculateTransportToSite(items)` | Transporte A4 (fabrica -> obra) |
| Eq. 22-29 | `CalculateConstructionStage(input)` | Estagio A5 (eletricidade + combustao + perdas + residuos) |
| Eq. 30-34 | `CalculateReplacementStage(input)` | Estagio B4 (producao + transporte + residuos das substituicoes) |
| Eq. 35-40 | `CalculateEndOfLife(input)` | Estagio C1-C4 (C3=RecyclingEmissionFactor, C4=DisposalEmissionFactor) |
| Eq. 57-58 | `PropagateUncertainty(items)` | Taylor: C_central e desvio padrao |
| — | `AnalyzeHotspots(itemEmissions)` | Contribuicao % de cada item |

---

## Fatores de Emissao Embutidos

### Combustiveis (Tabela 2 CT 101)

| FuelType | Fator | Unidade |
|----------|-------|---------|
| OleoDiesel | 2.29 | kg CO2/L |
| GasNatural | 2.74 | kg CO2/m3 |
| GLP | 2.93 | kg CO2/kg |
| CarvaoMineral | 2.28 | kg CO2/kg |
| CoqueCarvaoMineral | 2.73 | kg CO2/kg |
| CoquePetroleo | 3.42 | kg CO2/kg |
| OleoCombustivel | 3.11 | kg CO2/L |
| GasolinaAutomotiva | 1.61 | kg CO2/L |
| CarvaoVegetalNaoRenovavel | 3.03 | kg CO2/kg |
| LenhaNaoRenovavel | 366 | kg CO2/st |
| Renovaveis (Lenha, Carvao, Residuos) | 0 | — |

### Carbonatos (Tabela 3 CT 101)

| CarbonateType | Fator | Formula |
|---------------|-------|---------|
| Calcite | 0.44 | CaCO3 |
| Magnesite | 0.52 | MgCO3 |
| Dolomite | 0.48 | CaMg(CO3)2 |
| Siderite | 0.38 | FeCO3 |
| Ankerite | 0.41-0.48 | Ca(Fe,Mg,Mn)(CO3)2 |
| Rhodochrosite | 0.38 | MnCO3 |
| SodiumCarbonate | 0.41 | Na2CO3 |

### Transporte (Sidac)

| TransportMode | Fator (kg CO2/t.km) |
|---------------|---------------------|
| Toco2Eixos | 0.0178 |
| Truck3Eixos | 0.0601 |
| Truck4Eixos | 0.066 |
| Carreta5Eixos | 0.0691 |
| Betoneira | 0.096 |

### Eletricidade

Rede publica brasileira: **0.07 kg CO2/kWh**

---

## Exemplos de Uso

### 1. Calculo completo A1-A3 (concreto 25 MPa)

```csharp
var entries = new List<InventoryEntry>
{
    new("Cimento CP II F", EmissionCategory.ProcessedMaterial, InventoryFlowType.Input,
        300m, "kg", TransportMode.Carreta5Eixos, 700m),
    new("Areia", EmissionCategory.ProcessedMaterial, InventoryFlowType.Input,
        800m, "kg", TransportMode.Truck3Eixos, 300m),
    new("Brita", EmissionCategory.ProcessedMaterial, InventoryFlowType.Input,
        1100m, "kg", TransportMode.Truck3Eixos, 160m),
    new("Aditivo", EmissionCategory.ProcessedMaterial, InventoryFlowType.Input,
        1.50m, "kg", TransportMode.Toco2Eixos, 200m),
    new("Eletricidade", EmissionCategory.Electricity, InventoryFlowType.Input,
        3.0m, "kWh", MassConversionFactor: 0m),
    new("Agua", EmissionCategory.ProcessedMaterial, InventoryFlowType.Input,
        260m, "L", MassConversionFactor: 1m),
    new("Residuo inerte", EmissionCategory.WasteDisposal, InventoryFlowType.Output,
        46m, "kg", TransportMode.Truck3Eixos, 60m),
    new("Concreto", EmissionCategory.ProcessedMaterial, InventoryFlowType.Product,
        1m, "m3"),
};

var factors = new Dictionary<string, EmissionFactor>
{
    ["Cimento CP II F"] = new("CimentoCPIIF", 750m, 750m, "kg CO2/t", "DAP"),
    ["Areia"] = new("Areia", 0m, 0.01023m, "kg CO2/kg", "Sidac"),
    ["Brita"] = new("Brita", 0m, 0.01603m, "kg CO2/kg", "Sidac"),
    ["Eletricidade"] = new("Eletricidade", 0.07m, 0.07m, "kg CO2/kWh", "Sidac"),
};

var inventory = new Inventory
{
    ProductName = "Concreto 25 MPa",
    FunctionalUnit = "1 m3 de concreto",
    Entries = entries,
    EmissionFactors = factors,
    LossRatio = 0.02m,           // 2% de perdas
    DirectEmission = 1.03m,      // Diesel: 0.45 L * 2.29
};

var result = _calculationService.CalculateProductStage(inventory);

// result.TotalMin ≈ 265 kg CO2/m3
// result.TotalMax ≈ 285 kg CO2/m3
// result.ByModule[LifeCycleModule.A1] → emissoes dos materiais SEM perdas (Eq. 46)
// result.ByModule[LifeCycleModule.A2] → emissoes de transporte SEM perdas (Eq. 48)
// result.ByModule[LifeCycleModule.A3] → combustao + perdas(mat+transp) + residuos (Eq. 49-55)
// result.Hotspots[0] → Cimento (~80%)
```

### 2. Calculo simples de emissao

```csharp
var items = new[] { (quantity: 10m, emissionFactor: 2.0m) };
decimal emission = _calculationService.CalculateSimpleEmission(items);
// emission = 20 kg CO2
```

### 3. Calculo de transporte

```csharp
var items = new[]
{
    new TransportItem("Cimento", 300m, 700m, TransportMode.Carreta5Eixos, 0.0691m)
};
decimal a2 = _calculationService.CalculateTransportEmission(items);
// a2 = 14.511 kg CO2 (300/1000 * 700 * 0.0691)
```

### 4. Transporte ate a obra (A4)

```csharp
var items = new[]
{
    new TransportItem("Concreto", 2400m, 30m, TransportMode.Truck3Eixos, 0.0601m)
};
decimal a4 = _calculationService.CalculateTransportToSite(items);
// a4 = 4.3272 kg CO2
```

### 5. Propagacao de incertezas

```csharp
var items = new[]
{
    (quantity: 300m, factorMin: 700m, factorMax: 800m),  // Cimento min/max
    (quantity: 800m, factorMin: 0m, factorMax: 0.01023m), // Areia
};
var uncertainty = _calculationService.PropagateUncertainty(items);
// uncertainty.CentralEstimate → estimativa central
// uncertainty.StandardDeviation → desvio padrao
```

### 6. Numero de reposicoes (B4)

```csharp
int replacements = _calculationService.CalculateReplacements(
    referencePeriodYears: 50, materialLifeYears: 15);
// replacements = 3 (ceil(50/15) - 1)
```

### 7. Combustao de combustiveis fosseis

```csharp
var items = new[] { (quantity: 0.45m, emissionFactor: 2.29m) };
decimal combustion = _calculationService.CalculateCombustionEmission(items);
// combustion = 1.0305 kg CO2 (diesel)
```

### 8. Calcinacao de carbonatos

```csharp
decimal calcination = _calculationService.CalculateCalcinationEmission(100m, 0.44m);
// calcination = 44 kg CO2 (100 kg CaCO3 * 0.44)
```

### 9. Biomassa nao renovavel

```csharp
decimal biomass = _calculationService.CalculateBiomassEmission(100m);
// biomass ≈ 183.33 kg CO2 (100 * 0.5 * 44/12)
```

### 10. Consulta de fatores de emissao

```csharp
var diesel = _factorProvider.GetFuelFactor(FuelType.OleoDiesel);
// diesel.ValueMin = 2.29, diesel.Unit = "kg CO2/L"

var calcite = _factorProvider.GetCarbonateFactor(CarbonateType.Calcite);
// calcite.ValueMin = 0.44

var truck = _factorProvider.GetTransportFactor(TransportMode.Truck3Eixos);
// truck.ValueMin = 0.0601, truck.Unit = "kg CO2/t.km"

var grid = _factorProvider.GetElectricityFactor();
// grid.ValueMin = 0.07, grid.Unit = "kg CO2/kWh"
```

### 11. Validacao de inventario

```csharp
bool balanced = _validator.ValidateMassBalance(inventory);
// true se Sum(inputs) ≈ Sum(outputs + products) (tolerancia 1%)

var cutoffEligible = _validator.GetCutoffEligibleItems(inventory);
// Lista de itens que podem ser omitidos (< 1% individual, < 5% coletivo)
```

### 12. Carbonatacao (credito de remocao)

```csharp
var inventory = new Inventory
{
    // ... (entradas normais)
    CarbonationRemoval = 10m, // 10 kg CO2 absorvido por carbonatacao
};
var result = _calculationService.CalculateProductStage(inventory);
// result.TotalMax sera reduzido em 10 kg CO2
// result.ByCategory[EmissionCategory.Carbonation] = -10
```

### 13. Estagio A5 — Processo construtivo (Eq. 22-29)

```csharp
var a5Input = new ConstructionStageInput
{
    ElectricityKwh = 5.0m,                    // eletricidade na obra
    FuelConsumption = [(0.12m, 2.29m)],       // diesel de bombeamento
    MaterialLosses =
    [
        ("Concreto", 0.006m, 300m),           // 0.6% perda × 300 kg CO2/m3
    ],
    ConstructionWaste =
    [
        new WasteItem("Concreto", 27m, TransportMode.Truck3Eixos, 30m, 0.01m),
        new WasteItem("Aco", 0.18m, TransportMode.Carreta5Eixos, 40m, 0.005m),
    ],
};
decimal a5 = _calculationService.CalculateConstructionStage(a5Input);
// a5 ≈ 2.7 kg CO2/UF
```

### 14. Estagio C1-C4 — Fim de vida (Eq. 35-40)

```csharp
var eolInput = new EndOfLifeInput
{
    DemolitionElectricityKwh = 2.0m,
    DemolitionFuel = [(0.5m, 2.29m)],         // diesel demolicao
    DemolitionWaste =
    [
        new WasteItem("Concreto", 500m, TransportMode.Truck3Eixos, 30m,
            DisposalEmissionFactor: 0.01m),                          // C4: aterro
        new WasteItem("Aco", 20m, TransportMode.Carreta5Eixos, 40m,
            RecyclingEmissionFactor: 0.05m),                         // C3: reciclagem
    ],
};
var eolResult = _calculationService.CalculateEndOfLife(eolInput);
// eolResult.C1Demolition → demolicao (eletricidade + combustao)
// eolResult.C2Transport  → transporte de residuos
// eolResult.C3Recycling  → Eq.39: qty × RecyclingEmissionFactor
// eolResult.C4Disposal   → Eq.40: qty × DisposalEmissionFactor
```

### 15. Estagio B4 — Substituicoes (Eq. 30-34)

```csharp
var b4Input = new ReplacementInput
{
    ReferencePeriodYears = 50,
    Materials =
    [
        new ReplacementMaterial(
            "Telha ceramica",
            MaterialLifeYears: 25,            // VU = 25 anos → 1 substituicao em 50 anos
            QuantityPerReplacement: 10m,       // 10 m2/UF por substituicao
            A1A3Factor: 5.0m,                  // 5 kg CO2/m2
            TransportToSite: new TransportItem("Telha", 200m, 100m,
                TransportMode.Truck3Eixos, 0.0601m),
            Waste: new WasteItem("Telha antiga", 200m,
                TransportMode.Truck3Eixos, 30m, 0.01m)),
    ]
};
var b4Result = _calculationService.CalculateReplacementStage(b4Input);
// b4Result.Total ≈ 53.6 kg CO2/UF
// b4Result.Details[0].ReplacementCount = 1
// b4Result.ProductionEmission = 50 (1 × 10 × 5.0)
// b4Result.TransportEmission  = 1.202
// b4Result.WasteEmission      = 2.36
```

---

## Regras Importantes

### Fatores de emissao com unidade em kg CO2/t

Quando `EmissionFactor.ValueMin > 100` e a unidade do inventario e "kg", o servico converte automaticamente:
`emissao = quantidade_kg / 1000 * fator_por_tonelada`

Exemplo: Cimento com fator 750 kg CO2/t e quantidade 300 kg:
`300 / 1000 * 750 = 225 kg CO2`

### TransportDistanceKm

A distancia no `InventoryEntry` e a distancia **ida** de transporte (mina/fonte ate fabrica para A2). O calculo usa o valor diretamente (sem duplicar para ida e volta).

### MassConversionFactor

Para itens em "kg", use `MassConversionFactor = 1`. Para "L" (litros de agua), use a densidade (1 kg/L). Para "kWh" (eletricidade), use `0` para excluir do balanco de massa.

### LossRatio

Aplicado a todos os inputs: `quantidade_efetiva = quantidade * (1 + LossRatio)`. Tipicamente 0.02 (2%) para concreto.

---

## Documentacao de Referencia

Os 16 arquivos em `CoreCO2/docs/` contem o conhecimento completo do CT 101:

| Arquivo | Conteudo |
|---------|----------|
| `docs/00-indice.md` | Indice geral |
| `docs/05-ciclo-de-vida.md` | Modulos A1-D, fronteiras do sistema |
| `docs/06-escopo-quantificacao.md` | Unidade funcional, criterios de corte |
| `docs/07-analise-inventario.md` | Quadro 3 (formato do inventario) |
| `docs/08-calculo-indicadores.md` | Equacoes 5-42, Tabelas 2-3 |
| `docs/11-exemplo-concreto-dosado.md` | Exemplo completo: concreto 25/30/35 MPa |
| `docs/12-exemplo-estrutura-concreto.md` | Exemplo: estrutura de concreto armado |
| `docs/14-anexo-a-desdobramento-A1A2A3.md` | Equacoes 44-55 (A1/A2/A3 separados) |
| `docs/15-anexo-b-propagacao-incertezas.md` | Equacoes 57-58 (Taylor) |

---

## Testes

45 testes xUnit validados contra os exemplos do livro:

```bash
dotnet test mAppsMAUICore/tests_CoreCO2/tests_CoreCO2.csproj
```

Dados de referencia para validacao numerica (Exemplo 12.1 CT 101):
- Concreto 25 MPa: ~265-285 kg CO2/m3
- Concreto 30 MPa: ~306-332 kg CO2/m3
- Concreto 35 MPa: ~333-347 kg CO2/m3
- Cimento domina hotspot com >50% do total
- Transporte ~12-15% do total

---

## Status de Implementacao

| Funcionalidade | Status |
|----------------|--------|
| A1-A3 (estagio de produto) | Implementado, desdobrado conforme Anexo A (Eq. 44-55) + Eq. 19/55 |
| A4 (transporte ate obra) | Implementado |
| A5 (construcao, Eq. 22-29) | Implementado |
| B4 (reposicoes, Eq. 30-34) | Implementado (contagem + producao + transporte + residuos) |
| C1-C4 (fim de vida, Eq. 35-40) | Implementado (C3=RecyclingEmissionFactor Eq.39, C4=DisposalEmissionFactor Eq.40) |
| D (beneficios) | Nao implementado (fora do escopo CT 101) |
| Carbonatacao (Eq. 11) | Implementado |
| Propagacao de incertezas (Eq. 57-58) | Implementado |
| Validacao de inventario | Implementado |
| Hotspot analysis | Implementado |
| Fatores embutidos | Completo (17 combustiveis, 7 carbonatos, 5 transportes) |
