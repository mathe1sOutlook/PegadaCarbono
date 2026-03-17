import { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  Hash,
  FileText,
  Ruler,
  ArrowRight,
  Zap,
  FlaskConical,
} from 'lucide-react';
import {
  fuelFactors,
  carbonateFactors,
  transportFactors,
  materialFactors,
  electricityFactor,
  concreteRecipes,
  lifeCycleStages,
} from '../data/emissionFactors';

// ===========================================================================
// Types
// ===========================================================================

interface CollapsibleState {
  [key: string]: boolean;
}

interface EquationVar {
  simbolo: string;
  descricao: string;
}

interface Equation {
  id: number;
  grupo: string;
  formula: string;
  descricao: string;
  variaveis: EquationVar[];
}

// ===========================================================================
// Hardcoded data: Quadro 2 - Composição dos cimentos Portland brasileiros
// ===========================================================================

const CEMENT_COMPOSITION = [
  { cimento: 'CP I', clinquer: '95–100', escoria: '–', pozolana: '–', calcario: '–', filer: '0–5' },
  { cimento: 'CP I-S', clinquer: '90–94', escoria: '–', pozolana: '–', calcario: '–', filer: '6–10' },
  { cimento: 'CP II-E', clinquer: '51–94', escoria: '6–34', pozolana: '–', calcario: '–', filer: '0–15' },
  { cimento: 'CP II-Z', clinquer: '71–94', escoria: '–', pozolana: '6–14', calcario: '–', filer: '0–15' },
  { cimento: 'CP II-F', clinquer: '75–89', escoria: '–', pozolana: '–', calcario: '11–25', filer: '–' },
  { cimento: 'CP III', clinquer: '25–65', escoria: '35–75', pozolana: '–', calcario: '–', filer: '0–10' },
  { cimento: 'CP IV', clinquer: '45–85', escoria: '–', pozolana: '15–50', calcario: '–', filer: '0–10' },
  { cimento: 'CP V', clinquer: '90–100', escoria: '–', pozolana: '–', calcario: '–', filer: '0–10' },
];

// ===========================================================================
// Hardcoded data: Quadro 3 - Valores típicos de emissão por tipo de cimento
// ===========================================================================

const CEMENT_EMISSION_VALUES = [
  { cimento: 'CP I', faixaMin: 800, faixaMax: 900, medio: 850 },
  { cimento: 'CP II-E', faixaMin: 400, faixaMax: 600, medio: 500 },
  { cimento: 'CP II-Z', faixaMin: 450, faixaMax: 650, medio: 550 },
  { cimento: 'CP II-F', faixaMin: 600, faixaMax: 750, medio: 675 },
  { cimento: 'CP III', faixaMin: 300, faixaMax: 500, medio: 400 },
  { cimento: 'CP IV', faixaMin: 350, faixaMax: 550, medio: 450 },
  { cimento: 'CP V ARI', faixaMin: 700, faixaMax: 850, medio: 775 },
];

// ===========================================================================
// Equations data (All 43)
// ===========================================================================

