import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Database, Flame, FlaskConical, Building2, Truck, Zap, Search, Info, Beaker } from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FUELS = [
  { name: 'Alcool etilico', factor: 0, unit: 'kg CO\u2082/L' },
  { name: 'Carvao mineral', factor: 2.26, unit: 'kg CO\u2082/kg' },
  { name: 'Carvao vegetal NR', factor: 3.03, unit: 'kg CO\u2082/kg' },
  { name: 'Carvao vegetal R', factor: 0, unit: 'kg CO\u2082/kg' },
  { name: 'Coque carvao', factor: 2.73, unit: 'kg CO\u2082/kg' },
  { name: 'Coque petroleo', factor: 3.42, unit: 'kg CO\u2082/kg' },
  { name: 'GLP', factor: 2.93, unit: 'kg CO\u2082/kg' },
  { name: 'Gas natural', factor: 2.33, unit: 'kg CO\u2082/m\u00B3' },
  { name: 'Gasolina', factor: 1.63, unit: 'kg CO\u2082/L' },
  { name: 'Lenha NR', factor: 566, unit: 'kg CO\u2082/t' },
  { name: 'Lenha R', factor: 0, unit: 'kg CO\u2082/t' },
  { name: 'Oleo combustível', factor: 3.11, unit: 'kg CO\u2082/kg' },
  { name: 'Oleo diesel', factor: 2.29, unit: 'kg CO\u2082/L' },
  { name: 'Residuo madeira R', factor: 0, unit: 'kg CO\u2082/kg' },
  { name: 'Residuo oleo', factor: 3.11, unit: 'kg CO\u2082/kg' },
  { name: 'Residuo pneu', factor: 3.14, unit: 'kg CO\u2082/kg' },
  { name: 'Residuo plastico', factor: 1.98, unit: 'kg CO\u2082/kg' },
];

const FUELS_CHART = FUELS.filter((f) => f.factor > 0 && f.factor < 100);

const CARBONATES = [
  { formula: 'CaCO\u2083', name: 'Calcita', factor: '0,44' },
  { formula: 'MgCO\u2083', name: 'Magnesita', factor: '0,52' },
  { formula: 'CaMg(CO\u2083)\u2082', name: 'Dolomita', factor: '0,48' },
  { formula: 'FeCO\u2083', name: 'Siderita', factor: '0,38' },
  { formula: '-', name: 'Ankerita', factor: '0,41 \u2013 0,48' },
  { formula: 'MnCO\u2083', name: 'Rodocrosita', factor: '0,38' },
  { formula: 'Na\u2082CO\u2083', name: 'Carbonato de sodio', factor: '0,41' },
];

const MATERIALS = [
  { name: 'Cimento CP-II-F', min: 600, max: 750, unit: 'kg CO\u2082/t' },
  { name: 'Cimento CP-II-Z', min: 450, max: 650, unit: 'kg CO\u2082/t' },
  { name: 'Cimento CP-III', min: 300, max: 500, unit: 'kg CO\u2082/t' },
  { name: 'Cimento CP-IV', min: 350, max: 550, unit: 'kg CO\u2082/t' },
  { name: 'Cimento CP-V ARI', min: 700, max: 850, unit: 'kg CO\u2082/t' },
  { name: 'Areia', min: 0, max: 12.51, unit: 'kg CO\u2082/t' },
  { name: 'Brita', min: 0, max: 4.669, unit: 'kg CO\u2082/t' },
  { name: 'Aco CA-50/CA-60', min: 800, max: 2200, unit: 'kg CO\u2082/t' },
];

const CEMENT_CHART = MATERIALS.filter((m) => m.name.startsWith('Cimento'));

const TRANSPORT = [
  { vehicle: 'Caminhao Toco 2E', factor: 0.09778 },
  { vehicle: 'Truck 3E', factor: 0.06801 },
  { vehicle: 'Carreta 5E', factor: 0.06091 },
];

const ELECTRICITY_FACTOR = 0.07; // kg CO2/kWh

const CEMENT_COLORS = ['#059669', '#0d9488', '#14b8a6', '#2dd4bf', '#065f46'];

