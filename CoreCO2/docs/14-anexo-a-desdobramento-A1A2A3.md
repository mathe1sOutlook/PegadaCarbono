# 15. Anexo A — Desdobramento da emissão de CO₂ nas etapas A1, A2 e A3

*(Fonte: Boletim Técnico IBRACON/ABECE/ABCIC — CT 101)*

As equações a seguir apresentam como realizar o cálculo do indicador da emissão de CO₂ do estágio de produto, para cada etapa do ciclo de vida separadamente.

## A.1. Emissão total do estágio de produto

```
C_A1→A3 = C_A1 + C_A2 + C_A3     (Equação 44)
```

## A.2. Etapa A1 — Produção das matérias-primas

```
C_A1 = C_mp(A1) + C_elet,A1     (Equação 45)
```

```
C_mp(A1) = Σ (q'_mp(i,A3) × e_mp(i,A1))     (Equação 46)
```

Onde:
- **C_A1→A3:** emissão de CO₂ do material do berço ao portão da fábrica (kg CO₂/UF)
- **C_A1:** emissão de CO₂ associada aos processos a montante de fabricação de materiais processados (sem perdas) e geração externa de energia elétrica (kg CO₂/UF)
- **C_mp(A1):** emissão de CO₂ associada à fabricação de materiais processados (kg CO₂/UF)
- **q'_mp(i,A3):** quantidade do material processado "i" consumida no processo de fabricação (etapa A3), **sem perdas** (UD/UF)
- **e_mp(i,A1):** fator de emissão de CO₂ do material processado "i" referente à sua produção (etapa A1¹) (kg CO₂/UD)

> ¹ Etapa A1 na perspectiva do fabricante de um produto de construção que consome o material processado no seu processo de produção; na perspectiva do fornecedor de material processado, seriam as etapas A1-A3.

## A.3. Etapa A1 — Geração de eletricidade

```
C_elet,A1 = q_elet,A3 × e_elet,g     (Equação 47)
```

Onde:
- **C_elet,A1:** emissão de CO₂ da etapa de fabricação devida à geração externa de energia elétrica consumida na fábrica (kg CO₂/UF)
- **q_elet,A3:** quantidade de energia elétrica consumida no processo de fabricação (etapa A3) (kWh/UF ou UD)
- **e_elet,g:** fator de emissão de CO₂ da energia elétrica gerada externamente (kg CO₂/kWh)

## A.4. Etapa A2 — Transporte de todos os insumos

```
C_A2 = Σ (q'_i,A3 × m_i/1000 × d_t,i × e_t,i)     (Equação 48)
```

Onde:
- **C_A2:** emissão de CO₂ do estágio de produto devida ao transporte de todos os insumos (kg CO₂/UF), **sem perdas**
- **q'_i,A3:** quantidade do insumo transportado "i" consumida no processo de fabricação (etapa A3), **sem perdas** (UD/UF). Insumos transportados incluem recursos materiais, materiais processados, combustíveis e água (no caso de água de caminhão-pipa)
- **m_i:** fator de conversão em massa do item "i" (kg/UD)
- **d_t,i:** distância de transporte do item "i" (km)
- **e_t,i:** fator de emissão de CO₂ do modo de transporte adotado para o item "i" (kg CO₂/t.km)

## A.5. Etapa A3 — Fabricação

```
C_A3 = C_comb(A3) + C_calc,A3 + C_perdas(A3) + C_transp,res(A3)     (Equação 49)
```

### A.5.1. Emissão devida aos combustíveis

```
C_comb(A3) = Σ (q_comb(i,A3) × e_comb,i)     (Equação 50)
```

Onde:
- **C_A3:** emissão de CO₂ associada ao processo de fabricação (kg CO₂/UF)
- **C_comb(A3):** emissão de CO₂ da etapa de fabricação devida aos combustíveis utilizados no processo (kg CO₂/UF)
- **q_comb(i,A3):** quantidade unitária do combustível "i" consumida no processo de fabricação (UD/UF)
- **e_comb,i:** fator de emissão de CO₂ do combustível "i" (kg CO₂/UD)

### A.5.2. Emissão devida à calcinação

```
C_calc,A3 = Σ (q_carb(i,A3) × e_calc,i)     (Equação 51)
```

Onde:
- **C_calc,A3:** emissão de CO₂ da etapa de fabricação devida à calcinação (kg CO₂/UF)
- **q_carb(i,A3):** quantidade unitária do carbonato "i" consumida e decomposta no processo de fabricação (UD/UF)
- **e_calc,i:** fator de emissão de CO₂ da calcinação do carbonato "i" (kg CO₂/UD)

### A.5.3. Emissão devida às perdas de material

```
C_perdas(A3) = C_A1(A3,desp) + C_A2(A3,desp) + C_A3(C3-C4)     (Equação 52)
```

```
C_A1(A3,desp) = Σ (q^d_mp(i,A3) × e_mp(i,A1→A3))     (Equação 53)
```

Onde:
- **C_perdas(A3):** emissão de CO₂ associada às perdas de material no processo de fabricação (kg CO₂/UF)
- **C_A1(A3,desp):** emissão de CO₂ associada à fabricação dos materiais processados desperdiçados no processo de fabricação (kg CO₂/UF)
- **q^d_mp(i,A3):** quantidade unitária do material processado "i" desperdiçada no processo de fabricação (etapa A3) (UD/UF)
- **e_mp(i,A1→A3):** fator de emissão de CO₂ do material processado, do berço ao portão da fábrica (kg CO₂/UD)

### A.5.4. Emissão devida ao transporte dos materiais desperdiçados

```
C_A2(A3,desp) = Σ (q^d_mp(i,A3) × m_i/1000 × d_t,i × e_t,i)     (Equação 54)
```

Onde:
- **C_A2(A3,desp):** emissão de CO₂ associada ao transporte dos materiais desperdiçados no processo de fabricação (kg CO₂/UF)
- **q^d_mp(i,A3):** quantidade unitária do material "i" (recurso material ou material processado) desperdiçada no processo de fabricação (etapa A3) (UD/UF)

### A.5.5. Emissão devida ao transporte e disposição dos resíduos

```
C_transp,res(A3) = Σ (q_res(i,A3) × m_i/1000 × d_r,i × e_t,i)     (Equação 54*)
```

```
C_A3(C3-C4) = Σ (q_res(i,A3) × e_res(i,C3-C4))     (Equação 55)
```

Onde:
- **C_transp,res(A3):** emissão de CO₂ associada ao transporte dos resíduos decorrentes de materiais desperdiçados no processo de fabricação até seu local de disposição final (kg CO₂/UF)
- **q_res(i,A3):** quantidade do resíduo "i" gerada no processo de fabricação (UD/UF)
- **d_r,i:** distância de transporte do resíduo "i" até seu local de destinação (km)
- **C_A3(C3-C4):** emissão de CO₂ do estágio de produto devida à disposição dos resíduos gerados no processo de fabricação (kg CO₂/UF)
- **e_res(i,C3-C4):** fator de emissão de CO₂ referente à disposição do resíduo "i" (kg CO₂/UD)

*(p. 69-71 do documento)*