const EQUATIONS: Equation[] = [
  // --- Módulo A1 - Produção de clínquer ---
  {
    id: 1, grupo: 'Módulo A1 — Produção de clínquer',
    formula: 'CO₂_calc = Σ(M_ite × fe_CO₂,ite)',
    descricao: 'Emissão pela calcinação das matérias-primas',
    variaveis: [
      { simbolo: 'M_ite', descricao: 'massa da matéria-prima i (t)' },
      { simbolo: 'fe_CO₂,ite', descricao: 'fator de emissão do carbonato i (t CO₂/t)' },
    ],
  },
  {
    id: 2, grupo: 'Módulo A1 — Produção de clínquer',
    formula: 'CO₂_comb = Σ(Qc_i × fe_CO₂,i)',
    descricao: 'Emissão pela queima de combustíveis',
    variaveis: [
      { simbolo: 'Qc_i', descricao: 'quantidade do combustível i consumido' },
      { simbolo: 'fe_CO₂,i', descricao: 'fator de emissão do combustível i' },
    ],
  },
  {
    id: 3, grupo: 'Módulo A1 — Produção de clínquer',
    formula: 'CO₂_ee = CEE × fe_ee',
    descricao: 'Emissão pela energia elétrica consumida',
    variaveis: [
      { simbolo: 'CEE', descricao: 'consumo de energia elétrica (kWh)' },
      { simbolo: 'fe_ee', descricao: 'fator de emissão da eletricidade (kg CO₂/kWh)' },
    ],
  },
  {
    id: 4, grupo: 'Módulo A1 — Produção de clínquer',
    formula: 'CO₂_A1,clínquer = CO₂_calc + CO₂_comb + CO₂_ee',
    descricao: 'Total A1 para clínquer',
    variaveis: [],
  },
  // --- Módulo A1 - Produção de cimento ---
  {
    id: 5, grupo: 'Módulo A1 — Produção de cimento',
    formula: 'CO₂_A1,cimento = CO₂_A1,clínquer × %clínquer + CO₂_adições',
    descricao: 'Emissão A1 do cimento',
    variaveis: [
      { simbolo: '%clínquer', descricao: 'proporção de clínquer no cimento' },
    ],
  },
  {
    id: 6, grupo: 'Módulo A1 — Produção de cimento',
    formula: 'CO₂_A1,cimento = fe_cimento × M_cimento',
    descricao: 'Forma simplificada',
    variaveis: [
      { simbolo: 'fe_cimento', descricao: 'fator de emissão do cimento (kg CO₂/t)' },
      { simbolo: 'M_cimento', descricao: 'massa de cimento (t)' },
    ],
  },
  // --- Módulo A1 - Outros materiais ---
  {
    id: 7, grupo: 'Módulo A1 — Outros materiais',
    formula: 'CO₂_A1,areia = fe_areia × M_areia',
    descricao: 'Emissão da areia',
    variaveis: [],
  },
  {
    id: 8, grupo: 'Módulo A1 — Outros materiais',
    formula: 'CO₂_A1,brita = fe_brita × M_brita',
    descricao: 'Emissão da brita',
    variaveis: [],
  },
  {
    id: 9, grupo: 'Módulo A1 — Outros materiais',
    formula: 'CO₂_A1,aço = fe_aço × M_aço',
    descricao: 'Emissão do aço',
    variaveis: [],
  },
  {
    id: 10, grupo: 'Módulo A1 — Outros materiais',
    formula: 'CO₂_A1,aditivo = fe_aditivo × M_aditivo',
    descricao: 'Emissão dos aditivos',
    variaveis: [],
  },
  {
    id: 11, grupo: 'Módulo A1 — Outros materiais',
    formula: 'CO₂_A1,água = fe_água × M_água',
    descricao: 'Emissão da água',
    variaveis: [],
  },
  // --- Módulo A2 ---
  {
    id: 12, grupo: 'Módulo A2 — Transporte de matérias-primas',
    formula: 'CO₂_A2,i = M_i × d_i × fe_transp,i / 1000',
    descricao: 'Emissão do transporte do material i',
    variaveis: [
      { simbolo: 'M_i', descricao: 'massa do material i (t)' },
      { simbolo: 'd_i', descricao: 'distância de transporte (km)' },
      { simbolo: 'fe_transp,i', descricao: 'fator de emissão do transporte (kg CO₂/(t·km))' },
    ],
  },
  {
    id: 13, grupo: 'Módulo A2 — Transporte de matérias-primas',
    formula: 'CO₂_A2 = Σ CO₂_A2,i',
    descricao: 'Total A2',
    variaveis: [],
  },
  // --- Módulo A3 ---
  {
    id: 14, grupo: 'Módulo A3 — Fabricação do concreto',
    formula: 'CO₂_A3,mistura = CEE_mistura × fe_ee',
    descricao: 'Emissão pela misturação',
    variaveis: [],
  },
  {
    id: 15, grupo: 'Módulo A3 — Fabricação do concreto',
    formula: 'CO₂_A3,bombeamento = CEE_bomb × fe_ee',
    descricao: 'Emissão pelo bombeamento',
    variaveis: [],
  },
  {
    id: 16, grupo: 'Módulo A3 — Fabricação do concreto',
    formula: 'CO₂_A3 = CO₂_A3,mistura + CO₂_A3,bombeamento',
    descricao: 'Total A3',
    variaveis: [],
  },
  // --- Total concreto A1-A3 ---
  {
    id: 17, grupo: 'Total do concreto (A1–A3)',
    formula: 'CO₂_concreto = CO₂_A1 + CO₂_A2 + CO₂_A3',
    descricao: 'Total por m³ de concreto',
    variaveis: [],
  },
  {
    id: 18, grupo: 'Total do concreto (A1–A3)',
    formula: 'CO₂_A1 = CO₂_A1,cimento + CO₂_A1,areia + CO₂_A1,brita + CO₂_A1,aditivo + CO₂_A1,água',
    descricao: 'Total A1',
    variaveis: [],
  },
  // --- Módulo A4 ---
  {
    id: 19, grupo: 'Módulo A4 — Transporte à obra',
    formula: 'CO₂_A4,concreto = V_conc × ρ_conc × d_obra × fe_transp / 1000',
    descricao: 'Transporte do concreto',
    variaveis: [
      { simbolo: 'V_conc', descricao: 'volume de concreto (m³)' },
      { simbolo: 'ρ_conc', descricao: 'massa específica do concreto (~2400 kg/m³)' },
      { simbolo: 'd_obra', descricao: 'distância até a obra (km)' },
    ],
  },
  {
    id: 20, grupo: 'Módulo A4 — Transporte à obra',
    formula: 'CO₂_A4,aço = M_aço × d_obra,aço × fe_transp / 1000',
    descricao: 'Transporte do aço',
    variaveis: [],
  },
  {
    id: 21, grupo: 'Módulo A4 — Transporte à obra',
    formula: 'CO₂_A4 = CO₂_A4,concreto + CO₂_A4,aço',
    descricao: 'Total A4',
    variaveis: [],
  },
  // --- Módulo A5 ---
  {
    id: 22, grupo: 'Módulo A5 — Construção',
    formula: 'CO₂_A5,perdas = CO₂_concreto × %perdas_conc + CO₂_aço × %perdas_aço',
    descricao: 'Emissão pelas perdas',
    variaveis: [
      { simbolo: '%perdas_conc', descricao: 'percentual de perdas de concreto' },
      { simbolo: '%perdas_aço', descricao: 'percentual de perdas de aço' },
    ],
  },
  {
    id: 23, grupo: 'Módulo A5 — Construção',
    formula: 'CO₂_A5,equip = CEE_equip × fe_ee',
    descricao: 'Emissão dos equipamentos',
    variaveis: [],
  },
  {
    id: 24, grupo: 'Módulo A5 — Construção',
    formula: 'CO₂_A5 = CO₂_A5,perdas + CO₂_A5,equip',
    descricao: 'Total A5',
    variaveis: [],
  },
  // --- Total estrutura A1-A5 ---
  {
    id: 25, grupo: 'Total da estrutura (A1–A5)',
    formula: 'CO₂_estrutura = CO₂_concreto + CO₂_aço + CO₂_A4 + CO₂_A5',
    descricao: 'Total incorporado',
    variaveis: [],
  },
  // --- Indicadores ---
  {
    id: 26, grupo: 'Indicadores',
    formula: 'IC_m³ = CO₂_estrutura / V_total',
    descricao: 'Intensidade de carbono por m³ de concreto',
    variaveis: [],
  },
  {
    id: 27, grupo: 'Indicadores',
    formula: 'IC_m² = CO₂_estrutura / A_total',
    descricao: 'Intensidade de carbono por m² de área construída',
    variaveis: [],
  },
  {
    id: 28, grupo: 'Indicadores',
    formula: 'IC_kN = CO₂_estrutura / P_total',
    descricao: 'Intensidade de carbono por kN de carga',
    variaveis: [],
  },
  // --- Carbonatação B1 ---
  {
    id: 29, grupo: 'Carbonatação (Módulo B1)',
    formula: 'CO₂_carb = k × √t × A_exp × C_CaO × r × M_CO₂/M_CaO',
    descricao: 'CO₂ absorvido por carbonatação',
    variaveis: [
      { simbolo: 'k', descricao: 'coeficiente de carbonatação (mm/√ano)' },
      { simbolo: 't', descricao: 'tempo de exposição (anos)' },
      { simbolo: 'A_exp', descricao: 'área exposta (m²)' },
      { simbolo: 'C_CaO', descricao: 'teor de CaO no cimento hidratado' },
      { simbolo: 'r', descricao: 'grau de carbonatação' },
    ],
  },
  {
    id: 30, grupo: 'Carbonatação (Módulo B1)',
    formula: 'd_carb = k × √t',
    descricao: 'Profundidade de carbonatação',
    variaveis: [],
  },
  {
    id: 31, grupo: 'Carbonatação (Módulo B1)',
    formula: 'k = f(a/c, tipo_cimento, exposição)',
    descricao: 'Coeficiente de carbonatação',
    variaveis: [],
  },
  // --- Fim de vida C1-C4 ---
  {
    id: 32, grupo: 'Fim de vida (Módulos C1–C4)',
    formula: 'CO₂_C1 = CEE_demol × fe_ee + Qcomb_demol × fe_comb',
    descricao: 'Emissão da demolição',
    variaveis: [],
  },
  {
    id: 33, grupo: 'Fim de vida (Módulos C1–C4)',
    formula: 'CO₂_C2 = M_resíduos × d_destino × fe_transp / 1000',
    descricao: 'Transporte de resíduos',
    variaveis: [],
  },
  {
    id: 34, grupo: 'Fim de vida (Módulos C1–C4)',
    formula: 'CO₂_C3 = CEE_proc × fe_ee',
    descricao: 'Processamento de resíduos',
    variaveis: [],
  },
  {
    id: 35, grupo: 'Fim de vida (Módulos C1–C4)',
    formula: 'CO₂_C4 = M_aterro × fe_aterro',
    descricao: 'Disposição final',
    variaveis: [],
  },
  {
    id: 36, grupo: 'Fim de vida (Módulos C1–C4)',
    formula: 'CO₂_C = CO₂_C1 + CO₂_C2 + CO₂_C3 + CO₂_C4',
    descricao: 'Total fim de vida',
    variaveis: [],
  },
  // --- Módulo D ---
  {
    id: 37, grupo: 'Módulo D — Benefícios além da fronteira',
    formula: 'CO₂_D,aço = M_sucata × (fe_aço_primário − fe_aço_reciclado)',
    descricao: 'Crédito pela reciclagem do aço',
    variaveis: [],
  },
  {
    id: 38, grupo: 'Módulo D — Benefícios além da fronteira',
    formula: 'CO₂_D,concreto = M_RCD × fe_subst × %substituição',
    descricao: 'Crédito pelo uso de RCD',
    variaveis: [],
  },
  {
    id: 39, grupo: 'Módulo D — Benefícios além da fronteira',
    formula: 'CO₂_D = CO₂_D,aço + CO₂_D,concreto',
    descricao: 'Total módulo D',
    variaveis: [],
  },
  // --- Balanço total ---
  {
    id: 40, grupo: 'Balanço total do ciclo de vida',
    formula: 'CO₂_total = CO₂_A + CO₂_B + CO₂_C + CO₂_D',
    descricao: 'Balanço completo',
    variaveis: [],
  },
  {
    id: 41, grupo: 'Balanço total do ciclo de vida',
    formula: 'CO₂_A = CO₂_A1 + CO₂_A2 + CO₂_A3 + CO₂_A4 + CO₂_A5',
    descricao: 'Total estágio A',
    variaveis: [],
  },
  {
    id: 42, grupo: 'Balanço total do ciclo de vida',
    formula: 'CO₂_B = CO₂_B1 + ... + CO₂_B5',
    descricao: 'Total estágio B (uso)',
    variaveis: [],
  },
  {
    id: 43, grupo: 'Balanço total do ciclo de vida',
    formula: 'CO₂_líquido = CO₂_total − CO₂_carb',
    descricao: 'Emissão líquida (descontada carbonatação)',
    variaveis: [],
  },
];