// ---------------------------------------------------------------------------
// Radar Chart Data (Cement comparison)
// ---------------------------------------------------------------------------

const CEMENT_RADAR_DATA = [
  {
    dimension: 'Emissão (inv.)',
    'CP-II-F': 4,
    'CP-II-Z': 6,
    'CP-III': 9,
    'CP-IV': 7,
    'CP-V ARI': 2,
  },
  {
    dimension: 'Disponibilidade',
    'CP-II-F': 9,
    'CP-II-Z': 8,
    'CP-III': 6,
    'CP-IV': 5,
    'CP-V ARI': 6,
  },
  {
    dimension: 'Clínquer (inv.)',
    'CP-II-F': 3,
    'CP-II-Z': 6,
    'CP-III': 9,
    'CP-IV': 7,
    'CP-V ARI': 1,
  },
];

// ---------------------------------------------------------------------------
// Cement Composition Data
// ---------------------------------------------------------------------------

const CEMENT_COMPOSITION = [
  {
    type: 'CP-II-F',
    description: 'Clínquer + filer calcário (6-10%)',
    clinkerPct: 92,
    additivePct: 8,
    additiveLabel: 'Filer calcário',
    color: '#059669',
  },
  {
    type: 'CP-II-Z',
    description: 'Clínquer + pozolana (6-14%)',
    clinkerPct: 86,
    additivePct: 14,
    additiveLabel: 'Pozolana',
    color: '#0d9488',
  },
  {
    type: 'CP-III',
    description: 'Clínquer + escoria de alto forno (35-75%)',
    clinkerPct: 45,
    additivePct: 55,
    additiveLabel: 'Escoria',
    color: '#14b8a6',
  },
  {
    type: 'CP-IV',
    description: 'Clínquer + pozolana (15-50%)',
    clinkerPct: 67,
    additivePct: 33,
    additiveLabel: 'Pozolana',
    color: '#2dd4bf',
  },
  {
    type: 'CP-V ARI',
    description: 'Clínquer + sulfatos (alta resistencia inicial)',
    clinkerPct: 95,
    additivePct: 5,
    additiveLabel: 'Sulfatos',
    color: '#065f46',
  },
];

// ---------------------------------------------------------------------------
// Info Box Component
// ---------------------------------------------------------------------------

