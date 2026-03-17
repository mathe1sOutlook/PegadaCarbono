import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  Building2,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TreePine,
  Car,
  Plane,
  Home,
  TrendingDown,
  BarChart3,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

interface ElementData {
  label: string;
  concrete: number; // m³
  steel: number;    // kg
}

interface CementOption {
  label: string;
  factorPerM3: number; // kg CO₂ / m³ of concrete
}

const CEMENT_TYPES: Record<string, CementOption> = {
  'CP-II-F':  { label: 'CP-II-F (Filler)',       factorPerM3: 300 },
  'CP-II-Z':  { label: 'CP-II-Z (Pozolânico)',   factorPerM3: 230 },
  'CP-III':   { label: 'CP-III (Alto-forno)',     factorPerM3: 170 },
  'CP-IV':    { label: 'CP-IV (Pozolânico)',      factorPerM3: 190 },
  'CP-V-ARI': { label: 'CP-V ARI (Alta resist.)', factorPerM3: 320 },
};

const STEEL_FACTOR = 1.5; // kg CO₂ / kg steel (CA-50 average)

const ELEMENT_COLORS = ['#059669', '#0d9488', '#14b8a6', '#34d399'];
const STACK_COLORS = { concrete: '#059669', steel: '#0d9488' };

const RADIAN = Math.PI / 180;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const renderPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