// ===========================================================================
// Procedures
// ===========================================================================

const PROCEDURES = [
  {
    id: 'proc1',
    titulo: 'Cálculo da pegada de carbono do concreto (A1–A3)',
    etapas: [
      'Selecionar traço do concreto (fck desejado)',
      'Identificar materiais e suas massas por m³',
      'Aplicar fatores de emissão para cada material (A1)',
      'Calcular transporte de matérias-primas (A2)',
      'Calcular energia de fabricação — mistura e bombeamento (A3)',
      'Somar A1 + A2 + A3 para obter a pegada total por m³',
    ],
  },
  {
    id: 'proc2',
    titulo: 'Cálculo da pegada de carbono da estrutura (A1–A5)',
    etapas: [
      'Calcular CO₂ do concreto (procedimento 1)',
      'Calcular CO₂ do aço (fe_aço × M_aço)',
      'Calcular transporte à obra (A4) — concreto e aço',
      'Calcular perdas e emissões de equipamentos (A5)',
      'Somar total: CO₂_estrutura = CO₂_concreto + CO₂_aço + CO₂_A4 + CO₂_A5',
    ],
  },
  {
    id: 'proc3',
    titulo: 'Estimativa de carbonatação (B1)',
    etapas: [
      'Determinar coeficiente de carbonatação k com base no tipo de cimento e exposição',
      'Definir tempo de exposição t (anos)',
      'Calcular profundidade de carbonatação: d_carb = k × √t',
      'Estimar área exposta da estrutura (m²)',
      'Calcular CO₂ absorvido pela carbonatação (Eq. 29)',
    ],
  },
  {
    id: 'proc4',
    titulo: 'Avaliação do ciclo de vida completo (A–D)',
    etapas: [
      'Calcular estágio A — produção e construção (A1–A5)',
      'Estimar estágio B — uso e manutenção (B1–B5)',
      'Calcular estágio C — fim de vida (C1–C4)',
      'Avaliar módulo D — benefícios além da fronteira (reciclagem)',
      'Calcular balanço total: CO₂_total = CO₂_A + CO₂_B + CO₂_C + CO₂_D',
    ],
  },
  {
    id: 'proc5',
    titulo: 'Benchmarking da estrutura',
    etapas: [
      'Calcular CO₂ total da estrutura',
      'Determinar área construída total (m²)',
      'Calcular indicador IC = CO₂_total / área (kg CO₂/m²)',
      'Comparar com faixa de referência (45–110 kg CO₂/m²)',
      'Classificar desempenho da estrutura',
    ],
  },
];