function InfoBox({ text }: { text: string }) {
  return (
    <div className="mb-6 flex gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
      <Info className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-emerald-800 leading-relaxed">{text}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Wrapper
// ---------------------------------------------------------------------------

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function EmissionFactors() {
  const [searchTerm, setSearchTerm] = useState('');

  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const matches = (text: string) => normalize(text).includes(normalize(searchTerm));

  const filteredFuels = searchTerm ? FUELS.filter((f) => matches(f.name)) : FUELS;
  const filteredCarbonates = searchTerm ? CARBONATES.filter((c) => matches(c.name) || matches(c.formula)) : CARBONATES;
  const filteredMaterials = searchTerm ? MATERIALS.filter((m) => matches(m.name)) : MATERIALS;
  const filteredTransport = searchTerm ? TRANSPORT.filter((t) => matches(t.vehicle)) : TRANSPORT;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-400 p-3 text-white shadow-md">
            <Database className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Fatores de Emissão
          </h1>
        </div>
        <p className="text-gray-500">
          Referencia completa dos fatores de emissão de CO&#x2082; utilizados nos
          cálculos, com base no boletim tecnico IBRACON.
        </p>
      </div>

      {/* Quick Fact Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: '17 combustíveis catalogados', icon: <Flame className="h-5 w-5 text-orange-500" />, bg: 'from-orange-50 to-amber-50', border: 'border-orange-200' },
          { label: '5 tipos de cimento', icon: <Building2 className="h-5 w-5 text-emerald-600" />, bg: 'from-emerald-50 to-teal-50', border: 'border-emerald-200' },
          { label: '3 modos de transporte', icon: <Truck className="h-5 w-5 text-cyan-600" />, bg: 'from-cyan-50 to-sky-50', border: 'border-cyan-200' },
          { label: '0,07 kg CO\u2082/kWh na rede BR', icon: <Zap className="h-5 w-5 text-yellow-500" />, bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-200' },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.bg} border ${card.border} p-4 flex items-center gap-3`}
          >
            <div className="flex-shrink-0">{card.icon}</div>
            <p className="text-sm font-semibold text-gray-700">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Search / Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filtrar por nome em todas as tabelas..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Section 1: Combustíveis */}
      <Section
        icon={<Flame className="h-6 w-6 text-orange-500" />}
        title="Combustíveis"
      >
        <InfoBox text="Os fatores de emissão de combustíveis sao baseados no IPCC e representam o CO\u2082 liberado pela combustao completa. Combustíveis de biomassa renovavel (alcool, lenha renovavel, carvao vegetal renovavel) sao considerados neutros pois o CO\u2082 foi absorvido durante o crescimento da biomassa." />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-600 rounded-tl-xl">
                  Combustível
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">
                  Fator de Emissão
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right rounded-tr-xl">
                  Unidade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFuels.map((fuel) => (
                <tr
                  key={fuel.name}
                  className="hover:bg-emerald-50/40 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {fuel.name}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600 tabular-nums">
                    {fuel.factor === 0 ? (
                      <span className="text-emerald-600 font-semibold">0 (neutro)</span>
                    ) : (
                      fuel.factor
                    )}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-500">
                    {fuel.unit}
                  </td>
                </tr>
              ))}
              {filteredFuels.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Nenhum combustível encontrado para &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fuel Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Comparação dos Fatores de Emissão de Combustíveis
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={FUELS_CHART}
                layout="vertical"
                margin={{ left: 120 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  tick={{ fill: '#6b7280' }}
                  label={{
                    value: 'kg CO\u2082',
                    position: 'insideBottom',
                    offset: -4,
                    style: { fill: '#6b7280' },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar
                  dataKey="factor"
                  name="Fator"
                  fill="#f59e0b"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>

      {/* Section 2: Carbonatos */}
      <Section
        icon={<FlaskConical className="h-6 w-6 text-violet-500" />}
        title="Carbonatos"
      >
        <InfoBox text="A calcinação é a decomposição térmica de carbonatos (como o calcário CaCO\u2083) em óxidos e CO\u2082. É a principal fonte de emissões de processo na fabricação de cimento, onde o calcário é aquecido a ~1450\u00B0C para produzir clínquer." />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-600 rounded-tl-xl">
                  Formula
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600">
                  Mineral
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right rounded-tr-xl">
                  Fator (t CO&#x2082; / t carbonato)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCarbonates.map((c) => (
                <tr
                  key={c.name}
                  className="hover:bg-violet-50/40 transition"
                >
                  <td className="px-6 py-3 font-mono text-gray-700">
                    {c.formula}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {c.name}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-600">
                    {c.factor}
                  </td>
                </tr>
              ))}
              {filteredCarbonates.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Nenhum carbonato encontrado para &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 3: Materiais de Construção */}
      <Section
        icon={<Building2 className="h-6 w-6 text-emerald-600" />}
        title="Materiais de Construção"
      >
        <InfoBox text="Os fatores de emissão de materiais consideram as etapas A1 a A3 (berco ao portao). A grande variacao entre os valores minimo e maximo reflete diferencas entre fabricantes, tecnologias e fontes de energia. Dados específicos (DAPs) são preferíveis quando disponíveis." />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-600 rounded-tl-xl">
                  Material
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">
                  Minimo
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">
                  Maximo
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right rounded-tr-xl">
                  Unidade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMaterials.map((m) => (
                <tr
                  key={m.name}
                  className="hover:bg-emerald-50/40 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {m.name}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-600">
                    {m.min}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-600">
                    {m.max}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-500">
                    {m.unit}
                  </td>
                </tr>
              ))}
              {filteredMaterials.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    Nenhum material encontrado para &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cement Chart */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Comparação dos Tipos de Cimento
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CEMENT_CHART} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  tickFormatter={(v: string) => v.replace('Cimento ', '')}
                />
                <YAxis
                  tick={{ fill: '#6b7280' }}
                  label={{
                    value: 'kg CO\u2082 / t',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: '#6b7280' },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="min" name="Minimo" radius={[8, 8, 0, 0]}>
                  {CEMENT_CHART.map((_, i) => (
                    <Cell
                      key={`min-${i}`}
                      fill={CEMENT_COLORS[i % CEMENT_COLORS.length]}
                      opacity={0.6}
                    />
                  ))}
                </Bar>
                <Bar dataKey="max" name="Maximo" radius={[8, 8, 0, 0]}>
                  {CEMENT_CHART.map((_, i) => (
                    <Cell
                      key={`max-${i}`}
                      fill={CEMENT_COLORS[i % CEMENT_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart: Cement Comparison */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Comparação Visual dos Cimentos
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Radar comparando emissão (invertido, quanto maior melhor), disponibilidade no mercado e teor de clínquer (invertido). Escala de 1 a 10.
          </p>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={CEMENT_RADAR_DATA} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#d1d5db" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#4b5563', fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar name="CP-II-F" dataKey="CP-II-F" stroke="#059669" fill="#059669" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CP-II-Z" dataKey="CP-II-Z" stroke="#0d9488" fill="#0d9488" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CP-III" dataKey="CP-III" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CP-IV" dataKey="CP-IV" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="CP-V ARI" dataKey="CP-V ARI" stroke="#065f46" fill="#065f46" fillOpacity={0.15} strokeWidth={2} />
                <Legend />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cement Composition Cards */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Beaker className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-700">
              Composição dos Tipos de Cimento
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CEMENT_COMPOSITION.map((cement) => (
              <div
                key={cement.type}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cement.color }}
                  />
                  <h4 className="text-base font-bold text-gray-800">
                    {cement.type}
                  </h4>
                </div>
                <p className="text-sm text-gray-500 mb-4">{cement.description}</p>

                {/* Composition Bar */}
                <div className="flex rounded-lg overflow-hidden h-6 bg-gray-100">
                  <div
                    className="flex items-center justify-center text-xs font-semibold text-white"
                    style={{
                      width: `${cement.clinkerPct}%`,
                      backgroundColor: cement.color,
                    }}
                  >
                    {cement.clinkerPct}% Clínquer
                  </div>
                  <div
                    className="flex items-center justify-center text-xs font-semibold text-gray-700 bg-emerald-100"
                    style={{ width: `${cement.additivePct}%` }}
                  >
                    {cement.additivePct}%
                  </div>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-500">Clínquer</span>
                  <span className="text-xs text-gray-500">{cement.additiveLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4: Transporte */}
      <Section
        icon={<Truck className="h-6 w-6 text-cyan-600" />}
        title="Transporte"
      >
        <InfoBox text="Os fatores de transporte sao expressos em kg CO\u2082 por tonelada-quilometro (t\u00B7km). Caminhoes maiores sao mais eficientes por unidade transportada. Quando o veiculo retorna vazio, a distancia deve ser multiplicada por 2." />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-600 rounded-tl-xl">
                  Veiculo
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right rounded-tr-xl">
                  Fator (kg CO&#x2082; / t.km)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransport.map((t) => (
                <tr
                  key={t.vehicle}
                  className="hover:bg-cyan-50/40 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {t.vehicle}
                  </td>
                  <td className="px-6 py-3 text-right tabular-nums text-gray-600">
                    {t.factor}
                  </td>
                </tr>
              ))}
              {filteredTransport.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-400">
                    Nenhum veiculo encontrado para &quot;{searchTerm}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 5: Eletricidade */}
      <Section
        icon={<Zap className="h-6 w-6 text-yellow-500" />}
        title="Eletricidade"
      >
        <InfoBox text="O fator de emissão da rede elétrica brasileira é relativamente baixo (0,07 kg CO\u2082/kWh) devido a alta participacao de hidreletricas na matriz energetica. Este valor pode variar dependendo do periodo e das condicoes hidrologicas." />

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 rounded-xl p-4">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Grid brasileira (fator médio)
              </p>
              <p className="text-3xl font-extrabold text-gray-800">
                {ELECTRICITY_FACTOR}{' '}
                <span className="text-base font-medium text-gray-500">
                  kg CO&#x2082; / kWh
                </span>
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Source */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-400 italic">
          Fonte: Sidac / DAPs / IPCC
        </p>
      </div>
    </div>
  );
}
