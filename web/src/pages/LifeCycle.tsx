import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import {
  Recycle,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Layers,
  BookOpen,
  FlaskConical,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Stage {
  id: string;
  name: string;
  description: string;
  example: string;
}

interface LifeCycleGroup {
  label: string;
  color: string;
  bgLight: string;
  border: string;
  stages: Stage[];
}

const LIFECYCLE: LifeCycleGroup[] = [
  {
    label: 'Estágio de Produto',
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    stages: [
      {
        id: 'A1',
        name: 'Produção matérias-primas',
        description: 'Extração e processamento dos recursos naturais.',
        example: 'Mineração de calcário, extração de areia e brita.',
      },
      {
        id: 'A2',
        name: 'Transporte',
        description: 'Transporte das matérias-primas até a fábrica.',
        example: 'Caminhões levando calcário até a cimenteira.',
      },
      {
        id: 'A3',
        name: 'Fabricação',
        description: 'Produção do material de construção.',
        example: 'Clinquerização do cimento, produção do aço.',
      },
    ],
  },
  {
    label: 'Processo Construtivo',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    stages: [
      {
        id: 'A4',
        name: 'Transporte à obra',
        description: 'Transporte dos materiais ao canteiro de obra.',
        example: 'Caminhão betoneira levando concreto à obra.',
      },
      {
        id: 'A5',
        name: 'Construção',
        description: 'Execução da obra, incluindo perdas e energia no canteiro.',
        example: 'Lançamento do concreto, montagem de formas, vibração.',
      },
    ],
  },
  {
    label: 'Estágio de Uso',
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    stages: [
      {
        id: 'B1',
        name: 'Uso',
        description: 'Emissões durante a vida útil sem intervenções.',
        example: 'Carbonatação do concreto (pode absorver CO\u2082).',
      },
      {
        id: 'B2',
        name: 'Manutenção',
        description: 'Ações periódicas para manter desempenho.',
        example: 'Pintura de proteção, limpeza de fachadas.',
      },
      {
        id: 'B3',
        name: 'Reparo',
        description: 'Correção de defeitos ou danos pontuais.',
        example: 'Reparo de fissuras, recomposição de cobrimento.',
      },
      {
        id: 'B4',
        name: 'Substituição',
        description: 'Troca de componentes que atingiram vida útil.',
        example: 'Substituição de juntas de dilatação.',
      },
      {
        id: 'B5',
        name: 'Reforma',
        description: 'Intervenções maiores de reabilitação.',
        example: 'Reforço estrutural com fibra de carbono.',
      },
    ],
  },
  {
    label: 'Fim de Vida',
    color: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    border: 'border-red-200',
    stages: [
      {
        id: 'C1',
        name: 'Demolição',
        description: 'Desmontagem e demolição da estrutura.',
        example: 'Demolição mecânica com escavadeira.',
      },
      {
        id: 'C2',
        name: 'Transporte resíduos',
        description: 'Transporte dos resíduos da demolição.',
        example: 'Caminhões levando entulho ao aterro ou usina.',
      },
      {
        id: 'C3',
        name: 'Processamento',
        description: 'Triagem e processamento dos resíduos.',
        example: 'Britagem do concreto para uso como agregado.',
      },
      {
        id: 'C4',
        name: 'Disposição final',
        description: 'Destinação final dos resíduos não aproveitados.',
        example: 'Aterro de inertes para materiais não recicláveis.',
      },
    ],
  },
  {
    label: 'Além da Fronteira',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
    stages: [
      {
        id: 'D',
        name: 'Reuso / Reciclagem',
        description:
          'Benefícios além do ciclo de vida: reuso de materiais, reciclagem, recuperação energética.',
        example:
          'Agregado reciclado de concreto, reutilização de aço, coprocessamento.',
      },
    ],
  },
];

const CONTRIBUTION_DATA = [
  { stage: 'A1-A3 Produto', percent: 85, fill: '#059669' },
  { stage: 'A4-A5 Construção', percent: 10, fill: '#3b82f6' },
  { stage: 'B Uso', percent: 3, fill: '#f59e0b' },
  { stage: 'C Fim de Vida', percent: 2, fill: '#ef4444' },
];

// ---------------------------------------------------------------------------
// Scope selector config
// ---------------------------------------------------------------------------

type ScopeMode = 'material' | 'estrutura' | null;

const SCOPE_CONFIG = {
  material: {
    mandatory: ['A1', 'A2', 'A3'],
    recommended: [] as string[],
    label: 'Material Cimentício',
    description: 'Escopo mínimo para DAP / EPD de materiais',
    badgeColor: 'bg-emerald-600',
  },
  estrutura: {
    mandatory: ['A1', 'A2', 'A3'],
    recommended: ['A4', 'A5'],
    label: 'Estrutura de Concreto',
    description: 'Escopo recomendado para avaliação de estruturas',
    badgeColor: 'bg-blue-600',
  },
};

// ---------------------------------------------------------------------------
// Lifecycle comparison chart data
// ---------------------------------------------------------------------------

const COMPARISON_DATA = [
  {
    name: 'Moldada in-loco',
    'A1-A3': 85,
    A4: 5,
    A5: 8,
    B: 0,
    C: 2,
    D: 0,
  },
  {
    name: 'Pré-moldada',
    'A1-A3': 88,
    A4: 4,
    A5: 3,
    B: 0,
    C: 5,
    D: 0,
  },
  {
    name: 'Benchmark EU',
    'A1-A3': 75,
    A4: 3,
    A5: 5,
    B: 7,
    C: 5,
    D: -5,
  },
];

const COMPARISON_COLORS: Record<string, string> = {
  'A1-A3': '#059669',
  A4: '#3b82f6',
  A5: '#60a5fa',
  B: '#f59e0b',
  C: '#ef4444',
  D: '#8b5cf6',
};

// ---------------------------------------------------------------------------
// Glossary data
// ---------------------------------------------------------------------------

interface GlossaryItem {
  term: string;
  short: string;
  definition: string;
}

const GLOSSARY: GlossaryItem[] = [
  {
    term: 'Berço ao Portão (A1-A3)',
    short: 'Escopo mínimo para materiais',
    definition:
      'Abrange desde a extração das matérias-primas até a saída do produto acabado na fábrica. É o escopo mínimo exigido para Declarações Ambientais de Produto (DAP/EPD) de materiais de construção como cimento e concreto.',
  },
  {
    term: 'Berço ao Canteiro (A1-A5)',
    short: 'Escopo recomendado para estruturas',
    definition:
      'Inclui todo o estágio de produto (A1-A3) mais o transporte até a obra (A4) e a execução da construção (A5). É o escopo recomendado para avaliações de pegada de carbono de estruturas de concreto, pois considera as perdas e a energia do canteiro.',
  },
  {
    term: 'Berço ao Túmulo (A1-C4)',
    short: 'Ciclo de vida completo',
    definition:
      'Abrange todos os estágios desde a extração de matérias-primas até a disposição final dos resíduos de demolição. Fornece a visão mais completa da pegada de carbono, incluindo os benefícios da carbonatação durante o uso e os impactos da demolição.',
  },
  {
    term: 'DAP / EPD',
    short: 'Declaração Ambiental de Produto',
    definition:
      'Documento padronizado (ISO 14025, EN 15804) que quantifica os impactos ambientais de um produto ao longo do ciclo de vida. Para cimento e concreto, a DAP informa as emissões de CO₂ por tonelada ou por metro cúbico, permitindo comparações entre produtos similares.',
  },
  {
    term: 'ACV / LCA',
    short: 'Avaliação do Ciclo de Vida',
    definition:
      'Metodologia sistemática (ISO 14040/14044) para quantificar os impactos ambientais de um produto ou sistema ao longo de todo o seu ciclo de vida. É a base científica para a elaboração de DAPs e para a avaliação da pegada de carbono de edificações.',
  },
  {
    term: 'Unidade Funcional',
    short: 'Base de comparação (ex: 1 m\u00B2 de estrutura)',
    definition:
      'Referência quantitativa que define a função do sistema avaliado, permitindo comparações justas. Exemplos: 1 tonelada de cimento, 1 m³ de concreto C30, 1 m² de laje com vida útil de 50 anos. A escolha da unidade funcional é crucial para a validade das comparações.',
  },
];

// ---------------------------------------------------------------------------
// Process flow data
// ---------------------------------------------------------------------------

interface FlowStep {
  name: string;
  co2: string;
  detail: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    name: 'Calcário',
    co2: '~600-850 kg CO\u2082/t',
    detail: 'Calcinação + energia térmica do forno',
  },
  {
    name: 'Cimento',
    co2: '~250-350 kg CO\u2082/m\u00B3',
    detail: 'Depende do teor de cimento no traço',
  },
  {
    name: 'Concreto',
    co2: '~60-90 kg CO\u2082/m\u00B2',
    detail: 'Depende da geometria e do projeto',
  },
  {
    name: 'Estrutura',
    co2: '',
    detail: 'Produto final em serviço',
  },
];