const fmt = (n: number) =>
  n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StructureCalc() {
  // Building data
  const [builtArea, setBuiltArea] = useState(5000);
  const [floors, setFloors] = useState(10);

  // Cement type
  const [cementType, setCementType] = useState('CP-II-F');

  // Structural elements
  const [elements, setElements] = useState<ElementData[]>([
    { label: 'Fundações', concrete: 200, steel: 8000 },
    { label: 'Pilares',   concrete: 150, steel: 12000 },
    { label: 'Vigas',     concrete: 180, steel: 15000 },
    { label: 'Lajes',     concrete: 400, steel: 20000 },
  ]);

  const updateElement = (
    idx: number,
    field: 'concrete' | 'steel',
    value: number,
  ) => {
    setElements((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // ---------------------------------------------------------------------------
  // Calculations
  // ---------------------------------------------------------------------------

  const cementFactor = CEMENT_TYPES[cementType].factorPerM3;

  const results = useMemo(() => {
    const perElement = elements.map((el) => {
      const co2Concrete = el.concrete * cementFactor;
      const co2Steel = el.steel * STEEL_FACTOR;
      return {
        label: el.label,
        co2Concrete,
        co2Steel,
        co2Total: co2Concrete + co2Steel,
      };
    });

    const totalCO2 = perElement.reduce((s, e) => s + e.co2Total, 0);
    const co2PerM2 = builtArea > 0 ? totalCO2 / builtArea : 0;

    return { perElement, totalCO2, co2PerM2 };
  }, [elements, cementFactor, builtArea]);

  // Equivalency calculations
  const equivalencies = useMemo(() => {
    const totalKg = results.totalCO2;
    const treesNeeded = Math.ceil(totalKg / 22); // 1 tree = 22 kg CO2/year
    const yearsWithTrees = (n: number) => (totalKg / (n * 22));
    const carsEquiv = totalKg / 2400; // avg car = 2400 kg CO2/year
    const flightsSPMiami = totalKg / 1200; // 1 flight ~ 1200 kg CO2/person
    const householdsElectricity = totalKg / 126; // avg BR household = ~126 kg CO2/year from electricity
    return { treesNeeded, yearsWithTrees, carsEquiv, flightsSPMiami, householdsElectricity };
  }, [results.totalCO2]);

  // Per-floor analysis
  const perFloor = useMemo(() => {
    const floorCount = Math.max(floors, 1);
    const co2PerFloor = results.totalCO2 / floorCount;
    const areaPerFloor = builtArea / floorCount;
    const co2PerM2PerFloor = areaPerFloor > 0 ? co2PerFloor / areaPerFloor : 0;
    return { co2PerFloor, co2PerM2PerFloor, areaPerFloor };
  }, [results.totalCO2, floors, builtArea]);

  // Material efficiency indicators
  const materialEfficiency = useMemo(() => {
    const totalConcrete = elements.reduce((s, e) => s + e.concrete, 0);
    const totalSteel = elements.reduce((s, e) => s + e.steel, 0);
    const steelRatio = totalConcrete > 0 ? totalSteel / totalConcrete : 0; // kg steel / m³ concrete
    const concreteConsumption = builtArea > 0 ? totalConcrete / builtArea : 0; // m³ concrete / m² built
    return { steelRatio, concreteConsumption, totalConcrete, totalSteel };
  }, [elements, builtArea]);

  // Cement type comparison data (CO2 for each cement type)
  const cementComparisonData = useMemo(() => {
    const totalConcrete = elements.reduce((s, e) => s + e.concrete, 0);
    const totalSteelCO2 = elements.reduce((s, e) => s + e.steel, 0) * STEEL_FACTOR;
    return Object.entries(CEMENT_TYPES).map(([key, opt]) => ({
      name: key,
      total: Math.round(totalConcrete * opt.factorPerM3 + totalSteelCO2),
      isCurrent: key === cementType,
    }));
  }, [elements, cementType]);

  // Chart data
  const barData = results.perElement.map((e) => ({
    name: e.label,
    Concreto: Math.round(e.co2Concrete),
    Aço: Math.round(e.co2Steel),
  }));

  const pieData = results.perElement.map((e) => ({
    name: e.label,
    value: Math.round(e.co2Total),
  }));

  // Benchmark
  const benchmarkMin = 60;
  const benchmarkMax = 90;
  const co2m2 = results.co2PerM2;
  const inBenchmark = co2m2 >= benchmarkMin && co2m2 <= benchmarkMax;
  const belowBenchmark = co2m2 < benchmarkMin;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-emerald-300" />
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Calculadora de Estrutura
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-lg text-emerald-100">
            Estime as emissões de CO&#8322; da estrutura de concreto armado da
            sua edificação.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* ---- Input Section ---- */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Building data */}
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Dados da Edificação
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Área total construída (m²)
                </label>
                <input
                  type="number"
                  min={1}
                  value={builtArea}
                  onChange={(e) => setBuiltArea(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Número de pavimentos
                </label>
                <input
                  type="number"
                  min={1}
                  value={floors}
                  onChange={(e) => setFloors(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Tipo de cimento
                </label>
                <select
                  value={cementType}
                  onChange={(e) => setCementType(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition bg-white"
                >
                  {Object.entries(CEMENT_TYPES).map(([key, opt]) => (
                    <option key={key} value={key}>
                      {opt.label} — {opt.factorPerM3} kg CO&#8322;/m³
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Structural elements */}
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Elementos Estruturais
            </h2>

            <div className="space-y-5">
              {elements.map((el, idx) => (
                <div key={el.label}>
                  <p className="text-sm font-semibold text-emerald-700 mb-2">
                    {el.label}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Concreto (m³)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={el.concrete}
                        onChange={(e) =>
                          updateElement(idx, 'concrete', Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Aço (kg)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={el.steel}
                        onChange={(e) =>
                          updateElement(idx, 'steel', Number(e.target.value))
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Results Summary ---- */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-6 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-100">
              Total de CO&#8322;
            </p>
            <p className="mt-2 text-3xl font-extrabold">
              {fmt(results.totalCO2)} kg
            </p>
            <p className="mt-1 text-emerald-100 text-sm">
              {fmt(results.totalCO2 / 1000)} t CO&#8322;
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 p-6 text-white shadow-lg">
            <p className="text-sm font-medium uppercase tracking-wider text-teal-100">
              CO&#8322; por m²
            </p>
            <p className="mt-2 text-3xl font-extrabold">
              {fmt(co2m2)} kg/m²
            </p>
            <p className="mt-1 text-teal-100 text-sm">
              Referência: {benchmarkMin}–{benchmarkMax} kg CO&#8322;/m²
            </p>
          </div>

          <div
            className={`rounded-2xl p-6 text-white shadow-lg ${
              belowBenchmark
                ? 'bg-gradient-to-br from-emerald-600 to-green-500'
                : inBenchmark
                ? 'bg-gradient-to-br from-amber-500 to-yellow-500'
                : 'bg-gradient-to-br from-red-500 to-orange-500'
            }`}
          >
            <p className="text-sm font-medium uppercase tracking-wider opacity-80">
              Benchmark
            </p>
            <div className="mt-2 flex items-center gap-2">
              {belowBenchmark ? (
                <CheckCircle className="h-7 w-7" />
              ) : (
                <AlertTriangle className="h-7 w-7" />
              )}
              <p className="text-xl font-extrabold">
                {belowBenchmark
                  ? 'Abaixo da faixa típica'
                  : inBenchmark
                  ? 'Dentro da faixa típica'
                  : 'Acima da faixa típica'}
              </p>
            </div>
            <p className="mt-1 text-sm opacity-80">
              Faixa típica: {benchmarkMin}–{benchmarkMax} kg CO&#8322;/m²
            </p>
          </div>
        </div>

        {/* ---- Charts ---- */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Stacked bar */}
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Emissões por Elemento
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Contribuição do concreto e aço (kg CO&#8322;)
            </p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis
                    tick={{ fill: '#6b7280' }}
                    label={{
                      value: 'kg CO₂',
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
                    formatter={(value: any) => [
                      `${fmt(Number(value))} kg CO₂`,
                      undefined,
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="Concreto"
                    stackId="a"
                    fill={STACK_COLORS.concrete}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="Aço"
                    stackId="a"
                    fill={STACK_COLORS.steel}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie chart */}
          <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
            <h2 className="text-xl font-bold text-gray-800">
              Distribuição por Elemento
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Participação percentual de cada elemento
            </p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    labelLine={false}
                    label={renderPieLabel}
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={`pie-${i}`}
                        fill={ELEMENT_COLORS[i % ELEMENT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `${fmt(Number(value))} kg CO₂`,
                      undefined,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Benchmark bar */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Posição no Benchmark
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comparação do resultado com a faixa de referência (60–90 kg
            CO&#8322;/m²)
          </p>
          <div className="mt-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[{ name: 'Sua edificação', value: Math.round(co2m2) }]}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  domain={[0, Math.max(120, Math.round(co2m2 * 1.2))]}
                  tick={{ fill: '#6b7280' }}
                  label={{
                    value: 'kg CO₂ / m²',
                    position: 'insideBottom',
                    offset: -4,
                    style: { fill: '#6b7280' },
                  }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#6b7280' }}
                  width={120}
                />
                <ReferenceArea
                  x1={benchmarkMin}
                  x2={benchmarkMax}
                  fill="#059669"
                  fillOpacity={0.1}
                  label={{
                    value: 'Faixa típica',
                    position: 'insideTopRight',
                    fill: '#059669',
                    fontSize: 12,
                  }}
                />
                <ReferenceLine
                  x={benchmarkMin}
                  stroke="#059669"
                  strokeDasharray="4 4"
                />
                <ReferenceLine
                  x={benchmarkMax}
                  stroke="#059669"
                  strokeDasharray="4 4"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  }}
                  formatter={(value: any) => [
                    `${fmt(Number(value))} kg CO₂/m²`,
                    undefined,
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill={
                    belowBenchmark
                      ? '#059669'
                      : inBenchmark
                      ? '#f59e0b'
                      : '#ef4444'
                  }
                  radius={[0, 8, 8, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ---- Detail Table ---- */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100 overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Detalhamento por Elemento
          </h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="py-3 pr-4 font-medium">Elemento</th>
                <th className="py-3 pr-4 font-medium text-right">
                  Concreto (m³)
                </th>
                <th className="py-3 pr-4 font-medium text-right">
                  Aço (kg)
                </th>
                <th className="py-3 pr-4 font-medium text-right">
                  CO&#8322; Concreto (kg)
                </th>
                <th className="py-3 pr-4 font-medium text-right">
                  CO&#8322; Aço (kg)
                </th>
                <th className="py-3 font-medium text-right">
                  CO&#8322; Total (kg)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.perElement.map((r, i) => (
                <tr
                  key={r.label}
                  className="border-b border-gray-100 hover:bg-emerald-50/50 transition"
                >
                  <td className="py-3 pr-4 font-medium text-gray-800">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: ELEMENT_COLORS[i] }}
                    />
                    {r.label}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-600">
                    {fmt(elements[i].concrete)}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-600">
                    {fmt(elements[i].steel)}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-600">
                    {fmt(r.co2Concrete)}
                  </td>
                  <td className="py-3 pr-4 text-right text-gray-600">
                    {fmt(r.co2Steel)}
                  </td>
                  <td className="py-3 text-right font-semibold text-gray-800">
                    {fmt(r.co2Total)}
                  </td>
                </tr>
              ))}
              <tr className="font-bold text-gray-800">
                <td className="py-3 pr-4">Total</td>
                <td className="py-3 pr-4 text-right">
                  {fmt(elements.reduce((s, e) => s + e.concrete, 0))}
                </td>
                <td className="py-3 pr-4 text-right">
                  {fmt(elements.reduce((s, e) => s + e.steel, 0))}
                </td>
                <td className="py-3 pr-4 text-right">
                  {fmt(
                    results.perElement.reduce((s, e) => s + e.co2Concrete, 0),
                  )}
                </td>
                <td className="py-3 pr-4 text-right">
                  {fmt(results.perElement.reduce((s, e) => s + e.co2Steel, 0))}
                </td>
                <td className="py-3 text-right">{fmt(results.totalCO2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ---- Equivalency Section ---- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <TrendingDown className="h-7 w-7 text-emerald-600" />
            Equivalências de Emissão
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Trees */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-2.5 text-white shadow-md">
                  <TreePine className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Árvores para Compensar</h3>
              </div>
              <p className="text-3xl font-extrabold text-emerald-700">
                {fmt(equivalencies.treesNeeded)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                árvores necessárias (1 árvore = 22 kg CO&#8322;/ano)
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Com 10 árvores: {fmt(equivalencies.yearsWithTrees(10))} anos para compensar
              </p>
            </div>

            {/* Cars */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 text-white shadow-md">
                  <Car className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Equivalente em Carros</h3>
              </div>
              <p className="text-3xl font-extrabold text-teal-700">
                {fmt(equivalencies.carsEquiv)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                carros rodando por 1 ano
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Carro médio: 2.400 kg CO&#8322;/ano
              </p>
            </div>

            {/* Flights */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-md">
                  <Plane className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Voos SP → Miami</h3>
              </div>
              <p className="text-3xl font-extrabold text-cyan-700">
                {fmt(equivalencies.flightsSPMiami)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                voos por pessoa (ida)
              </p>
              <p className="mt-2 text-xs text-gray-400">
                1 voo ≈ 1.200 kg CO&#8322;/pessoa
              </p>
            </div>

            {/* Households */}
            <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-100 hover:shadow-xl transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 p-2.5 text-white shadow-md">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Residências (eletricidade)</h3>
              </div>
              <p className="text-3xl font-extrabold text-emerald-800">
                {fmt(equivalencies.householdsElectricity)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                residências por 1 ano
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Média BR: ~126 kg CO&#8322;/ano (eletricidade)
              </p>
            </div>
          </div>
        </div>

        {/* ---- Per-Floor Analysis ---- */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Análise por Pavimento
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Distribuição das emissões considerando {floors} pavimento{floors > 1 ? 's' : ''}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 ring-1 ring-emerald-100">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
                CO&#8322; por pavimento
              </p>
              <p className="mt-2 text-2xl font-extrabold text-gray-800">
                {fmt(perFloor.co2PerFloor)} kg
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {fmt(perFloor.co2PerFloor / 1000)} t CO&#8322;/pavimento
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-5 ring-1 ring-teal-100">
              <p className="text-xs font-medium uppercase tracking-wider text-teal-600">
                CO&#8322; por m² por pavimento
              </p>
              <p className="mt-2 text-2xl font-extrabold text-gray-800">
                {fmt(perFloor.co2PerM2PerFloor)} kg/m²
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Área por pavimento: {fmt(perFloor.areaPerFloor)} m²
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50 p-5 ring-1 ring-cyan-100">
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-600">
                Total do edifício
              </p>
              <p className="mt-2 text-2xl font-extrabold text-gray-800">
                {fmt(results.totalCO2 / 1000)} t
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {floors} pavimento{floors > 1 ? 's' : ''} × {fmt(perFloor.co2PerFloor)} kg
              </p>
            </div>
          </div>
        </div>

        {/* ---- Material Efficiency Indicators ---- */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Indicadores de Eficiência de Materiais
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Compare seus índices com faixas típicas de edifícios de concreto armado
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Steel ratio */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-emerald-50 p-6 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Taxa de aço
              </p>
              <p className="text-3xl font-extrabold text-gray-800">
                {fmt(materialEfficiency.steelRatio)} <span className="text-lg font-medium text-gray-500">kg/m³</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                kg de aço por m³ de concreto
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Faixa típica: 80–120 kg/m³</span>
                  <span
                    className={`font-semibold ${
                      materialEfficiency.steelRatio >= 80 && materialEfficiency.steelRatio <= 120
                        ? 'text-emerald-600'
                        : materialEfficiency.steelRatio < 80
                        ? 'text-amber-600'
                        : 'text-red-500'
                    }`}
                  >
                    {materialEfficiency.steelRatio >= 80 && materialEfficiency.steelRatio <= 120
                      ? 'Dentro da faixa'
                      : materialEfficiency.steelRatio < 80
                      ? 'Abaixo da faixa'
                      : 'Acima da faixa'}
                  </span>
                </div>
                <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute inset-y-0 bg-emerald-200 rounded-full"
                    style={{ left: `${(80 / 200) * 100}%`, width: `${((120 - 80) / 200) * 100}%` }}
                  />
                  <div
                    className={`absolute top-0 h-3 w-3 rounded-full border-2 border-white shadow ${
                      materialEfficiency.steelRatio >= 80 && materialEfficiency.steelRatio <= 120
                        ? 'bg-emerald-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ left: `${Math.min((materialEfficiency.steelRatio / 200) * 100, 100)}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
              </div>
            </div>

            {/* Concrete consumption */}
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-teal-50 p-6 ring-1 ring-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Consumo de concreto
              </p>
              <p className="text-3xl font-extrabold text-gray-800">
                {materialEfficiency.concreteConsumption.toFixed(3)} <span className="text-lg font-medium text-gray-500">m³/m²</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                m³ de concreto por m² de área construída
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Faixa típica: 0,15–0,25 m³/m²</span>
                  <span
                    className={`font-semibold ${
                      materialEfficiency.concreteConsumption >= 0.15 && materialEfficiency.concreteConsumption <= 0.25
                        ? 'text-emerald-600'
                        : materialEfficiency.concreteConsumption < 0.15
                        ? 'text-amber-600'
                        : 'text-red-500'
                    }`}
                  >
                    {materialEfficiency.concreteConsumption >= 0.15 && materialEfficiency.concreteConsumption <= 0.25
                      ? 'Dentro da faixa'
                      : materialEfficiency.concreteConsumption < 0.15
                      ? 'Abaixo da faixa'
                      : 'Acima da faixa'}
                  </span>
                </div>
                <div className="relative h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="absolute inset-y-0 bg-teal-200 rounded-full"
                    style={{ left: `${(0.15 / 0.5) * 100}%`, width: `${((0.25 - 0.15) / 0.5) * 100}%` }}
                  />
                  <div
                    className={`absolute top-0 h-3 w-3 rounded-full border-2 border-white shadow ${
                      materialEfficiency.concreteConsumption >= 0.15 && materialEfficiency.concreteConsumption <= 0.25
                        ? 'bg-teal-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ left: `${Math.min((materialEfficiency.concreteConsumption / 0.5) * 100, 100)}%`, transform: 'translateX(-50%)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Cement Type Comparison Chart ---- */}
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            Comparação por Tipo de Cimento
          </h2>
          <p className="mt-1 text-sm text-gray-500 mb-6">
            Total de CO&#8322; estimado para cada tipo de cimento — o tipo selecionado está destacado
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cementComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                <YAxis
                  tick={{ fill: '#6b7280' }}
                  label={{
                    value: 'kg CO₂ (total)',
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
                  formatter={(value: any, _name: any, props: any) => [
                    `${fmt(Number(value))} kg CO₂${props.payload.isCurrent ? ' (selecionado)' : ''}`,
                    'Total',
                  ]}
                />
                <Bar dataKey="total" radius={[8, 8, 0, 0]} barSize={48}>
                  {cementComparisonData.map((entry, index) => (
                    <Cell
                      key={`cement-${index}`}
                      fill={entry.isCurrent ? '#059669' : '#a7f3d0'}
                      stroke={entry.isCurrent ? '#047857' : 'transparent'}
                      strokeWidth={entry.isCurrent ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-emerald-600" />
              Tipo selecionado
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded bg-emerald-200" />
              Outros tipos
            </div>
          </div>
        </div>

        {/* ---- Reduction Strategies ---- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Lightbulb className="h-7 w-7 text-emerald-600" />
            Estratégias para Redução de Emissões
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 ring-1 ring-emerald-100 hover:shadow-lg transition">
              <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 text-white shadow-md w-fit mb-4">
                <TrendingDown className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-800 mb-2">
                Otimize a geometria estrutural
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Reduzir vãos livres e espessuras de elementos estruturais diminui
                o consumo de concreto e aço, impactando diretamente as emissões.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 p-6 ring-1 ring-teal-100 hover:shadow-lg transition">
              <div className="rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 text-white shadow-md w-fit mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-teal-800 mb-2">
                Use cimentos de baixo carbono
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Cimentos CP-III (alto-forno) e CP-IV (pozolânico) podem reduzir
                as emissões do concreto em até 45% em relação ao CP-V ARI.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-cyan-50 to-emerald-50 p-6 ring-1 ring-cyan-100 hover:shadow-lg transition">
              <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-2.5 text-white shadow-md w-fit mb-4">
                <CheckCircle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-cyan-800 mb-2">
                Aumente o uso de aço reciclado
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                O aço produzido a partir de sucata metálica (forno elétrico)
                emite significativamente menos CO&#8322; que o aço virgem.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 ring-1 ring-emerald-100 hover:shadow-lg transition">
              <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-green-500 p-2.5 text-white shadow-md w-fit mb-4">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-emerald-800 mb-2">
                Considere pré-moldados
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Elementos pré-moldados têm menor desperdício (menor A5), controle
                de qualidade superior e podem reduzir o consumo total de material.
              </p>
            </div>
          </div>
        </div>

        {/* ---- Tip Section ---- */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 shadow-lg ring-1 ring-emerald-100">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-3 text-white shadow-md">
              <Lightbulb className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-800">
                Dica: Reduza as emissões mudando o tipo de cimento
              </h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                A escolha do tipo de cimento tem impacto significativo nas
                emissões de CO&#8322;. Cimentos com adições minerais, como o{' '}
                <strong>CP-III</strong> (alto-forno) e o <strong>CP-IV</strong>{' '}
                (pozolânico), substituem parte do clínquer por escória ou
                pozolana, reduzindo as emissões em até{' '}
                <strong>40-45%</strong> em relação ao CP-V ARI.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(CEMENT_TYPES).map(([key, opt]) => (
                  <div
                    key={key}
                    className={`rounded-xl px-4 py-3 text-sm transition ${
                      key === cementType
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-gray-700 ring-1 ring-gray-200'
                    }`}
                  >
                    <p className="font-semibold">{key}</p>
                    <p className={key === cementType ? 'text-emerald-100' : 'text-gray-500'}>
                      {opt.factorPerM3} kg CO&#8322;/m³
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">
                Consulte seu projetista estrutural para verificar a
                compatibilidade do tipo de cimento com as exigências do projeto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          Baseado no Boletim Técnico IBRACON / ABECE / ABCIC —{' '}
          <span className="font-medium text-gray-500">Pegada de Carbono</span>
        </div>
      </footer>
    </div>
  );
}
