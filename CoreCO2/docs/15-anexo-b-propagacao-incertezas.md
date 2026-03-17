# 16. Anexo B — Procedimento alternativo para propagação de incertezas

*(Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101)*

O procedimento simplificado indicado neste documento recomenda o cálculo dos valores extremos do indicador de emissão de CO₂, considerando valores mínimos e máximos para as quantidades dos insumos e para os seus respectivos fatores de emissão de CO₂. Entretanto, por vezes, tal procedimento pode resultar em uma faixa excessivamente ampla para o indicador de CO₂ — vale lembrar que a probabilidade de que todos os fatores utilizados no cálculo assumam simultaneamente seu valor mínimo ou seu valor máximo costuma ser muito baixa.

Sendo assim, a seguir, apresenta-se um procedimento alternativo para propagação de incertezas, baseado na expansão de série de Taylor de 1ª ordem¹. As equações a seguir descrevem a propagação de incerteza considerando apenas a variação do fator de emissão de CO₂, ou seja, as quantidades de cada item são fixas (sem variação).

## Equação 57 — Estimativa central da emissão de CO₂

```
C̄ = Σ (q_i × ē_i)     (Equação 57)
```

## Equação 58 — Desvio padrão da emissão de CO₂

```
dp(C) = √(Σ (q_i² × dp(e_i)²))     (Equação 58)
```

Onde:
- **C̄:** estimativa central da emissão de CO₂ do material ou estrutura (kg CO₂/UF)
- **q_i:** quantidade do item "i" no material ou estrutura (UD/UF)
- **ē_i:** estimativa central do fator de emissão de CO₂ do item "i" (kg CO₂/UD)
- **dp(C):** desvio padrão da emissão de CO₂ do material ou estrutura
- **dp(e_i):** desvio padrão do fator de emissão de CO₂ do item "i"

## Observações

Observe-se que este procedimento exige que se conheça uma estimativa central para o fator de emissão de CO₂ dos produtos².

> ¹ Mesmo procedimento adotado pelo Sidac para cálculo das faixas dos indicadores de desempenho ambiental.
>
> ² O Sidac não informa a estimativa central dos indicadores de desempenho ambiental para evitar que esse valor seja confundido com um valor padrão; entretanto, é possível realizar a propagação de incertezas conforme apresentada neste Anexo se utilizar a funcionalidade de "calculadora de produto", disponível gradativamente no site do Sidac.

*(p. 71 do documento)*