// ---------------------------------------------------------------------------
// Helper: check if a stage is in scope
// ---------------------------------------------------------------------------

function getStageOpacity(
  stageId: string,
  scope: ScopeMode
): { opacity: string; badge: string | null } {
  if (!scope) return { opacity: '', badge: null };

  const config = SCOPE_CONFIG[scope];
  if (config.mandatory.includes(stageId)) {
    return { opacity: '', badge: 'Obrigatório' };
  }
  if (config.recommended.includes(stageId)) {
    return { opacity: '', badge: 'Recomendado' };
  }
  return { opacity: 'opacity-40 grayscale', badge: null };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LifeCycle() {
  const [scope, setScope] = useState<ScopeMode>(null);
  const [openGlossary, setOpenGlossary] = useState<number | null>(null);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-teal-600 to-teal-400 p-3 text-white shadow-md">
            <Recycle className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Ciclo de Vida - EN 15978
          </h1>
        </div>
        <p className="text-gray-500">
          Estágios do ciclo de vida de estruturas de concreto conforme a norma
          europeia EN 15978, adotada como referência no Brasil.
        </p>
      </div>

      {/* ================================================================= */}
      {/* 1. Interactive Scope Selector                                      */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Seletor de Escopo
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Selecione o tipo de avaliação para visualizar quais estágios do ciclo
          de vida são obrigatórios ou recomendados.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setScope(scope === 'material' ? null : 'material')}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              scope === 'material'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:text-emerald-700'
            }`}
          >
            Material Cimentício (A1-A3)
          </button>
          <button
            onClick={() => setScope(scope === 'estrutura' ? null : 'estrutura')}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all border-2 ${
              scope === 'estrutura'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-700'
            }`}
          >
            Estrutura de Concreto (A1-A5)
          </button>
          {scope && (
            <button
              onClick={() => setScope(null)}
              className="px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Limpar seleção
            </button>
          )}
        </div>
        {scope && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Obrigatório
            </span>
            {SCOPE_CONFIG[scope].recommended.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Recomendado
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              Fora do escopo
            </span>
          </div>
        )}
      </div>

      {/* Scope Indicator */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-xl text-white">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-7 w-7 text-yellow-300 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-xl font-bold mb-3">Escopo Mínimo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-emerald-200 mb-1">Para materiais (DAP)</p>
                <p className="text-2xl font-extrabold">A1 - A3</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Estágio de Produto ("do berço ao portão")
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-sm text-emerald-200 mb-1">Para estruturas</p>
                <p className="text-2xl font-extrabold">A1 - A5</p>
                <p className="text-sm text-emerald-100 mt-1">
                  Produto + Processo Construtivo ("do berço à obra")
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Life Cycle Timeline */}
      <div className="space-y-6">
        {LIFECYCLE.map((group) => {
          // Determine group-level opacity based on scope
          const allStageIds = group.stages.map((s) => s.id);
          const anyInScope = scope
            ? allStageIds.some(
                (id) =>
                  SCOPE_CONFIG[scope].mandatory.includes(id) ||
                  SCOPE_CONFIG[scope].recommended.includes(id)
              )
            : true;

          return (
            <div
              key={group.label}
              className={`rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 transition-all duration-300 ${
                scope && !anyInScope ? 'opacity-40 grayscale' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${group.color} px-4 py-2 text-white font-bold text-sm shadow-md`}
                >
                  {group.stages[0].id}
                  {group.stages.length > 1
                    ? ` - ${group.stages[group.stages.length - 1].id}`
                    : ''}
                </div>
                <h2 className="text-xl font-bold text-gray-800">{group.label}</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.stages.map((stage) => {
                  const { opacity, badge } = getStageOpacity(stage.id, scope);
                  return (
                    <div
                      key={stage.id}
                      className={`rounded-2xl ${group.bgLight} border ${group.border} p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative ${opacity}`}
                    >
                      {badge && (
                        <span
                          className={`absolute -top-2 -right-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow ${
                            badge === 'Obrigatório'
                              ? 'bg-emerald-600'
                              : 'bg-blue-500'
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br ${group.color} text-white text-xs font-bold w-9 h-9 shadow`}
                        >
                          {stage.id}
                        </span>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {stage.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {stage.description}
                      </p>
                      <p className="text-xs text-gray-400 italic">
                        Ex.: {stage.example}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* 2. Carbonation Section (B1 Deep Dive)                             */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="h-5 w-5 text-teal-600" />
          <h2 className="text-xl font-bold text-gray-800">
            Carbonatação - Aprofundamento do Estágio B1
          </h2>
        </div>

        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
            <p className="text-teal-900 mb-3">
              A carbonatação é o processo pelo qual o CO&#x2082; atmosférico
              reage com compostos do cimento hidratado, formando CaCO&#x2083;.
              Este processo remove CO&#x2082; da atmosfera ao longo da vida útil
              da estrutura.
            </p>
            <p className="text-teal-800">
              Estima-se que a carbonatação possa reabsorver de{' '}
              <span className="font-bold text-teal-900">10% a 25%</span> do
              CO&#x2082; emitido na produção do cimento ao longo de 50 anos de
              vida útil.
            </p>
          </div>

          {/* Carbonation gradient bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Emissões líquidas ao longo do tempo (considerando carbonatação)
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Produção (t=0)</span>
                <span>50 anos de vida útil</span>
              </div>
              <div className="relative h-8 rounded-full overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, #dc2626 0%, #ef4444 20%, #f97316 40%, #f59e0b 60%, #84cc16 80%, #22c55e 100%)',
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-red-600">100% emissões</span>
                <span className="text-green-600">~75-90% emissões líquidas</span>
              </div>
              <div className="flex items-center justify-center mt-2">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  Reabsorção de 10-25% do CO&#x2082; via carbonatação
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Chart */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Contribuição Típica de Cada Estágio
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Participação percentual de cada estágio nas emissões totais de CO&#x2082;
          de uma estrutura de concreto típica
        </p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CONTRIBUTION_DATA}
              layout="vertical"
              margin={{ left: 140 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fill: '#6b7280' }}
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="stage"
                tick={{ fill: '#6b7280', fontSize: 13 }}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                }}
                formatter={(value: any) => [`${Number(value)}%`, 'Contribuição']}
              />
              <Bar dataKey="percent" name="Contribuição" radius={[0, 8, 8, 0]}>
                {CONTRIBUTION_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. Lifecycle Comparison Chart                                      */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <Layers className="h-5 w-5 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Comparação entre Sistemas Construtivos
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Distribuição percentual das emissões de CO&#x2082; por estágio do
          ciclo de vida para diferentes métodos construtivos
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COMPARISON_DATA}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                tickFormatter={(v: number) => `${v}%`}
                domain={[-10, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value)}%`,
                  String(name),
                ]}
              />
              <Legend />
              {Object.keys(COMPARISON_COLORS).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={COMPARISON_COLORS[key]}
                  name={key}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3 text-xs text-gray-500">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="font-semibold text-gray-700">Moldada in-loco:</span>{' '}
            maior contribuição de A5 (execução no canteiro) devido a perdas e
            energia.
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="font-semibold text-gray-700">Pré-moldada:</span>{' '}
            menor A5, porém maior A1-A3 pelo controle fabril e maior consumo de
            cimento.
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="font-semibold text-gray-700">Benchmark EU:</span>{' '}
            inclui benefícios de reciclagem (D negativo) e estágio B com
            manutenção ao longo de 50 anos.
          </div>
        </div>
      </div>

      {/* Explanation Sections */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-teal-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Emissões Incorporadas vs Operacionais
            </h2>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              <span className="font-semibold text-gray-800">
                Emissões incorporadas
              </span>{' '}
              são aquelas relacionadas aos materiais e processos construtivos
              (estágios A, C e D). São "travadas" no momento da construção e não
              podem ser reduzidas posteriormente.
            </p>
            <p>
              <span className="font-semibold text-gray-800">
                Emissões operacionais
              </span>{' '}
              são aquelas associadas ao uso da edificação (estágio B), como
              energia para climatização e iluminação. Em estruturas de concreto,
              esse componente é relativamente pequeno.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
              <p className="text-teal-800 font-medium">
                Para estruturas de concreto armado, as emissões incorporadas
                representam a quase totalidade da pegada de carbono, tornando
                as decisões de projeto (tipo de cimento, traços, geometria)
                as mais impactantes.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-bold text-gray-800">
              Por que o Estágio de Produto (A1-A3) é o mais importante?
            </h2>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>
              O estágio de produto (A1-A3) responde por aproximadamente{' '}
              <span className="font-bold text-emerald-700">85%</span> das
              emissões totais de CO&#x2082; de uma estrutura de concreto. Isso
              se deve principalmente a:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">1.</span>
                <span>
                  <span className="font-semibold text-gray-800">
                    Clinquerização do cimento:
                  </span>{' '}
                  a decomposição do calcário (CaCO&#x2083;) a ~1.450 C libera
                  grandes quantidades de CO&#x2082;.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">2.</span>
                <span>
                  <span className="font-semibold text-gray-800">
                    Queima de combustíveis:
                  </span>{' '}
                  energia térmica necessária para aquecer o forno rotativo.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">3.</span>
                <span>
                  <span className="font-semibold text-gray-800">
                    Produção do aço:
                  </span>{' '}
                  redução do minério de ferro com coque em alto-forno.
                </span>
              </li>
            </ul>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-emerald-800 font-medium">
                As principais estratégias de redução envolvem: uso de cimentos
                com menor teor de clínquer (CP-III, CP-IV), otimização
                estrutural para reduzir volume de concreto, e especificação de
                aços com maior conteúdo reciclado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 5. Process Flow Diagram                                           */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <ArrowRight className="h-5 w-5 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Fluxo de Produção e Emissões
          </h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Contribuição aproximada de CO&#x2082; em cada etapa do processo
          produtivo, desde a matéria-prima até a estrutura acabada
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-0">
          {FLOW_STEPS.map((step, index) => (
            <div key={step.name} className="flex items-center">
              <div className="flex flex-col items-center w-44">
                <div className="w-full rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 p-5 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold shadow-md">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {step.name}
                  </h3>
                  {step.co2 && (
                    <p className="text-xs font-semibold text-teal-700 bg-teal-100 rounded-full px-2 py-1 inline-block mb-1">
                      {step.co2}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{step.detail}</p>
                </div>
              </div>
              {index < FLOW_STEPS.length - 1 && (
                <div className="flex items-center mx-1 lg:mx-3 text-teal-400">
                  <ArrowRight className="h-6 w-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* 4. Key Concepts Glossary (Accordion)                              */}
      {/* ================================================================= */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <button
          onClick={() => setGlossaryOpen(!glossaryOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-800">
              Glossário de Conceitos-Chave
            </h2>
          </div>
          {glossaryOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {glossaryOpen && (
          <div className="mt-6 space-y-2">
            {GLOSSARY.map((item, index) => (
              <div
                key={item.term}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() =>
                    setOpenGlossary(openGlossary === index ? null : index)
                  }
                  className="flex items-center justify-between w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">
                      {item.term}
                    </span>
                    <span className="text-gray-400 text-sm ml-2">
                      - {item.short}
                    </span>
                  </div>
                  {openGlossary === index ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openGlossary === index && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50 border-t border-gray-100">
                    <p className="pt-3">{item.definition}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
