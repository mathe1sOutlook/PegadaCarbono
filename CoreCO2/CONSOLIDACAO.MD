# KNOWLEDGE EXTRACTION STANDARD (KES v1.0)
> Instrução mestre para consolidação de qualquer fonte de conhecimento em formato otimizado para agentes IA

---

## SUMÁRIO

1. [Visão Geral e Filosofia](#1-visão-geral-e-filosofia)
2. [Estrutura de Diretórios](#2-estrutura-de-diretórios)
3. [Camadas de Conhecimento (L0–L4)](#3-camadas-de-conhecimento-l0l4)
4. [Convenções de Nomenclatura e IDs](#4-convenções-de-nomenclatura-e-ids)
5. [Template: Chunk L1 (Conceito Atômico)](#5-template-chunk-l1-conceito-atômico)
6. [Template: Chunk L2 (Índice e Grafo)](#6-template-chunk-l2-índice-e-grafo)
7. [Template: Chunk L3 (Visão Consolidada)](#7-template-chunk-l3-visão-consolidada)
8. [Template: Chunk L4 (Recipe de Implementação)](#8-template-chunk-l4-recipe-de-implementação)
9. [Template: Index Master](#9-template-index-master)
10. [Regras de Qualidade e Validação](#10-regras-de-qualidade-e-validação)
11. [Protocolo de Extração Passo a Passo](#11-protocolo-de-extração-passo-a-passo)
12. [Protocolo de Consulta pelo Agente](#12-protocolo-de-consulta-pelo-agente)
13. [Exemplos Completos Anotados](#13-exemplos-completos-anotados)
14. [Erros Comuns e Como Evitá-los](#14-erros-comuns-e-como-evitá-los)

---

## 1. VISÃO GERAL E FILOSOFIA

### 1.1 Objetivo
Transformar qualquer fonte de conhecimento (livro, norma, artigo, codebase, manual) em uma **base estruturada de fragmentos autocontidos**, navegáveis por grafo de dependências, que permita a um agente IA:

- Localizar a informação correta rapidamente
- Compreender sem precisar de contexto externo ao chunk
- Implementar sem ambiguidade
- Rastrear a origem de cada decisão

### 1.2 Princípios Fundamentais

| # | Princípio | Descrição |
|---|-----------|-----------|
| P1 | **Autocontido** | Cada chunk deve ser legível e utilizável sem depender de outro chunk para ser compreendido. Contexto mínimo necessário deve estar inline. |
| P2 | **Rastreável** | Todo conceito e toda linha de código devem ter referência explícita à fonte original (livro, capítulo, equação, norma). |
| P3 | **Intenção explícita** | Cada chunk declara claramente "para que serve" e "quando usar". O agente não deve inferir uso. |
| P4 | **Falhas documentadas** | Armadilhas, restrições, casos inválidos e erros comuns têm o mesmo peso que o caso de sucesso. |
| P5 | **IDs estáveis** | IDs nunca mudam após criação. Renomear quebra o grafo de dependências. |
| P6 | **Separação teoria/implementação** | Conceito teórico e código de implementação vivem em chunks separados, ligados por grafo. |
| P7 | **Granularidade atômica** | Um chunk = um conceito. Se um chunk trata de dois assuntos independentes, deve ser dividido. |
| P8 | **Linguagem do domínio** | Usar os termos técnicos do domínio exatamente como aparecem na fonte. Nunca parafrasear equações ou definições técnicas. |

### 1.3 Para Qual Tipo de Fonte Este Padrão se Aplica

- Livros técnicos e científicos (engenharia, matemática, física, etc.)
- Normas e códigos (ABNT, ASTM, ISO, etc.)
- Artigos e papers
- Documentação de frameworks e bibliotecas
- Codebases existentes (extração de padrões de design)
- Manuais de software e especificações técnicas

---

## 2. ESTRUTURA DE DIRETÓRIOS

```
/knowledge-base/
│
├── L0_raw/                     ← Fontes originais preservadas
│   ├── books/
│   ├── papers/
│   ├── norms/
│   └── code/
│
├── L1_chunks/                  ← Conceitos atômicos extraídos
│   ├── [domain]/
│   │   ├── [subdomain]/
│   │   │   └── [CHUNK_ID].md
│   │   └── _index.md           ← Índice local do subdomínio
│   └── _global_index.md
│
├── L2_index/                   ← Grafos, mapas e metadados globais
│   ├── dependency_graph.json   ← Grafo principal de dependências
│   ├── tag_index.json          ← Índice invertido por tags/domínio
│   ├── source_map.json         ← Mapeamento fonte → chunk IDs
│   └── intent_index.md         ← Índice por intenção do agente
│
├── L3_compiled/                ← Visões consolidadas por tema
│   └── [tema]/
│       └── [TOPIC_OVERVIEW].md
│
├── L4_recipes/                 ← Implementações prontas
│   └── [domain]/
│       └── [RECIPE_ID].md
│
└── _META/
    ├── INDEX_MASTER.md         ← Ponto de entrada principal do agente
    ├── CONVENTIONS.md          ← Este documento (versão resumida)
    └── CHANGELOG.md            ← Histórico de adições e correções
```

### 2.1 Regras de Organização de Diretórios

- Nomes de pastas: `snake_case`, minúsculos, sem espaços
- Máximo de 3 níveis de profundidade abaixo de L1/L4
- Cada subpasta deve conter um `_index.md` listando seus chunks
- L0 é **somente leitura** — nunca editar arquivos originais
- L4 recipes sempre dentro do domínio correspondente ao conceito implementado

---

## 3. CAMADAS DE CONHECIMENTO (L0–L4)

```
L0 ──► L1 ──► L2 ──► L3 ──► L4
RAW   CHUNK  INDEX  TOPIC  RECIPE
fonte  átomo  grafo  visão  código
```

### L0 — Raw (Fonte Original)
- Arquivos originais, intocados
- PDFs, ZIPs, repositórios clonados
- **Nunca referenciado diretamente pelo agente** — apenas por humanos

### L1 — Chunk (Conceito Atômico)
- **Unidade fundamental da base**
- Um conceito, uma equação, uma regra, um algoritmo
- Autocontido com contexto mínimo necessário
- Referencia diretamente a fonte em L0

### L2 — Index (Grafo e Índices)
- Não contém conhecimento novo — apenas **relações e ponteiros**
- Grafo de dependências entre L1 chunks
- Índices invertidos (por tag, por domínio, por intenção)
- Mapa de fontes → chunks

### L3 — Compiled (Visão Temática)
- Síntese de múltiplos chunks L1 relacionados
- Narrativa coerente de um tópico completo
- Inclui ordem de estudo sugerida
- Não substitui os chunks L1 — os referencia e conecta

### L4 — Recipe (Implementação)
- Código funcional e completo
- Mapeado 1-para-1 com conceito(s) L1 que implementa
- Inclui inputs, outputs, decisões de design, testes de sanidade
- **O produto final mais valioso para agentes de código**

---

## 4. CONVENÇÕES DE NOMENCLATURA E IDs

### 4.1 Formato de ID

```
[SOURCE]_[DOMAIN]_[TOPIC]_[SUBTOPIC]
```

**Regras:**
- Tudo em `UPPER_SNAKE_CASE`
- SOURCE: código curto da fonte (ex: `CINTRA`, `ABNT6118`, `REACT_DOCS`)
- DOMAIN: domínio técnico (ex: `PILE`, `CONCRETE`, `STATE_MGMT`)
- TOPIC: tópico específico (ex: `SETTLEMENT`, `FLEXION`, `REDUCER`)
- SUBTOPIC: opcional, apenas se necessário para distinção
- Máximo 60 caracteres no total
- **Proibido usar números sequenciais genéricos** (ex: `CHUNK_001`) — IDs devem ser semânticos

**Exemplos válidos:**
```
CINTRA_PILE_ELASTIC_SHORTENING
ABNT6118_CONCRETE_FLEXION_SIMPLE
REACT_STATE_USECONTEXT_PATTERN
NBR6122_FOUNDATION_LOAD_CAPACITY
```

**Exemplos inválidos:**
```
chunk_001                  ← não semântico
cintra-pile-settlement     ← usar underscore, não hífen
CINTRA_CAP3_ITEM2          ← referência estrutural, não semântica
pile_elastic_shortening    ← deve estar em UPPER_SNAKE_CASE
```

### 4.2 Nomenclatura de Arquivos

```
[CHUNK_ID].md              ← para chunks L1
[TOPIC_ID]_OVERVIEW.md    ← para L3
[RECIPE_ID]_RECIPE.md     ← para L4
```

### 4.3 Tags de Domínio (padronizar por projeto)

Definir no início do projeto e registrar em `_META/CONVENTIONS.md`:

```yaml
# Exemplo para projeto de engenharia geotécnica
domains:
  - geotechnique
  - pile_foundation
  - soil_mechanics
  - probabilistic_analysis
  - structural

languages:
  - csharp
  - python
  - typescript

frameworks:
  - maui
  - wpf
  - react
```

---

## 5. TEMPLATE: CHUNK L1 (CONCEITO ATÔMICO)

```markdown
---
id: "[SOURCE]_[DOMAIN]_[TOPIC]"
type: concept                         # concept | formula | algorithm | rule | definition
source:
  title: "Título completo do livro/norma"
  author: "Autor(es)"
  chapter: "Capítulo X — Título do Capítulo"
  section: "Seção X.Y"
  page: "p. 123"
  equation: "Eq. X.Y"                 # se aplicável
domain: ["domínio_primário", "domínio_secundário"]
tags: ["tag1", "tag2", "tag3"]
depends_on:
  - "[CHUNK_ID]"                      # pré-requisitos (o agente deve ler antes)
used_by:
  - "[CHUNK_ID]"                      # quem usa este chunk
implements: []                        # deixar vazio em L1 — preenchido em L4
confidence: high                      # high | medium | low (qualidade da extração)
status: verified                      # draft | verified | deprecated
last_updated: "YYYY-MM-DD"
---

## [Título do Conceito]

### Contexto
> Uma a três frases explicando ONDE este conceito se encaixa no domínio maior.
> Por que ele existe, qual problema resolve.
> O agente lê isso para decidir se este é o chunk certo.

### Definição / Enunciado
[Definição precisa, usando terminologia da fonte original. Nunca parafrasear definições formais.]

### Formulação Matemática
[Se aplicável — equações em LaTeX ou notação explícita]

```
ρ_e = (Q_p + α · Q_s) · L / (A_p · E_p)
```

| Símbolo | Significado            | Unidade | Observação              |
|---------|------------------------|---------|-------------------------|
| ρ_e     | Recalque elástico      | m       |                         |
| Q_p     | Carga na ponta         | kN      | positivo                |
| Q_s     | Carga por atrito       | kN      | >= 0                    |
| α       | Fator de distribuição  | —       | 0.4 ≤ α ≤ 0.6           |
| L       | Comprimento da estaca  | m       | eje comprimento total   |
| A_p     | Área da seção          | m²      |                         |
| E_p     | Módulo de elasticidade | kPa     | ⚠️ kPa, não MPa         |

### Hipóteses e Validade
> Condições que devem ser satisfeitas para aplicar este conceito.
> Listar como checklist — o agente pode validar programaticamente.

- [ ] Regime elástico: Q < Q_ult / FS
- [ ] Estaca com seção constante ao longo de L
- [ ] Material homogêneo (E_p constante)
- [ ] Carga aplicada axialmente (sem excentricidade)

### Casos Especiais
[Variações da equação ou regra para casos específicos, se existirem]

**α para diferentes perfis de atrito:**
- Atrito uniforme: α = 0.5
- Atrito concentrado na ponta: α = 0.0
- Atrito triangular crescente: α = 0.67

### Restrições Explícitas
⚠️ **NÃO aplicar quando:**
- Carga excede a capacidade de serviço
- Estaca com variação de seção ao longo do fuste
- Regime de carregamento dinâmico

### Relação com Outros Conceitos
- **Depende de:** [descrever brevemente o que cada dependência fornece]
- **Compõe:** [em qual conceito maior este se encaixa]
- **Alternativas:** [outros métodos para o mesmo problema, se existirem]

### Referência Direta
> Transcrição literal do trecho mais importante da fonte (máximo 3 linhas).
> Usar aspas e citar localização exata.

"[Trecho literal da fonte]" — Autor, p. XXX
```

---

## 6. TEMPLATE: CHUNK L2 (ÍNDICE E GRAFO)

### 6.1 dependency_graph.json

```json
{
  "version": "1.0",
  "domain": "nome_do_domínio",
  "generated": "YYYY-MM-DD",
  "nodes": [
    {
      "id": "CHUNK_ID_A",
      "label": "Nome legível do conceito",
      "type": "concept",
      "layer": "L1",
      "domain": ["domínio"],
      "status": "verified"
    },
    {
      "id": "RECIPE_ID_B",
      "label": "Nome da recipe",
      "type": "recipe",
      "layer": "L4",
      "language": "csharp",
      "status": "verified"
    }
  ],
  "edges": [
    {
      "from": "CHUNK_ID_A",
      "to": "CHUNK_ID_B",
      "relation": "prerequisite",
      "description": "B não pode ser entendido sem A"
    },
    {
      "from": "CHUNK_ID_A",
      "to": "RECIPE_ID_B",
      "relation": "implemented_by",
      "description": "Recipe B implementa o conceito A"
    }
  ],
  "relation_types": {
    "prerequisite": "A deve ser lido antes de B",
    "implemented_by": "B é a implementação em código de A",
    "extends": "B é um caso especial ou extensão de A",
    "contradicts": "B apresenta abordagem alternativa/conflitante com A",
    "validates": "B fornece critério de validação para A",
    "example_of": "B é um exemplo concreto de A"
  }
}
```

### 6.2 intent_index.md

```markdown
# Índice por Intenção do Agente

> Use esta tabela como primeiro ponto de entrada.
> Encontre a intenção mais próxima da tarefa e siga o caminho indicado.

## Intenções de Compreensão (leitura/análise)

| Quando o agente quer...                         | Ler primeiro          | Depois                        |
|-------------------------------------------------|-----------------------|-------------------------------|
| Entender o conceito X do zero                   | L3_[TOPIC]_OVERVIEW   | L1_chunks do domínio          |
| Verificar se pode aplicar equação Y             | [CHUNK_ID].hipóteses  | depends_on do chunk           |
| Comparar dois métodos alternativos              | L3_OVERVIEW           | chunks com relation=contradicts|

## Intenções de Implementação (geração de código)

| Quando o agente quer...                         | Ir direto para        | Verificar também              |
|-------------------------------------------------|-----------------------|-------------------------------|
| Implementar cálculo de X                        | L4_[RECIPE_ID]        | L1 referenciado na recipe     |
| Validar inputs antes de calcular                | L1_[CHUNK].hipóteses  | L4 recipe (seção Validação)   |
| Entender decisão de design no código            | L4_[RECIPE].decisões  | —                             |
| Adicionar novo caso especial a uma recipe       | L1_[CHUNK].casos_esp. | L4 recipe existente           |

## Intenções de Diagnóstico (debug/verificação)

| Quando o agente quer...                         | Consultar             |
|-------------------------------------------------|-----------------------|
| Entender por que resultado está errado          | L4 recipe → "Armadilhas" |
| Verificar se unidades estão corretas            | L1 chunk → tabela de símbolos |
| Confirmar ordem de operações                    | L1 chunk → Formulação |
```

### 6.3 tag_index.json

```json
{
  "by_domain": {
    "pile_foundation": ["CHUNK_ID_A", "CHUNK_ID_B", "RECIPE_ID_C"],
    "soil_mechanics":  ["CHUNK_ID_D"]
  },
  "by_language": {
    "csharp":     ["RECIPE_ID_C", "RECIPE_ID_E"],
    "python":     ["RECIPE_ID_F"]
  },
  "by_status": {
    "verified":   ["CHUNK_ID_A", "RECIPE_ID_C"],
    "draft":      ["CHUNK_ID_B"]
  },
  "by_type": {
    "formula":    ["CHUNK_ID_A"],
    "algorithm":  ["CHUNK_ID_B"],
    "recipe":     ["RECIPE_ID_C"]
  }
}
```

---

## 7. TEMPLATE: CHUNK L3 (VISÃO CONSOLIDADA)

```markdown
---
id: "[DOMAIN]_[TOPIC]_OVERVIEW"
type: overview
domain: ["domínio_primário"]
chunks_included:
  - "[CHUNK_ID_1]"
  - "[CHUNK_ID_2]"
  - "[CHUNK_ID_3]"
recipes_available:
  - "[RECIPE_ID_1]"
status: verified
last_updated: "YYYY-MM-DD"
---

# Visão Geral: [Nome do Tópico]

## O que é este tópico
[Parágrafo introdutório. Define o problema que o tópico resolve e por que é relevante no domínio.]

## Mapa do Tópico

```
[Conceito Fundamental A]
        │
        ├──► [Caso Especial B] ──► [Recipe: implementação de B]
        │
        └──► [Conceito Derivado C]
                    │
                    └──► [Conceito Derivado D] ──► [Recipe: implementação de D]
```

## Ordem de Estudo Recomendada

1. **[CHUNK_ID_1]** — fundamento necessário para todos os demais
2. **[CHUNK_ID_2]** — extensão do conceito 1 para caso geral
3. **[CHUNK_ID_3]** — caso especial com restrições adicionais
4. **[RECIPE_ID_1]** — implementação após compreender 1 e 2

## Síntese dos Conceitos

### [Nome do Conceito 1]
[2-3 frases resumindo o conceito e quando aplicar. Referência ao chunk completo: `[CHUNK_ID_1]`]

### [Nome do Conceito 2]
[2-3 frases resumindo. Referência: `[CHUNK_ID_2]`]

## Decisões Comuns no Domínio

| Situação                              | Decisão                         | Ver chunk        |
|---------------------------------------|---------------------------------|------------------|
| Estaca com seção variável             | Usar método Y em vez de X       | [CHUNK_ID_2]     |
| Dados de SPT disponíveis              | Correlação Z aplicável          | [CHUNK_ID_3]     |

## Armadilhas Globais do Tópico
> Erros que aparecem em múltiplos contextos dentro deste domínio.

- ⚠️ Confundir unidades entre kPa e MPa ao combinar equações de diferentes chunks
- ⚠️ Aplicar fórmula de estaca isolada para grupo sem correção de eficiência
- ⚠️ Ignorar hipóteses de validade ao extrapolar resultados

## Recipes Disponíveis

| Recipe                | Implementa          | Linguagem | Status    |
|-----------------------|---------------------|-----------|-----------|
| [RECIPE_ID_1]         | [CHUNK_ID_1,2]      | C#        | verified  |
| [RECIPE_ID_2]         | [CHUNK_ID_3]        | C#        | draft     |
```

---

## 8. TEMPLATE: CHUNK L4 (RECIPE DE IMPLEMENTAÇÃO)

```markdown
---
id: "[SOURCE]_[DOMAIN]_[TOPIC]_RECIPE"
type: recipe
language: csharp                      # linguagem principal
framework: maui                       # framework alvo, se aplicável
implements:
  - "[CHUNK_ID_1]"                    # conceitos L1 implementados
  - "[CHUNK_ID_2]"
depends_on_recipes:
  - "[RECIPE_ID_X]"                   # outras recipes necessárias (utilitários, etc.)
status: verified                      # draft | verified | deprecated
tested: true
last_updated: "YYYY-MM-DD"
---

# Recipe: [Nome da Funcionalidade]

## Propósito
> Uma frase: o que este código faz.
> Quando usar: cenário específico em que esta recipe se aplica.
> Quando NÃO usar: cenário que parece similar mas requer outra recipe.

**Usar quando:** [condição de aplicação]
**Não usar quando:** [condição de exclusão — referenciar recipe alternativa se existir]

## Conceitos Implementados
- `[CHUNK_ID_1]` — [qual parte do código implementa este conceito]
- `[CHUNK_ID_2]` — [qual parte]

## Contrato de Interface

### Inputs

| Parâmetro | Tipo    | Unidade | Obrigatório | Validação / Restrição         |
|-----------|---------|---------|-------------|-------------------------------|
| param1    | double  | kN      | Sim         | > 0                           |
| param2    | double  | m       | Sim         | 0.5 ≤ L ≤ 100                 |
| param3    | double  | —       | Não         | default = 0.5; 0.4 ≤ α ≤ 0.6 |

### Outputs

| Campo          | Tipo    | Unidade | Descrição                         |
|----------------|---------|---------|-----------------------------------|
| Result1        | double  | m       | Resultado principal                |
| IsValid        | bool    | —       | Resultado está dentro do esperado  |
| WarningMessage | string? | —       | null se sem aviso                  |
| Source         | string  | —       | Referência bibliográfica           |

## Código Completo

```csharp
// ============================================================
// [Nome da Funcionalidade]
// Implementa: [CHUNK_ID_1], [CHUNK_ID_2]
// Fonte: [Referência bibliográfica completa]
// ============================================================

public record [Topic]Input
{
    public required double Param1 { get; init; }    // [unidade] — [descrição]
    public required double Param2 { get; init; }    // [unidade] — [descrição]
    public double Param3 { get; init; } = 0.5;      // [unidade] — [descrição], default = 0.5

    public void Validate()
    {
        if (Param1 <= 0)
            throw new ArgumentException("Param1 deve ser > 0", nameof(Param1));
        if (Param2 is < 0.5 or > 100)
            throw new ArgumentOutOfRangeException(nameof(Param2), "0.5 ≤ Param2 ≤ 100");
        if (Param3 is < 0.4 or > 0.6)
            throw new ArgumentOutOfRangeException(nameof(Param3), "0.4 ≤ Param3 ≤ 0.6");
    }
}

public record [Topic]Result
{
    public required double Result1 { get; init; }
    public required bool   IsValid { get; init; }
    public string?         WarningMessage { get; init; }
    public string          Source { get; init; } = "[Autor, Eq. X.Y]";
}

public static class [Topic]Calculator
{
    /// <summary>
    /// [Descrição do método]
    /// Referência: [Autor, Cap.X, Eq.X.Y]
    /// </summary>
    public static [Topic]Result Calculate([Topic]Input input)
    {
        input.Validate();

        // [Comentário inline explicando o passo — referenciar equação]
        // Implementa Eq. X.Y de [CHUNK_ID_1]
        double result1 = (input.Param1 + input.Param3 * input.Param2)
                       * CONSTANTE
                       / OUTRO_FATOR;

        bool isValid = result1 < LIMIAR_PRATICO;
        string? warning = isValid ? null : "[Descrição do aviso quando fora do esperado]";

        return new [Topic]Result
        {
            Result1        = result1,
            IsValid        = isValid,
            WarningMessage = warning
        };
    }
}
```

## Decisões de Design

> Documentar POR QUÊ o código foi escrito assim — não o que faz (isso está no código).

| Decisão                              | Justificativa                                                   |
|--------------------------------------|-----------------------------------------------------------------|
| `record` para Input/Result           | Imutabilidade — parâmetros de cálculo não devem ser alterados   |
| `Validate()` dentro do record        | Centraliza restrições do modelo teórico perto dos dados         |
| `Source` no Result                   | Rastreabilidade: relatórios podem citar a equação automaticamente|
| Sem dependência de UI                | Testável isoladamente; reutilizável em MAUI, WPF, console       |

## Testes de Sanidade

> Valores esperados para confirmar que a implementação está correta.
> O agente pode usar estes valores para validação rápida.

```csharp
// Teste 1: caso base documentado na fonte (p. XXX)
// Input: Param1=XXX, Param2=YYY, Param3=ZZZ
// Esperado: Result1 ≈ WWW (±5%)
Assert.AreEqual(WWW, result.Result1, delta: WWW * 0.05);

// Teste 2: caso degenerado — input mínimo
// Param1=0.001 → Result1 → 0 (limite)

// Teste 3: validação de erro esperado
Assert.Throws<ArgumentException>(() =>
    [Topic]Calculator.Calculate(new [Topic]Input { Param1 = -1, Param2 = 10 }));
```

**Valores de referência conhecidos:**
| Cenário           | Param1 | Param2 | Resultado esperado | Fonte       |
|-------------------|--------|--------|--------------------|-------------|
| Caso típico       | 500    | 15     | ~0.0023 m          | p. 87       |
| Caso extremo      | 2000   | 30     | ~0.009 m           | Tabela 3.2  |

## Armadilhas Conhecidas

⚠️ **Unidades:** `Param2` deve estar em kPa — não MPa. Erro silencioso que gera resultado 1000x maior.

⚠️ **Combinação com outros resultados:** Ao somar com resultado de outra recipe, verificar que ambos estão na mesma unidade base antes de somar.

⚠️ **Caso de carga nula:** `Param1 = 0` é matematicamente válido mas fisicamente sem sentido neste contexto — adicionar aviso de negócio se necessário.

## Extensões Futuras Previstas

- [ ] Suporte a seção variável ao longo do fuste (ver [CHUNK_ID_VARIAVEL])
- [ ] Exportar resultado para relatório PDF automaticamente
- [ ] Versão assíncrona para uso em cálculo de grupo de estacas paralelo
```

---

## 9. TEMPLATE: INDEX MASTER

```markdown
---
file: INDEX_MASTER.md
version: "1.0"
domain: "[Nome do domínio desta KB]"
last_updated: "YYYY-MM-DD"
total_chunks: 0
total_recipes: 0
---

# Knowledge Base — [Nome do Projeto/Domínio]

> **Ponto de entrada obrigatório.** O agente deve sempre começar aqui antes de navegar qualquer outro arquivo.

---

## PROTOCOLO DE USO PARA O AGENTE

```
PASSO 1: Identificar intenção → Seção "Índice por Intenção"
PASSO 2: Seguir o caminho indicado (L3 Overview ou L4 Recipe diretamente)
PASSO 3: Ler chunks L1 dependentes conforme necessário
PASSO 4: Se ainda ambíguo → consultar dependency_graph.json
```

---

## ÍNDICE POR INTENÇÃO

### Quero entender um conceito
| Conceito / Tópico        | Iniciar em                         | Nível de complexidade |
|--------------------------|------------------------------------|-----------------------|
| [Tópico A]               | L3_compiled/[topico_a]/OVERVIEW.md | Básico                |
| [Tópico B]               | L3_compiled/[topico_b]/OVERVIEW.md | Intermediário         |
| [Tópico C]               | L1_chunks/[domínio]/[CHUNK_C].md   | Avançado              |

### Quero implementar algo em código
| O que implementar               | Recipe direta                             | Linguagem |
|---------------------------------|-------------------------------------------|-----------|
| [Funcionalidade X]              | L4_recipes/[domínio]/[RECIPE_X]_RECIPE.md | C#        |
| [Funcionalidade Y]              | L4_recipes/[domínio]/[RECIPE_Y]_RECIPE.md | C#        |

### Quero verificar/validar algo
| O que verificar                 | Consultar                                 |
|---------------------------------|-------------------------------------------|
| Hipóteses de validade de X      | L1_chunks/[domínio]/[CHUNK_X].md → seção "Hipóteses" |
| Unidades corretas para Y        | L1_chunks/[domínio]/[CHUNK_Y].md → tabela de símbolos |

---

## MAPA DE DOMÍNIOS

```
knowledge-base/
├── [domínio_1]/          → [Descrição em uma frase]
│   ├── [subdomínio_a]    → [N chunks, M recipes]
│   └── [subdomínio_b]    → [N chunks, M recipes]
└── [domínio_2]/          → [Descrição em uma frase]
    └── [subdomínio_c]    → [N chunks, M recipes]
```

---

## INVENTÁRIO COMPLETO

### Chunks L1 (Conceitos)

| ID | Título | Domínio | Status | Recipe disponível |
|----|--------|---------|--------|-------------------|
| [CHUNK_ID_A] | [Título] | [domínio] | verified | Sim — [RECIPE_ID] |
| [CHUNK_ID_B] | [Título] | [domínio] | draft    | Não               |

### Recipes L4

| ID | Título | Implementa | Linguagem | Status |
|----|--------|------------|-----------|--------|
| [RECIPE_ID_X] | [Título] | [CHUNK_IDs] | C# | verified |

---

## CONVENÇÕES RÁPIDAS

- **IDs:** `UPPER_SNAKE_CASE` — nunca mudam após criação
- **Unidades:** sempre declaradas na tabela de símbolos de cada chunk
- **Status `draft`:** pode conter imprecisões — verificar antes de usar em produção
- **Status `deprecated`:** não usar — ver campo `replaced_by` no frontmatter

---

## CHANGELOG RESUMIDO

| Data | Mudança |
|------|---------|
| YYYY-MM-DD | [Descrição da adição/correção] |
```

---

## 10. REGRAS DE QUALIDADE E VALIDAÇÃO

### 10.1 Checklist Obrigatório — Chunk L1

Antes de marcar um chunk como `verified`, o agente deve confirmar:

- [ ] O chunk tem ID único, semântico e em UPPER_SNAKE_CASE
- [ ] O frontmatter está completo (todos os campos preenchidos)
- [ ] O campo `depends_on` lista TODOS os conceitos necessários para compreender este
- [ ] Hipóteses de validade estão listadas como checklist
- [ ] Restrições explícitas (quando NÃO usar) estão presentes
- [ ] Todos os símbolos da equação têm unidade declarada na tabela
- [ ] A referência direta cita página, capítulo e equação exatos
- [ ] O chunk é autocontido: não precisa de outro arquivo para ser compreendido

### 10.2 Checklist Obrigatório — Recipe L4

- [ ] O campo `implements` referencia pelo menos um chunk L1 válido
- [ ] Todos os inputs têm tipo, unidade e validação declarados
- [ ] O método `Validate()` lança exceções para todos os inputs inválidos
- [ ] Testes de sanidade têm valores numéricos de referência com fonte
- [ ] Decisões de design estão documentadas (o "por quê", não o "o quê")
- [ ] Seção "Armadilhas" tem pelo menos uma entrada
- [ ] O código compila sem dependências externas não declaradas
- [ ] Comentários inline referenciam a equação/chunk correspondente

### 10.3 Regras de Consistência do Grafo

- Todo `depends_on` de um chunk A deve corresponder a um nó existente no grafo
- Todo `used_by` de um chunk A deve ser bidirecional (B tem A em seu `depends_on`)
- Nenhum chunk pode ter dependência circular
- Toda recipe em `L4_recipes/` deve aparecer no `tag_index.json`
- O `INDEX_MASTER.md` deve ser atualizado a cada novo chunk ou recipe adicionado

---

## 11. PROTOCOLO DE EXTRAÇÃO PASSO A PASSO

> Este é o roteiro que o agente deve seguir ao processar uma fonte nova.

### FASE 1 — Reconhecimento (antes de escrever qualquer chunk)

```
1.1  Ler o sumário/índice completo da fonte
1.2  Identificar todos os domínios e subdomínios presentes
1.3  Listar os conceitos fundamentais (que nada dependem)
1.4  Listar os conceitos derivados e suas dependências
1.5  Identificar quais conceitos têm implementação em código prevista
1.6  Registrar este mapa em um rascunho antes de criar qualquer arquivo
```

**Output da Fase 1:** Rascunho do grafo de dependências e lista de IDs planejados.

### FASE 2 — Extração de Conceitos Fundamentais (bottom-up)

```
2.1  Começar pelos conceitos que não dependem de nenhum outro (folhas do grafo)
2.2  Para cada conceito:
     a. Identificar a definição formal na fonte
     b. Identificar todas as equações/fórmulas
     c. Identificar hipóteses de validade
     d. Identificar casos especiais
     e. Identificar restrições e armadilhas mencionadas (implicitamente ou não)
2.3  Preencher o template L1 completamente
2.4  Não passar para o próximo conceito enquanto o atual não estiver verificado
```

### FASE 3 — Extração de Conceitos Derivados

```
3.1  Seguir a ordem do grafo (dependências satisfeitas antes do derivado)
3.2  Para cada conceito derivado, verificar que todos os depends_on existem
3.3  Preencher o campo used_by nos chunks dos quais este depende
3.4  Repetir até cobrir todos os conceitos identificados na Fase 1
```

### FASE 4 — Criação de Recipes (se aplicável)

```
4.1  Para cada conceito com implementação prevista, criar recipe L4
4.2  A recipe deve referenciar os chunks L1 exatos que implementa
4.3  Código deve ter comments inline apontando para o chunk/equação
4.4  Preencher testes de sanidade com valores numéricos da fonte
4.5  Documentar decisões de design e armadilhas
```

### FASE 5 — Compilação (L3 e L2)

```
5.1  Criar L3 Overview para cada domínio/subdomínio com 3+ chunks
5.2  Atualizar dependency_graph.json com todos os nós e arestas
5.3  Atualizar tag_index.json
5.4  Criar/atualizar intent_index.md com os novos chunks e recipes
5.5  Atualizar INDEX_MASTER.md — inventário e índice por intenção
5.6  Adicionar entrada no CHANGELOG.md
```

### FASE 6 — Validação Final

```
6.1  Percorrer cada chunk e aplicar checklist 10.1
6.2  Percorrer cada recipe e aplicar checklist 10.2
6.3  Verificar consistência do grafo (regras 10.3)
6.4  Simular uma consulta de agente: escolher uma intenção do intent_index
     e navegar do INDEX_MASTER até a recipe — o caminho deve ser sem ambiguidade
6.5  Marcar status como "verified" apenas após a validação completa
```

---

## 12. PROTOCOLO DE CONSULTA PELO AGENTE

> Este é o roteiro que o agente deve seguir ao receber uma tarefa que requer consultar a KB.

```
TAREFA RECEBIDA
     │
     ▼
[1] Abrir INDEX_MASTER.md
     │
     ├─► Qual é a intenção?
     │       ├─ Entender conceito  ──► Ir para L3 Overview do domínio
     │       ├─ Implementar código ──► Ir direto para L4 Recipe
     │       └─ Verificar/validar  ──► Ir para L1 chunk → seção específica
     │
     ▼
[2] Ler o arquivo indicado
     │
     ├─► Se L3 Overview:
     │       └─ Ler overview, identificar chunks relevantes, ler chunks L1 na ordem indicada
     │
     ├─► Se L4 Recipe:
     │       └─ Ler recipe completa
     │           └─ Se precisar entender o conceito por trás → ler chunks L1 em "implements"
     │
     └─► Se L1 Chunk:
             └─ Verificar "depends_on" — ler pré-requisitos se necessário
     │
     ▼
[3] Antes de gerar código ou conclusão, confirmar:
     ├─ As hipóteses de validade do conceito estão satisfeitas?
     ├─ As unidades de todos os parâmetros estão corretas?
     ├─ Há armadilhas conhecidas que se aplicam ao caso atual?
     └─ O chunk referencia uma recipe já existente que pode ser reutilizada?
     │
     ▼
[4] Gerar output com rastreabilidade:
     └─ Citar explicitamente os IDs dos chunks e recipes usados
        (permite que o humano verifique a origem de cada decisão)
```

---

## 13. EXEMPLOS COMPLETOS ANOTADOS

### 13.1 Exemplo: Chunk L1 Bem Formado

```markdown
---
id: "CINTRA_PILE_ELASTIC_SHORTENING"
type: formula
source:
  title: "Fundações por Estacas — Projeto Geotécnico"
  author: "Cintra, J.C.A.; Aoki, N."
  chapter: "Capítulo 3 — Recalques de Estacas"
  section: "3.2 Recalque Elástico da Estaca"
  page: "p. 87-89"
  equation: "Eq. 3.14"
domain: ["pile_foundation", "geotechnique"]
tags: ["settlement", "elastic", "axial_load"]
depends_on:
  - "CINTRA_PILE_LOAD_CAPACITY"
  - "ELASTIC_THEORY_HOOKS_LAW"
used_by:
  - "CINTRA_PILE_TOTAL_SETTLEMENT"
confidence: high
status: verified
last_updated: "2024-11-15"
---

## Recalque por Encurtamento Elástico da Estaca

### Contexto
Componente do recalque imediato em estacas axialmente carregadas.
Representa a deformação elástica do próprio fuste, separada do recalque
do solo de ponta. É a primeira parcela calculada na análise de recalques.

### Formulação Matemática

```
ρ_e = (Q_p + α · Q_s) · L / (A_p · E_p)
```

| Símbolo | Significado            | Unidade | Observação                      |
|---------|------------------------|---------|----------------------------------|
| ρ_e     | Recalque elástico      | m       | resultado positivo = compressão  |
| Q_p     | Carga na ponta         | kN      | ≥ 0                              |
| Q_s     | Carga por atrito lat.  | kN      | ≥ 0                              |
| α       | Fator de distribuição  | —       | depende do perfil de atrito      |
| L       | Comprimento da estaca  | m       | comprimento total                |
| A_p     | Área da seção          | m²      | seção transversal constante      |
| E_p     | Módulo de elasticidade | kPa     | ⚠️ kPa, não MPa                 |

### Hipóteses e Validade
- [ ] Q < Q_ult / FS (regime elástico)
- [ ] Seção constante ao longo do fuste
- [ ] Material homogêneo (E_p constante)
- [ ] Carregamento axial (sem momento)

### Casos Especiais — Valor de α

| Perfil de atrito lateral              | α     |
|---------------------------------------|-------|
| Uniforme ao longo do fuste            | 0.500 |
| Concentrado na ponta (sem atrito)     | 0.000 |
| Triangular crescente para a ponta     | 0.667 |
| Triangular decrescente para a ponta   | 0.333 |

### Restrições Explícitas
⚠️ NÃO aplicar quando:
- Estaca com variação de seção (usar integração numérica)
- Carregamento cíclico ou dinâmico
- Q > Q_serviço (ultrapassou o regime elástico)

### Referência Direta
"O encurtamento elástico da estaca é calculado considerando a distribuição
do atrito lateral ao longo do fuste através do fator α." — Cintra & Aoki, p. 88
```

**Anotações:** ✅ Autocontido | ✅ Todas as unidades declaradas | ✅ Hipóteses como checklist | ✅ Casos especiais com tabela | ✅ Restrições explícitas

---

### 13.2 Exemplo: O Que NÃO Fazer

```markdown
# EXEMPLO RUIM — NÃO SEGUIR

---
id: chunk_003
type: formula
domain: geotecnia
---

## Recalque Elástico

A fórmula é: ρ_e = (Qp + α·Qs)·L / (Ap·Ep)

Ver tabela 3.2 para α. Cuidado com as unidades.
```

**Problemas:** ❌ ID não semântico | ❌ Frontmatter incompleto | ❌ Nenhuma unidade declarada | ❌ "Ver tabela 3.2" quebra o princípio de autocontido | ❌ "Cuidado com as unidades" é vago — qual unidade? | ❌ Sem hipóteses, sem restrições, sem referência

---

## 14. ERROS COMUNS E COMO EVITÁ-LOS

| Erro | Sintoma | Correção |
|------|---------|----------|
| **Chunk não autocontido** | Agente precisa abrir outro arquivo para entender o chunk | Incluir contexto mínimo inline; não usar "ver seção X" |
| **ID instável** | Renomear chunk quebra referências no grafo | Definir IDs semânticos na Fase 1 e nunca mais alterar |
| **Unidades omitidas** | Bug silencioso no código (resultado 1000x errado) | Todo símbolo tem unidade na tabela — sem exceção |
| **Hipóteses implícitas** | Agente aplica equação fora do domínio de validade | Listar hipóteses como checklist explícito |
| **Recipe sem testes de sanidade** | Código com bug passa despercebido | Todo recipe tem ≥ 2 valores numéricos de referência |
| **Grafo sem bidirecionalidade** | `used_by` de A não corresponde ao `depends_on` de B | Ao adicionar dependência, atualizar os dois lados |
| **INDEX_MASTER desatualizado** | Agente não encontra chunks novos | Atualizar index como última etapa de cada sessão de extração |
| **Teoria misturada com código** | Chunk tenta ser L1 e L4 ao mesmo tempo | Separar: L1 só teoria, L4 só código — ligados pelo grafo |
| **Status `verified` prematuro** | Erros chegam ao agente como verdades | Aplicar checklist 10.1/10.2 antes de marcar verified |
| **Armadilhas não documentadas** | Agente reproduz erro documentado na literatura | Seção "Armadilhas" é obrigatória — não é opcional |

---

*KES v1.0 — Knowledge Extraction Standard*
*Revisar e versionar este documento junto com a base de conhecimento.*