---
id: "CT101_A1A2A3_SPLIT"
type: formula
source:
  title: "Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto"
  author: "IBRACON/ABECE/ABCIC — CT 101"
  chapter: "Anexo A"
  section: "A.1-A.5"
  page: "p. 69-71"
  equation: "Eq. 44-55"
domain: ["co2_emissions", "lifecycle_stages"]
tags: ["A1", "A2", "A3", "split", "annex_a"]
depends_on:
  - "CT101_PRODUCT_STAGE_A1A3"
  - "CT101_COMBUSTION_EMISSION"
  - "CT101_CALCINATION_EMISSION"
  - "CT101_TRANSPORT_FORMULA"
used_by: []
confidence: high
status: verified
last_updated: "2025-03-05"
---

## Desdobramento A1/A2/A3 (Anexo A)

### Contexto
O Anexo A detalha como separar o estágio de produto em módulos individuais A1, A2 e A3. Útil para fabricantes que precisam identificar hotspots dentro da cadeia produtiva.

### Formulação Matemática

```
C_A1-A3 = C_A1 + C_A2 + C_A3     (Eq. 44)
```

**A1 — Produção de matérias-primas:**
```
C_A1 = C_mp(A1) + C_elet,A1                     (Eq. 45)
C_mp(A1) = Σ (q'_mp(i,A3) × e_mp(i,A1))        (Eq. 46)
C_elet,A1 = q_elet,A3 × e_elet,g                (Eq. 47)
```

**A2 — Transporte de insumos (sem perdas):**
```
C_A2 = Σ (q'_i,A3 × m_i/1000 × d_t,i × e_t,i)  (Eq. 48)
```

**A3 — Fabricação:**
```
C_A3 = C_comb(A3) + C_calc,A3 + C_perdas(A3) + C_transp,res(A3)  (Eq. 49)
C_comb(A3) = Σ (q_comb(i,A3) × e_comb,i)                         (Eq. 50)
C_calc,A3 = Σ (q_carb(i,A3) × e_calc,i)                          (Eq. 51)
C_perdas(A3) = C_A1(A3,desp) + C_A2(A3,desp) + C_A3(C3-C4)      (Eq. 52)
C_A1(A3,desp) = Σ (q^d_mp(i,A3) × e_mp(i,A1-A3))               (Eq. 53)
C_A2(A3,desp) = Σ (q^d_mp(i,A3) × m_i/1000 × d_t,i × e_t,i)   (Eq. 54)
C_transp,res(A3) = Σ (q_res(i,A3) × m_i/1000 × d_r,i × e_t,i)  (Eq. 54*)
C_A3(C3-C4) = Σ (q_res(i,A3) × e_res(i,C3-C4))                 (Eq. 55)
```

### Onde vai cada componente

| Componente | Módulo | Observação |
|------------|--------|------------|
| Materiais processados (sem perdas) | A1 | e_mp(i,A1) |
| Eletricidade da rede | A1 | Geração externa |
| Transporte de insumos (sem perdas) | A2 | — |
| Combustíveis na fábrica | A3 | Emissão direta |
| Calcinação | A3 | Emissão direta |
| Materiais das perdas (fabricação) | A3 | Via Eq. 53 |
| Transporte das perdas | A3 | Via Eq. 54 |
| Transporte de resíduos | A3 | Via Eq. 54* |
| Disposição de resíduos | A3 | Via Eq. 55 |

### Hipóteses e Validade
- [ ] Quantidades SEM perdas (q') vão para A1 e A2
- [ ] Quantidades de PERDAS (q^d) vão para A3
- [ ] Eletricidade gerada na rede → A1 (processo a montante)
- [ ] Combustão na fábrica → A3 (processo interno)

### Referência Direta
"As equações a seguir apresentam como realizar o cálculo do indicador da emissão de CO₂ do estágio de produto, para cada etapa separadamente." — CT 101, p. 69