// ===========================================================================
// Symbology
// ===========================================================================

const SYMBOLOGY = [
  { simbolo: 'CO₂', descricao: 'Dióxido de carbono', unidade: 'kg ou t' },
  { simbolo: 'fe', descricao: 'Fator de emissão', unidade: 'variável' },
  { simbolo: 'M', descricao: 'Massa', unidade: 'kg ou t' },
  { simbolo: 'V', descricao: 'Volume', unidade: 'm³' },
  { simbolo: 'A', descricao: 'Área', unidade: 'm²' },
  { simbolo: 'd', descricao: 'Distância', unidade: 'km' },
  { simbolo: 'CEE', descricao: 'Consumo de energia elétrica', unidade: 'kWh' },
  { simbolo: 'IC', descricao: 'Intensidade de carbono', unidade: 'kg CO₂/m² ou m³' },
  { simbolo: 'k', descricao: 'Coeficiente de carbonatação', unidade: 'mm/√ano' },
  { simbolo: 't', descricao: 'Tempo', unidade: 'anos' },
  { simbolo: 'ρ', descricao: 'Massa específica', unidade: 'kg/m³' },
  { simbolo: 'a/c', descricao: 'Relação água/cimento', unidade: '–' },
  { simbolo: 'fck', descricao: 'Resistência característica à compressão', unidade: 'MPa' },
  { simbolo: '%clínquer', descricao: 'Teor de clínquer no cimento', unidade: '%' },
  { simbolo: 'RCD', descricao: 'Resíduos de construção e demolição', unidade: '–' },
];

// ===========================================================================
// Normative references
// ===========================================================================

const NORMATIVE_REFS = [
  { codigo: 'ABNT NBR 15575', titulo: 'Edificações habitacionais — Desempenho' },
  { codigo: 'ABNT NBR 16697', titulo: 'Cimento Portland — Requisitos' },
  { codigo: 'EN 15978', titulo: 'Sustainability of construction works — Assessment of environmental performance of buildings' },
  { codigo: 'EN 16757', titulo: 'Sustainability of construction works — Product category rules for concrete and concrete elements' },
  { codigo: 'ISO 14040', titulo: 'Environmental management — Life cycle assessment — Principles and framework' },
  { codigo: 'ISO 14044', titulo: 'Environmental management — Life cycle assessment — Requirements and guidelines' },
  { codigo: 'ISO 21930', titulo: 'Sustainability in buildings and civil engineering works — Core rules for EPDs' },
  { codigo: 'IPCC Guidelines', titulo: 'Guidelines for National Greenhouse Gas Inventories (2006, 2019 refinement)' },
  { codigo: 'Boletim IBRACON/ABECE/ABCIC', titulo: 'Quantificação das emissões de CO₂ incorporadas em materiais cimentícios e estruturas de concreto (2024)' },
];

// ===========================================================================
// Search helper
// ===========================================================================

function matchesSearch(search: string, ...texts: string[]): boolean {
  if (!search.trim()) return true;
  const lower = search.toLowerCase();
  return texts.some((t) => t.toLowerCase().includes(lower));
}

// ===========================================================================
// Sub-components
// ===========================================================================

