# Convencoes da Base de Conhecimento -- CoreCO2

## Fonte
- **Boletim Tecnico IBRACON/ABECE/ABCIC -- CT 101**
- "Quantificacao das emissoes de CO2 incorporadas em materiais cimenticios e estruturas de concreto"
- 1a Edicao, Sao Paulo, 2024

## Dominios

```yaml
domains:
  - co2_emissions          # Conceitos fundamentais de emissao de CO2
  - emission_factors       # Fatores de emissao (tabelas e constantes)
  - lifecycle_stages       # Estagios A1-C4 do ciclo de vida
  - uncertainty            # Propagacao de incertezas

languages:
  - csharp

frameworks:
  - maui
  - net9
```

## Formato de IDs
- Prefixo: `CT101_` (fonte)
- Dominio: ex `LCA_`, `FUEL_`, `PRODUCT_STAGE_`
- Topico: ex `FUNDAMENTAL_EQUATION`, `EMISSION_FACTORS`
- Tudo em UPPER_SNAKE_CASE

## Unidades Padrao
| Grandeza | Unidade | Observacao |
|---|---|---|
| Emissao de CO2 | kg CO2 | Sempre kg, nao t ou g |
| Emissao por UF | kg CO2/UF | UF = m2, m3, kg conforme contexto |
| Fator combustivel | kg CO2/UD | UD varia: L, kg, m3, st |
| Fator transporte | kg CO2/t.km | Tonelada-quilometro |
| Fator eletricidade | kg CO2/kWh | -- |
| Distancia | km | Trafego, nao linha reta |
| Massa | kg ou t | t = 1000 kg |

## Status dos Chunks
- `verified`: Confrontado com o CT 101 e implementacao C# existente
- `draft`: Ainda nao verificado contra a fonte
- `deprecated`: Substituido -- ver campo `replaced_by`
