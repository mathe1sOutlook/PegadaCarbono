---
id: "CT101_LCA_LIFECYCLE_MODULES"
type: definition
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Seção 7 — Definição do Escopo"
  section: "7.3.1"
  page: "p. 14-18"
domain: ["co2_emissions", "lca"]
tags: ["lifecycle", "modules", "scope", "definition"]
depends_on: []
used_by:
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_TRANSPORT_A4"
  - "CT101_CONSTRUCTION_A5"
  - "CT101_REPLACEMENT_B4"
  - "CT101_END_OF_LIFE_C1C4"
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Módulos de Informação do Ciclo de Vida

### Contexto
O ciclo de vida de uma edificação ou material é dividido em módulos padronizados (EN 15978, ISO 21930). Cada módulo corresponde a uma etapa específica e define quais processos elementares devem ser inventariados. A correta atribuição de processos aos módulos é essencial para a comparabilidade dos resultados.

### Definição

| Estágio | Módulo | Descrição | Processos típicos |
|---------|--------|-----------|-------------------|
| **Produto** | A1 | Extração de matérias-primas | Extração de calcário, minério de ferro, areia |
| | A2 | Transporte de matérias-primas | Transporte até fábrica de cimento, siderúrgica |
| | A3 | Fabricação do produto | Produção de cimento, aço, concreto |
| **Construção** | A4 | Transporte até a obra | Transporte de concreto, aço até o canteiro |
| | A5 | Processo construtivo | Bombeamento, montagem, perdas, fôrmas |
| **Uso** | B1 | Uso | Carbonatação natural |
| | B2 | Manutenção | Aplicação de hidrofugante |
| | B3 | Reparo | Recuperação de fissuras |
| | B4 | Substituição | Troca de componentes com VU < VUP |
| | B5 | Reforma | Retrofit |
| | B6 | Energia operacional | Iluminação, climatização |
| | B7 | Água operacional | Consumo de água |
| **Fim de vida** | C1 | Demolição | Rompedores, marteletes |
| | C2 | Transporte de resíduos | Até ATT, aterro, reciclagem |
| | C3 | Processamento p/ reciclagem | Triagem de RCD, separação de sucata |
| | C4 | Disposição final | Aterro de inertes, incineração |
| **Além fronteira** | D | Reuso/reciclagem | Benefícios evitados |

### Escopo Mínimo Obrigatório (Quadro 2)

| Objeto de análise | A1 | A2 | A3 | A4 | A5 | B1-B5 | C1-C4 | D |
|---|---|---|---|---|---|---|---|---|
| Material cimentício | **X** | **X** | **X** | | | | | |
| Estrutura de concreto | **X** | **X** | **X** | (X) | (X) | | | |

*X: obrigatório. (X): recomendado, caso haja dados disponíveis.*

### Hipóteses e Validade
- [ ] Emissões incorporadas (embodied carbon) ≠ emissões operacionais (operational carbon)
- [ ] Este boletim trata APENAS de emissões incorporadas
- [ ] Módulos B6/B7 são emissões operacionais — NÃO incluir no escopo deste método
- [ ] Módulo D reportado separadamente — não somar com A1-C4

### Casos Especiais
- **Perspectiva do fabricante vs. da estrutura:** A forma como processos elementares são alocados aos módulos A1/A2/A3 muda conforme a perspectiva (Figuras 3 e 4 do CT 101)
- **Materiais cimentícios:** escopo mínimo = A1-A3 (berço ao portão)
- **Estruturas de concreto:** escopo mínimo = A1-A3, recomendado A1-A5 (berço à obra)

### Restrições Explícitas
⚠️ NÃO confundir:
- Emissões incorporadas com emissões operacionais
- Módulo D com os demais — D é reportado separadamente
- Perspectiva do fabricante com perspectiva do projetista de estruturas

### Referência Direta
"As normas de ACV e DAP para construção (ISO 21930, EN 15978 e EN 15804) propõem uma divisão padronizada das etapas do ciclo de vida de uma edificação em módulos de informação." — CT 101, p. 14
