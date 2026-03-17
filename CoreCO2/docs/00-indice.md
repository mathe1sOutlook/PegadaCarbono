# CoreCO2 - Emissão de CO₂ e Pegada de Carbono em Concreto Armado

## Baseado no Boletim Técnico IBRACON/ABECE/ABCIC — CT 101
*Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto*
*1ª Edição, São Paulo, 2024*

---

## Índice

### Parte I — Fundamentos

| # | Arquivo | Seção | Páginas |
|---|---------|-------|---------|
| 01 | [01-introducao-objetivo.md](01-introducao-objetivo.md) | 1. Introdução / 2. Objetivo | p. 1-2 |
| 02 | [02-referencias.md](02-referencias.md) | 3. Referências normativas | p. 2 |
| 03 | [03-termos-definicoes.md](03-termos-definicoes.md) | 4. Termos e Definições (28 termos) | p. 3-5 |
| 04 | [04-simbologia.md](04-simbologia.md) | 5. Simbologia (letras minúsculas, maiúsculas, gregas, siglas) | p. 5-9 |

### Parte II — Metodologia

| # | Arquivo | Seção | Páginas |
|---|---------|-------|---------|
| 05 | [05-ciclo-de-vida.md](05-ciclo-de-vida.md) | 6. Abordagem do Ciclo de Vida (ACV, Figuras 1-2) | p. 9-12 |
| 06 | [06-escopo-quantificacao.md](06-escopo-quantificacao.md) | 7. Definição do Escopo (UF/UD, fronteira, módulos A1-D, Quadros 1-2, Tabela 1, Figuras 3-5) | p. 12-21 |
| 07 | [07-analise-inventario.md](07-analise-inventario.md) | 8. Análise do Inventário (coleta de dados, critérios de corte, alocação — Equações 1-4, Quadro 3) | p. 22-28 |
| 08 | [08-calculo-indicadores.md](08-calculo-indicadores.md) | 9. Cálculo dos Indicadores (emissão CO₂, consumo de material — Equações 5-43, Tabelas 2-3, Quadro 4) | p. 28-41 |
| 09 | [09-interpretacao-resultados.md](09-interpretacao-resultados.md) | 10. Interpretação dos Resultados (benchmarking, hotspot — Figuras 6-7) | p. 42-43 |
| 10 | [10-relatorio.md](10-relatorio.md) | 11. Relatório (informações mínimas) | p. 44-45 |

### Parte III — Exemplos Práticos

| # | Arquivo | Seção | Páginas |
|---|---------|-------|---------|
| 11 | [11-exemplo-concreto-dosado.md](11-exemplo-concreto-dosado.md) | 12.1. Exemplo — Concreto Dosado em Central (25/30/35 MPa — Tabelas 4-12, Figuras 8-10) | p. 45-56 |
| 12 | [12-exemplo-estrutura-concreto.md](12-exemplo-estrutura-concreto.md) | 12.2. Exemplo — Estrutura de Concreto Armado (24 pav. — Tabelas 14-25, Figuras 11-15) | p. 56-65 |

### Parte IV — Conclusão e Referências

| # | Arquivo | Seção | Páginas |
|---|---------|-------|---------|
| 13 | [13-conclusao-bibliografia.md](13-conclusao-bibliografia.md) | 13. Conclusão / 14. Bibliografia (30 referências) | p. 66-68 |

### Parte V — Anexos

| # | Arquivo | Seção | Páginas |
|---|---------|-------|---------|
| 14 | [14-anexo-a-desdobramento-A1A2A3.md](14-anexo-a-desdobramento-A1A2A3.md) | Anexo A — Desdobramento da emissão de CO₂ nas etapas A1, A2 e A3 (Equações 44-55) | p. 69-71 |
| 15 | [15-anexo-b-propagacao-incertezas.md](15-anexo-b-propagacao-incertezas.md) | Anexo B — Procedimento alternativo para propagação de incertezas (Equações 57-58, série de Taylor) | p. 71 |

---

## Resumo das Equações

| Equação | Descrição | Arquivo |
|---------|-----------|---------|
| Eq. 1 | Número de reposições (n_i) | 07 |
| Eq. 2 | Fluxos unitários de inventário (q_i) | 07 |
| Eq. 3 | Alocação dos fluxos de inventário | 07 |
| Eq. 4 | Verificação da alocação | 07 |
| Eq. 5 | Emissão de CO₂ fundamental (C_j) | 08 |
| Eq. 6 | Categorias de fatores de emissão | 08 |
| Eq. 7 | Queima de combustíveis fósseis (C_comb) | 08 |
| Eq. 8 | Decomposição de carbonatos (C_calc) | 08 |
| Eq. 9 | Biomassa não renovável (C_biomassa) | 08 |
| Eq. 10 | Emissões de transporte (C_t) | 08 |
| Eq. 11 | Remoções de CO₂ por carbonatação | 08 |
| Eq. 12-19 | Estágio de produto A1-A3 (materiais) | 08 |
| Eq. 20 | Estágio de produto A1-A3 (estruturas) | 08 |
| Eq. 21 | Transporte até a obra A4 | 08 |
| Eq. 22-29 | Processo construtivo A5 | 08 |
| Eq. 30-34 | Estágio de uso B4 (substituição) | 08 |
| Eq. 35-40 | Estágio de fim de vida C1-C4 | 08 |
| Eq. 41-42 | Consideração de incertezas (faixa) | 08 |
| Eq. 43 | Consumo de material (M) | 08 |
| Eq. 44-55 | Desdobramento A1, A2 e A3 separados | 14 (Anexo A) |
| Eq. 57-58 | Propagação de incertezas (Taylor) | 15 (Anexo B) |

## Resumo das Tabelas de Dados Numéricos

| Tabela | Descrição | Arquivo |
|--------|-----------|---------|
| Tabela 2 | Fatores de emissão de CO₂ para combustíveis fósseis (16 combustíveis) | 08 |
| Tabela 3 | Fatores de emissão de CO₂ para calcinação de carbonatos (7 minerais) | 08 |
| Tabela 4 | Traços dos concretos 25/30/35 MPa | 11 |
| Tabela 5 | Informações mensais da central de concreto | 11 |
| Tabela 6 | Distâncias de transporte (exemplo concreto) | 11 |
| Tabela 7 | Inventário da produção dos concretos | 11 |
| Tabela 8 | Fatores de emissão de CO₂ (exemplo concreto) | 11 |
| Tabela 9 | Quantidades de transporte (t.km) | 11 |
| Tabela 12 | Fatores de emissão máximos do aditivo | 11 |
| Tabela 14 | Quantitativos concreto/aço por pavimento tipo | 12 |
| Tabela 15 | Parâmetros para a etapa de obra | 12 |
| Tabela 16 | Distâncias de transporte (exemplo estrutura) | 12 |
| Tabela 17 | Inventário da estrutura — estágio de produto A1-A3 | 12 |
| Tabela 18 | Inventário para transporte A4 | 12 |
| Tabela 19 | Composições SINAPI para fôrmas | 12 |
| Tabela 20 | Inventário da etapa de construção A5 | 12 |
| Tabela 21 | Inventário transporte materiais desperdiçados | 12 |
| Tabela 22 | Inventário consolidado berço à obra | 12 |
| Tabela 23 | Fatores de emissão de CO₂ (exemplo estrutura) | 12 |
| Tabela 25 | Consumo de material do berço à obra | 12 |