function SectionHeader({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  count,
}: {
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-4 rounded-xl transition-colors"
    >
      <span className="flex items-center gap-3 text-lg font-bold">
        <Icon size={22} />
        {title}
        {count !== undefined && (
          <span className="bg-white/20 text-sm font-medium px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </span>
      {isOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
    </button>
  );
}

function CollapsibleCard({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-5 py-3 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-left">{title}</span>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function StatCard({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div className="bg-emerald-100 p-3 rounded-lg">
        <Icon size={24} className="text-emerald-700" />
      </div>
      <div>
        <div className="text-2xl font-bold text-emerald-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

/** Renders a formula string with subscripts and special chars styled */
function FormulaDisplay({ formula }: { formula: string }) {
  // Split on subscript patterns like _xyz or _{xyz} and render them as <sub>
  const parts: React.ReactNode[] = [];
  let remaining = formula;
  let key = 0;

  while (remaining.length > 0) {
    // Look for subscript patterns: _{...} or _word
    const braceMatch = remaining.match(/^(.*?)_\{([^}]+)\}/);
    const simpleMatch = remaining.match(/^(.*?)_([A-Za-zÀ-ÿ0-9,]+)/);

    const match = braceMatch
      ? { prefix: braceMatch[1], sub: braceMatch[2], full: braceMatch[0] }
      : simpleMatch
        ? { prefix: simpleMatch[1], sub: simpleMatch[2], full: simpleMatch[0] }
        : null;

    if (match && match.prefix.length < remaining.length) {
      if (match.prefix) {
        parts.push(<span key={key++}>{match.prefix}</span>);
      }
      parts.push(
        <sub key={key++} className="text-xs">{match.sub}</sub>
      );
      remaining = remaining.slice(match.full.length);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
  }

  return (
    <div className="font-mono text-base md:text-lg text-gray-900 bg-white rounded-lg px-4 py-3 border border-gray-200 leading-relaxed whitespace-nowrap overflow-x-auto">
      {parts}
    </div>
  );
}

// ===========================================================================
// Main component
// ===========================================================================

export default function TechnicalRef() {
  const [search, setSearch] = useState('');
  const [sections, setSections] = useState<CollapsibleState>({
    tabelas: true,
    equacoes: true,
    procedimentos: true,
    simbologia: true,
    referencias: true,
  });
  const [cards, setCards] = useState<CollapsibleState>({
    tab2: true,
    tab3: true,
    tab4: true,
    tab6: true,
    transp: true,
    elet: true,
    quadro1: true,
    quadro2: true,
    quadro3: true,
  });

  const toggleSection = (key: string) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  const toggleCard = (key: string) =>
    setCards((prev) => ({ ...prev, [key]: !prev[key] }));

  // =========================================================================
  // Filtered data using imports
  // =========================================================================

  const filteredFuels = useMemo(
    () =>
      fuelFactors.filter((f) =>
        matchesSearch(search, f.name, String(f.factor), f.unit, f.note ?? '', 'combustíveis', 'IPCC'),
      ),
    [search],
  );

  const filteredCarbonates = useMemo(
    () =>
      carbonateFactors.filter((c) =>
        matchesSearch(search, c.formula, c.mineral, String(c.factor), 'carbonatos', 'calcinação'),
      ),
    [search],
  );

  const filteredRecipes = useMemo(
    () =>
      concreteRecipes.filter((r) =>
        matchesSearch(search, `fck ${r.fck}`, String(r.cement), String(r.sand), String(r.gravel), 'traço', 'concreto'),
      ),
    [search],
  );

  const filteredMaterials = useMemo(
    () =>
      materialFactors.filter((m) =>
        matchesSearch(search, m.name, String(m.factorMin), String(m.factorMax), m.unit, m.source, 'material', 'emissão'),
      ),
    [search],
  );

  const filteredTransport = useMemo(
    () =>
      transportFactors.filter((t) =>
        matchesSearch(search, t.mode, String(t.factor), t.unit, 'transporte'),
      ),
    [search],
  );

  const filteredElectricity = useMemo(
    () => matchesSearch(search, 'eletricidade', 'elétrica', 'kWh', String(electricityFactor.factor)),
    [search],
  );

  const filteredLifeCycle = useMemo(
    () =>
      lifeCycleStages.filter((s) =>
        matchesSearch(search, s.module, s.name, s.stage, s.description, 'ciclo de vida', 'quadro 1'),
      ),
    [search],
  );

  const filteredCementComp = useMemo(
    () =>
      CEMENT_COMPOSITION.filter((c) =>
        matchesSearch(search, c.cimento, 'cimento', 'composição', 'clínquer', 'escória', 'pozolana', 'quadro 2'),
      ),
    [search],
  );

  const filteredCementEmission = useMemo(
    () =>
      CEMENT_EMISSION_VALUES.filter((c) =>
        matchesSearch(search, c.cimento, String(c.medio), 'cimento', 'emissão', 'quadro 3'),
      ),
    [search],
  );

  const filteredEquations = useMemo(
    () =>
      EQUATIONS.filter((eq) =>
        matchesSearch(
          search,
          `Eq. ${eq.id}`,
          eq.grupo,
          eq.formula,
          eq.descricao,
          ...eq.variaveis.map((v) => v.descricao),
          ...eq.variaveis.map((v) => v.simbolo),
        ),
      ),
    [search],
  );

  const filteredProcedures = useMemo(
    () =>
      PROCEDURES.filter((p) =>
        matchesSearch(search, p.titulo, ...p.etapas),
      ),
    [search],
  );

  const filteredSymbols = useMemo(
    () =>
      SYMBOLOGY.filter((s) =>
        matchesSearch(search, s.simbolo, s.descricao, s.unidade),
      ),
    [search],
  );

  const filteredRefs = useMemo(
    () =>
      NORMATIVE_REFS.filter((r) =>
        matchesSearch(search, r.codigo, r.titulo),
      ),
    [search],
  );

  // Group equations by grupo
  const equationGroups = useMemo(() => {
    const groups: { grupo: string; equations: Equation[] }[] = [];
    filteredEquations.forEach((eq) => {
      const existing = groups.find((g) => g.grupo === eq.grupo);
      if (existing) {
        existing.equations.push(eq);
      } else {
        groups.push({ grupo: eq.grupo, equations: [eq] });
      }
    });
    return groups;
  }, [filteredEquations]);

  // Any tables visible?
  const anyTablesVisible =
    filteredFuels.length > 0 ||
    filteredCarbonates.length > 0 ||
    filteredRecipes.length > 0 ||
    filteredMaterials.length > 0 ||
    filteredTransport.length > 0 ||
    filteredElectricity ||
    filteredLifeCycle.length > 0 ||
    filteredCementComp.length > 0 ||
    filteredCementEmission.length > 0;

  const noResults =
    search.trim() &&
    !anyTablesVisible &&
    filteredEquations.length === 0 &&
    filteredProcedures.length === 0 &&
    filteredSymbols.length === 0 &&
    filteredRefs.length === 0;

  // =========================================================================
  // Render
  // =========================================================================

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={32} />
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Referência Técnica Completa
            </h1>
          </div>
          <p className="text-emerald-100 text-lg mt-1 mb-8 max-w-3xl">
            Todas as tabelas, equações e procedimentos do Boletim Técnico
            IBRACON/ABECE/ABCIC — Quantificação das emissões de CO₂ incorporadas
            em materiais cimentícios e estruturas de concreto (2024)
          </p>

          {/* Global search */}
          <div className="relative max-w-xl">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar em tabelas, equações, procedimentos..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur text-white placeholder-emerald-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 space-y-8">
        {/* ================================================================ */}
        {/* QUICK STATS                                                      */}
        {/* ================================================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="9" label="Tabelas de dados" icon={Calculator} />
          <StatCard value="43" label="Equações" icon={Hash} />
          <StatCard value="5" label="Procedimentos" icon={ArrowRight} />
          <StatCard value="9" label="Referências normativas" icon={FileText} />
        </div>

        {/* ================================================================ */}
        {/* SECTION: TABELAS DE REFERÊNCIA                                   */}
        {/* ================================================================ */}
        {anyTablesVisible && (
          <section>
            <SectionHeader
              title="Tabelas de Referência"
              icon={Calculator}
              isOpen={sections.tabelas}
              onToggle={() => toggleSection('tabelas')}
            />

            {sections.tabelas && (
              <div className="mt-4 space-y-4">
                {/* ---- Tabela 2 – Combustíveis ---- */}
                {filteredFuels.length > 0 && (
                  <CollapsibleCard
                    title="Tabela 2 — Fatores de emissão de CO₂ para combustíveis (IPCC)"
                    isOpen={cards.tab2}
                    onToggle={() => toggleCard('tab2')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Combustível</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator de emissão</th>
                            <th className="text-left px-3 py-2 font-semibold">Unidade</th>
                            <th className="text-left px-3 py-2 font-semibold">Renovável</th>
                            <th className="text-left px-3 py-2 font-semibold">Nota</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFuels.map((f, i) => (
                            <tr
                              key={f.name}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2">{f.name}</td>
                              <td className="px-3 py-2 text-right font-mono">{f.factor}</td>
                              <td className="px-3 py-2 text-gray-600">{f.unit}</td>
                              <td className="px-3 py-2">
                                {f.renewable ? (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                                    Sim
                                  </span>
                                ) : (
                                  <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full">
                                    Não
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-gray-500 text-xs">{f.note ?? ''}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Tabela 3 – Carbonatos ---- */}
                {filteredCarbonates.length > 0 && (
                  <CollapsibleCard
                    title="Tabela 3 — Fatores de emissão de CO₂ para calcinação de carbonatos (IPCC)"
                    isOpen={cards.tab3}
                    onToggle={() => toggleCard('tab3')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Fórmula</th>
                            <th className="text-left px-3 py-2 font-semibold">Mineral</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator (t CO₂/t carbonato)</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator máx.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCarbonates.map((c, i) => (
                            <tr
                              key={c.formula}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2 font-mono">{c.formula}</td>
                              <td className="px-3 py-2">{c.mineral}</td>
                              <td className="px-3 py-2 text-right font-mono">{c.factor}</td>
                              <td className="px-3 py-2 text-right font-mono text-gray-500">
                                {c.factorMax ? c.factorMax : '–'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Tabela 4 – Traços dos concretos ---- */}
                {filteredRecipes.length > 0 && (
                  <CollapsibleCard
                    title="Tabela 4 — Traços dos concretos (kg/m³)"
                    isOpen={cards.tab4}
                    onToggle={() => toggleCard('tab4')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-center px-3 py-2 font-semibold">fck (MPa)</th>
                            <th className="text-right px-3 py-2 font-semibold">Cimento (kg)</th>
                            <th className="text-right px-3 py-2 font-semibold">Areia (kg)</th>
                            <th className="text-right px-3 py-2 font-semibold">Brita (kg)</th>
                            <th className="text-right px-3 py-2 font-semibold">Aditivo (kg)</th>
                            <th className="text-right px-3 py-2 font-semibold">Água (L)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRecipes.map((r, i) => (
                            <tr
                              key={r.fck}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2 text-center font-semibold text-emerald-700">{r.fck}</td>
                              <td className="px-3 py-2 text-right font-mono">{r.cement}</td>
                              <td className="px-3 py-2 text-right font-mono">{r.sand}</td>
                              <td className="px-3 py-2 text-right font-mono">{r.gravel}</td>
                              <td className="px-3 py-2 text-right font-mono">{r.additive}</td>
                              <td className="px-3 py-2 text-right font-mono">{r.water}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Tabela 6 – Materiais ---- */}
                {filteredMaterials.length > 0 && (
                  <CollapsibleCard
                    title="Tabela 6 — Fatores de emissão de CO₂ para materiais"
                    isOpen={cards.tab6}
                    onToggle={() => toggleCard('tab6')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Material</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator mín.</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator máx.</th>
                            <th className="text-left px-3 py-2 font-semibold">Unidade</th>
                            <th className="text-left px-3 py-2 font-semibold">Fonte</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMaterials.map((m, i) => (
                            <tr
                              key={m.name}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2">{m.name}</td>
                              <td className="px-3 py-2 text-right font-mono">{m.factorMin}</td>
                              <td className="px-3 py-2 text-right font-mono">{m.factorMax}</td>
                              <td className="px-3 py-2 text-gray-600">{m.unit}</td>
                              <td className="px-3 py-2">
                                <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">
                                  {m.source}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Transporte ---- */}
                {filteredTransport.length > 0 && (
                  <CollapsibleCard
                    title="Transporte — Fatores de emissão para transporte"
                    isOpen={cards.transp}
                    onToggle={() => toggleCard('transp')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Modo de transporte</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator de emissão</th>
                            <th className="text-left px-3 py-2 font-semibold">Unidade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTransport.map((t, i) => (
                            <tr
                              key={t.mode}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2">{t.mode}</td>
                              <td className="px-3 py-2 text-right font-mono">{t.factor}</td>
                              <td className="px-3 py-2 text-gray-600">{t.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Eletricidade ---- */}
                {filteredElectricity && (
                  <CollapsibleCard
                    title="Eletricidade — Fator de emissão da rede pública"
                    isOpen={cards.elet}
                    onToggle={() => toggleCard('elet')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Item</th>
                            <th className="text-right px-3 py-2 font-semibold">Fator de emissão</th>
                            <th className="text-left px-3 py-2 font-semibold">Unidade</th>
                            <th className="text-left px-3 py-2 font-semibold">Fonte</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white hover:bg-emerald-50/50 transition-colors">
                            <td className="px-3 py-2">
                              <span className="flex items-center gap-2">
                                <Zap size={14} className="text-amber-500" />
                                Eletricidade da rede pública brasileira
                              </span>
                            </td>
                            <td className="px-3 py-2 text-right font-mono">{electricityFactor.factor}</td>
                            <td className="px-3 py-2 text-gray-600">{electricityFactor.unit}</td>
                            <td className="px-3 py-2">
                              <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">
                                {electricityFactor.source}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Quadro 1 – Ciclo de vida ---- */}
                {filteredLifeCycle.length > 0 && (
                  <CollapsibleCard
                    title="Quadro 1 — Distribuição dos módulos do ciclo de vida (EN 15978)"
                    isOpen={cards.quadro1}
                    onToggle={() => toggleCard('quadro1')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Módulo</th>
                            <th className="text-left px-3 py-2 font-semibold">Nome</th>
                            <th className="text-left px-3 py-2 font-semibold">Estágio</th>
                            <th className="text-left px-3 py-2 font-semibold">Descrição</th>
                            <th className="text-left px-3 py-2 font-semibold">Exemplos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLifeCycle.map((s, i) => (
                            <tr
                              key={s.id}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2">
                                <span
                                  className="inline-block text-xs font-bold px-2 py-1 rounded text-white"
                                  style={{ backgroundColor: s.color }}
                                >
                                  {s.module}
                                </span>
                              </td>
                              <td className="px-3 py-2 font-medium">{s.name}</td>
                              <td className="px-3 py-2 text-gray-600">{s.stage}</td>
                              <td className="px-3 py-2 text-gray-600 text-xs">{s.description}</td>
                              <td className="px-3 py-2 text-gray-500 text-xs">{s.examples}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Quadro 2 – Composição dos cimentos ---- */}
                {filteredCementComp.length > 0 && (
                  <CollapsibleCard
                    title="Quadro 2 — Composição dos cimentos Portland brasileiros (% em massa)"
                    isOpen={cards.quadro2}
                    onToggle={() => toggleCard('quadro2')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Cimento</th>
                            <th className="text-center px-3 py-2 font-semibold">Clínquer + Gesso</th>
                            <th className="text-center px-3 py-2 font-semibold">Escória</th>
                            <th className="text-center px-3 py-2 font-semibold">Pozolana</th>
                            <th className="text-center px-3 py-2 font-semibold">Calcário</th>
                            <th className="text-center px-3 py-2 font-semibold">Fíler</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCementComp.map((c, i) => (
                            <tr
                              key={c.cimento}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2 font-semibold text-emerald-700">{c.cimento}</td>
                              <td className="px-3 py-2 text-center font-mono">{c.clinquer}</td>
                              <td className="px-3 py-2 text-center font-mono text-gray-500">{c.escoria}</td>
                              <td className="px-3 py-2 text-center font-mono text-gray-500">{c.pozolana}</td>
                              <td className="px-3 py-2 text-center font-mono text-gray-500">{c.calcario}</td>
                              <td className="px-3 py-2 text-center font-mono text-gray-500">{c.filer}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-3">
                        Fonte: ABNT NBR 16697 — Cimento Portland — Requisitos. Valores em percentual (% em massa).
                      </p>
                    </div>
                  </CollapsibleCard>
                )}

                {/* ---- Quadro 3 – Valores típicos de emissão ---- */}
                {filteredCementEmission.length > 0 && (
                  <CollapsibleCard
                    title="Quadro 3 — Valores típicos de emissão por tipo de cimento"
                    isOpen={cards.quadro3}
                    onToggle={() => toggleCard('quadro3')}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-emerald-50 text-emerald-900">
                            <th className="text-left px-3 py-2 font-semibold">Cimento</th>
                            <th className="text-center px-3 py-2 font-semibold">Faixa (kg CO₂/t)</th>
                            <th className="text-right px-3 py-2 font-semibold">Valor médio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredCementEmission.map((c, i) => (
                            <tr
                              key={c.cimento}
                              className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                            >
                              <td className="px-3 py-2 font-semibold text-emerald-700">{c.cimento}</td>
                              <td className="px-3 py-2 text-center font-mono">
                                {c.faixaMin}–{c.faixaMax}
                              </td>
                              <td className="px-3 py-2 text-right font-mono font-semibold">{c.medio}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="text-xs text-gray-500 mt-3">
                        Valores em kg CO₂/t de cimento. Fonte: Boletim Técnico IBRACON/ABECE/ABCIC (2024).
                      </p>
                    </div>
                  </CollapsibleCard>
                )}
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* SECTION: EQUAÇÕES                                                */}
        {/* ================================================================ */}
        {filteredEquations.length > 0 && (
          <section>
            <SectionHeader
              title="Equações"
              icon={Hash}
              isOpen={sections.equacoes}
              onToggle={() => toggleSection('equacoes')}
              count={filteredEquations.length}
            />

            {sections.equacoes && (
              <div className="mt-4 space-y-6">
                {equationGroups.map((group) => (
                  <div key={group.grupo}>
                    {/* Group label */}
                    <div className="flex items-center gap-2 mb-3">
                      <FlaskConical size={16} className="text-emerald-600" />
                      <h3 className="font-bold text-emerald-800 text-sm uppercase tracking-wide">
                        {group.grupo}
                      </h3>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {group.equations.map((eq) => (
                        <div
                          key={eq.id}
                          className="bg-gray-100 rounded-xl border border-gray-200 overflow-hidden"
                        >
                          {/* Equation header */}
                          <div className="bg-gray-200/60 px-5 py-3 flex items-baseline gap-3">
                            <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-0.5 rounded">
                              Eq. {eq.id}
                            </span>
                            <span className="text-gray-600 text-sm">{eq.descricao}</span>
                          </div>

                          {/* Formula */}
                          <div className="px-5 py-4">
                            <FormulaDisplay formula={eq.formula} />

                            {/* Variables */}
                            {eq.variaveis.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {eq.variaveis.map((v) => (
                                  <div key={v.simbolo} className="flex items-baseline gap-2 text-sm">
                                    <code className="text-emerald-700 font-mono font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-xs flex-shrink-0">
                                      {v.simbolo}
                                    </code>
                                    <span className="text-gray-600">— {v.descricao}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* SECTION: PROCEDIMENTOS                                           */}
        {/* ================================================================ */}
        {filteredProcedures.length > 0 && (
          <section>
            <SectionHeader
              title="Procedimentos de Cálculo"
              icon={ArrowRight}
              isOpen={sections.procedimentos}
              onToggle={() => toggleSection('procedimentos')}
              count={filteredProcedures.length}
            />

            {sections.procedimentos && (
              <div className="mt-4 space-y-4">
                {filteredProcedures.map((proc, procIdx) => (
                  <div
                    key={proc.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                      <span className="bg-emerald-700 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        {procIdx + 1}
                      </span>
                      <h3 className="font-bold text-emerald-900 text-base">{proc.titulo}</h3>
                    </div>
                    <div className="px-6 py-5">
                      <ol className="relative border-l-2 border-emerald-200 ml-4 space-y-0">
                        {proc.etapas.map((etapa, i) => (
                          <li key={i} className="pb-6 last:pb-0 pl-8 relative">
                            {/* Numbered circle */}
                            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shadow-sm">
                              {i + 1}
                            </div>
                            {/* Connecting arrow for all but last */}
                            {i < proc.etapas.length - 1 && (
                              <div className="absolute -left-[5px] bottom-0 text-emerald-300">
                                <ArrowRight size={10} className="rotate-90" />
                              </div>
                            )}
                            <p className="text-gray-700 pt-1">{etapa}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* SECTION: SIMBOLOGIA                                              */}
        {/* ================================================================ */}
        {filteredSymbols.length > 0 && (
          <section>
            <SectionHeader
              title="Simbologia"
              icon={Ruler}
              isOpen={sections.simbologia}
              onToggle={() => toggleSection('simbologia')}
              count={filteredSymbols.length}
            />

            {sections.simbologia && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-900">
                        <th className="text-left px-5 py-3 font-semibold">Símbolo</th>
                        <th className="text-left px-5 py-3 font-semibold">Descrição</th>
                        <th className="text-left px-5 py-3 font-semibold">Unidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSymbols.map((s, i) => (
                        <tr
                          key={s.simbolo}
                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-emerald-50/50 transition-colors`}
                        >
                          <td className="px-5 py-3">
                            <code className="font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {s.simbolo}
                            </code>
                          </td>
                          <td className="px-5 py-3 text-gray-700">{s.descricao}</td>
                          <td className="px-5 py-3 text-gray-500 font-mono text-xs">{s.unidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* SECTION: REFERÊNCIAS NORMATIVAS                                  */}
        {/* ================================================================ */}
        {filteredRefs.length > 0 && (
          <section>
            <SectionHeader
              title="Referências Normativas"
              icon={BookOpen}
              isOpen={sections.referencias}
              onToggle={() => toggleSection('referencias')}
              count={filteredRefs.length}
            />

            {sections.referencias && (
              <div className="mt-4 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {filteredRefs.map((ref, i) => (
                    <li
                      key={ref.codigo}
                      className="px-6 py-4 hover:bg-emerald-50/50 transition-colors flex items-start gap-4"
                    >
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-semibold text-gray-900">{ref.codigo}</span>
                        <span className="text-gray-400 mx-2">—</span>
                        <span className="text-gray-700">{ref.titulo}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* ================================================================ */}
        {/* NO RESULTS                                                       */}
        {/* ================================================================ */}
        {noResults && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">
              Nenhum resultado encontrado para &ldquo;{search}&rdquo;
            </p>
            <p className="text-sm mt-1">Tente buscar por outro termo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
