import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  TreePine,
  Car,
  Plane,
  Zap,
  TrendingDown,
  Leaf,
  Truck,
  Wrench,
  Target,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Tipos de cimento e fatores de emissão (kg CO2 / t)
// ---------------------------------------------------------------------------
const CEMENT_TYPES: Record<string, { label: string; min: number; max: number }> = {
  'CP-II-F': { label: 'CP-II-F', min: 600, max: 750 },
  'CP-II-Z': { label: 'CP-II-Z', min: 450, max: 650 },
  'CP-III': { label: 'CP-III', min: 300, max: 500 },
  'CP-IV': { label: 'CP-IV', min: 350, max: 550 },
  'CP-V ARI': { label: 'CP-V ARI', min: 700, max: 850 },
};

// Fatores de emissão para agregados (kg CO2 / t)
const SAND_FACTOR = { min: 0, max: 12.51 };
const GRAVEL_FACTOR = { min: 0, max: 4.669 };

// Fatores de emissão - energia
const ELECTRICITY_FACTOR = 0.07; // kg CO2 / kWh
const DIESEL_FACTOR = 2.29; // kg CO2 / L

// Fatores de transporte (kg CO2 / t.km)
const TRANSPORT_FACTORS = {
  carreta5e: 0.06091,
  truck3e: 0.06801,
};

// ---------------------------------------------------------------------------
// Presets de concreto
// ---------------------------------------------------------------------------
const PRESETS: Record<string, {
  cement: number; sand: number; gravel: number; water: number;
}> = {
  '25 MPa': { cement: 294, sand: 784, gravel: 1078, water: 176 },
  '30 MPa': { cement: 343, sand: 760, gravel: 1029, water: 189 },
  '35 MPa': { cement: 377, sand: 735, gravel: 1005, water: 189 },
};

// Cores para gráficos
const CHART_COLORS = [
  '#059669', // emerald-600
  '#0d9488', // teal-600
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#34d399', // emerald-400
  '#5eead4', // teal-300
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------
export default function Calculator() {
  // Estado do formulario
  const [cementType, setCementType] = useState('CP-II-F');
  const [cement, setCite] = useState(343);
  const [sand, setSand] = useState(760);
  const [gravel, setGravel] = useState(1029);
  const [electricity, setElectricity] = useState(3.0);
  const [diesel, setDiesel] = useState(0.45);
  const [lossIndex, setLossIndex] = useState(2);

  // Transporte
  const [cementDist, setCementDist] = useState(350);
  const [sandDist, setSandDist] = useState(150);
  const [gravelDist, setGravelDist] = useState(80);
  const [roundTrip, setRoundTrip] = useState(true);

  // Aplicar preset
  const applyPreset = (key: string) => {
    const p = PRESETS[key];
    setCite(p.cement);
    setSand(p.sand);
    setGravel(p.gravel);
  };

  // ---------------------------------------------------------------------------
  // Calculo das emissões
  // ---------------------------------------------------------------------------
  const results = useMemo(() => {
    const lossMult = 1 + lossIndex / 100;
    const cementQty = cement * lossMult;
    const sandQty = sand * lossMult;
    const gravelQty = gravel * lossMult;

    const distMult = roundTrip ? 2 : 1;

    const cementFactor = CEMENT_TYPES[cementType];

    // Cimento
    const cementCO2Min = (cementQty * cementFactor.min) / 1000;
    const cementCO2Max = (cementQty * cementFactor.max) / 1000;

    // Areia
    const sandCO2Min = (sandQty * SAND_FACTOR.min) / 1000;
    const sandCO2Max = (sandQty * SAND_FACTOR.max) / 1000;

    // Brita
    const gravelCO2Min = (gravelQty * GRAVEL_FACTOR.min) / 1000;
    const gravelCO2Max = (gravelQty * GRAVEL_FACTOR.max) / 1000;

    // Eletricidade
    const elecCO2 = electricity * ELECTRICITY_FACTOR;

    // Diesel
    const dieselCO2 = diesel * DIESEL_FACTOR;

    // Transporte: (massa_kg * distancia_km * fator) / 1000
    const transportCement =
      (cementQty * cementDist * distMult * TRANSPORT_FACTORS.carreta5e) / 1000;
    const transportSand =
      (sandQty * sandDist * distMult * TRANSPORT_FACTORS.truck3e) / 1000;
    const transportGravel =
      (gravelQty * gravelDist * distMult * TRANSPORT_FACTORS.truck3e) / 1000;
    const transportCO2 = transportCement + transportSand + transportGravel;

    const totalMin =
      cementCO2Min + sandCO2Min + gravelCO2Min + elecCO2 + dieselCO2 + transportCO2;
    const totalMax =
      cementCO2Max + sandCO2Max + gravelCO2Max + elecCO2 + dieselCO2 + transportCO2;

    return {
      cementCO2Min,
      cementCO2Max,
      sandCO2Min,
      sandCO2Max,
      gravelCO2Min,
      gravelCO2Max,
      elecCO2,
      dieselCO2,
      transportCO2,
      totalMin,
      totalMax,
    };
  }, [
    cement,
    sand,
    gravel,
    electricity,
    diesel,
    lossIndex,
    cementType,
    cementDist,
    sandDist,
    gravelDist,
    roundTrip,
  ]);

  // Dados para gráficos
  const barData = [
    { name: 'Cimento', min: results.cementCO2Min, max: results.cementCO2Max },
    { name: 'Areia', min: results.sandCO2Min, max: results.sandCO2Max },
    { name: 'Brita', min: results.gravelCO2Min, max: results.gravelCO2Max },
    { name: 'Eletricidade', min: results.elecCO2, max: results.elecCO2 },
    { name: 'Diesel', min: results.dieselCO2, max: results.dieselCO2 },
    { name: 'Transporte', min: results.transportCO2, max: results.transportCO2 },
  ];

  const pieData = [
    { name: 'Cimento', value: (results.cementCO2Min + results.cementCO2Max) / 2 },
    { name: 'Areia', value: (results.sandCO2Min + results.sandCO2Max) / 2 },
    { name: 'Brita', value: (results.gravelCO2Min + results.gravelCO2Max) / 2 },
    { name: 'Eletricidade', value: results.elecCO2 },
    { name: 'Diesel', value: results.dieselCO2 },
    { name: 'Transporte', value: results.transportCO2 },
  ];

  // Media das emissões para equivalencias
  const avgTotal = (results.totalMin + results.totalMax) / 2;

  // Equivalencias
  const equivalencies = useMemo(() => {
    const trees = avgTotal / 22; // 1 arvore = 22 kg CO2/ano
    const carKm = avgTotal / 0.21; // 1 km = 0.21 kg CO2
    const flights = avgTotal / 70; // 1 voo SP-RJ = 70 kg CO2
    const elecMonths = avgTotal / 10.5; // 150 kWh/mes * 0.07 = 10.5 kg CO2/mes
    return { trees, carKm, flights, elecMonths };
  }, [avgTotal]);

  // Intensidade de carbono por MPa para cada preset
  const intensityData = useMemo(() => {
    return Object.entries(PRESETS).map(([key, p]) => {
      const mpa = parseInt(key);
      const factor = CEMENT_TYPES[cementType];
      const avgFactor = (factor.min + factor.max) / 2;
      const co2 = (p.cement * avgFactor) / 1000; // apenas cimento como proxy principal
      const intensity = co2 / mpa;
      return { name: key, intensity: parseFloat(intensity.toFixed(3)), co2perM3: parseFloat(co2.toFixed(1)) };
    });
  }, [cementType]);

  // Dados para gráfico waterfall (cascata)
  const waterfallData = useMemo(() => {
    const cementAvg = (results.cementCO2Min + results.cementCO2Max) / 2;
    const sandAvg = (results.sandCO2Min + results.sandCO2Max) / 2;
    const gravelAvg = (results.gravelCO2Min + results.gravelCO2Max) / 2;

    const contributions = [
      { name: 'Cimento', value: cementAvg },
      { name: 'Areia', value: sandAvg },
      { name: 'Brita', value: gravelAvg },
      { name: 'Eletricidade', value: results.elecCO2 },
      { name: 'Diesel', value: results.dieselCO2 },
      { name: 'Transporte', value: results.transportCO2 },
    ];

    let cumulative = 0;
    const steps = contributions.map((c) => {
      const base = cumulative;
      cumulative += c.value;
      return { name: c.name, base, value: c.value };
    });

    steps.push({ name: 'Total', base: 0, value: cumulative });

    return steps;
  }, [results]);

  // ---------------------------------------------------------------------------
  // Helpers de UI
  // ---------------------------------------------------------------------------
  const inputClass =
    'w-full rounded-lg border border-teal-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400';

  const labelClass = 'block text-sm font-medium text-teal-800 mb-1';

  const NumberInput = ({
    label,
    value,
    onChange,
    unit,
    step,
    min,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    unit?: string;
    step?: number;
    min?: number;
  }) => (
    <div>
      <label className={labelClass}>
        {label} {unit && <span className="text-teal-500">({unit})</span>}
      </label>
      <input
        type="number"
        className={inputClass}
        value={value}
        step={step ?? 1}
        min={min ?? 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Cabecalho */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-emerald-700">
            Calculadora de Pegada de Carbono do Concreto
          </h1>
          <p className="mt-2 text-teal-600">
            Metodologia IBRACON - Estimativa de emissões de CO&#8322; por m&#179; de concreto
          </p>
        </header>

        {/* Presets */}
        <section className="mb-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-semibold text-teal-700">Presets:</span>
          {Object.keys(PRESETS).map((key) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="rounded-full border border-emerald-400 bg-white px-5 py-1.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-500 hover:text-white"
            >
              {key}
            </button>
          ))}
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ================================================================= */}
          {/* FORMULARIO */}
          {/* ================================================================= */}
          <div className="space-y-6">
            {/* Tipo de cimento */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Tipo de Cimento
              </h2>
              <label className={labelClass}>Selecione o tipo</label>
              <select
                className={inputClass}
                value={cementType}
                onChange={(e) => setCementType(e.target.value)}
              >
                {Object.entries(CEMENT_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label} ({val.min}&ndash;{val.max} kg CO&#8322;/t)
                  </option>
                ))}
              </select>
            </div>

            {/* Materiais */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Materiais do Concreto
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Cimento"
                  unit="kg/m³"
                  value={cement}
                  onChange={setCite}
                />
                <NumberInput
                  label="Areia"
                  unit="kg/m³"
                  value={sand}
                  onChange={setSand}
                />
                <NumberInput
                  label="Brita"
                  unit="kg/m³"
                  value={gravel}
                  onChange={setGravel}
                />
                <NumberInput
                  label="Índice de Perdas"
                  unit="%"
                  value={lossIndex}
                  onChange={setLossIndex}
                  step={0.5}
                />
              </div>
            </div>

            {/* Energia */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Consumo de Energia
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Eletricidade"
                  unit="kWh/m³"
                  value={electricity}
                  onChange={setElectricity}
                  step={0.1}
                />
                <NumberInput
                  label="Diesel"
                  unit="L/m³"
                  value={diesel}
                  onChange={setDiesel}
                  step={0.01}
                />
              </div>
            </div>

            {/* Transporte */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Transporte
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <NumberInput
                  label="Dist. Cimento (Carreta 5E)"
                  unit="km"
                  value={cementDist}
                  onChange={setCementDist}
                />
                <NumberInput
                  label="Dist. Areia (Truck 3E)"
                  unit="km"
                  value={sandDist}
                  onChange={setSandDist}
                />
                <NumberInput
                  label="Dist. Brita (Truck 3E)"
                  unit="km"
                  value={gravelDist}
                  onChange={setGravelDist}
                />
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm font-medium text-teal-800">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="h-4 w-4 rounded border-teal-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    Ida e volta
                  </label>
                </div>
              </div>
              <p className="mt-3 text-xs text-teal-500">
                Fatores: Carreta 5 Eixos = {TRANSPORT_FACTORS.carreta5e} kg CO&#8322;/t.km
                &nbsp;|&nbsp; Caminhao 3 Eixos = {TRANSPORT_FACTORS.truck3e} kg CO&#8322;/t.km
              </p>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RESULTADOS */}
          {/* ================================================================= */}
          <div className="space-y-6">
            {/* Totais */}
            <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white shadow-lg">
              <h2 className="mb-2 text-lg font-semibold">
                Emissões Totais de CO&#8322;
              </h2>
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <span className="text-sm opacity-80">Minimo</span>
                  <p className="text-3xl font-bold">
                    {results.totalMin.toFixed(1)}{' '}
                    <span className="text-base font-normal opacity-80">
                      kg CO&#8322;/m&#179;
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-sm opacity-80">Maximo</span>
                  <p className="text-3xl font-bold">
                    {results.totalMax.toFixed(1)}{' '}
                    <span className="text-base font-normal opacity-80">
                      kg CO&#8322;/m&#179;
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Detalhamento */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Detalhamento por Componente
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-teal-100 text-teal-600">
                      <th className="pb-2">Componente</th>
                      <th className="pb-2 text-right">Min (kg CO&#8322;)</th>
                      <th className="pb-2 text-right">Max (kg CO&#8322;)</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {barData.map((d) => (
                      <tr key={d.name} className="border-b border-teal-50">
                        <td className="py-1.5 font-medium">{d.name}</td>
                        <td className="py-1.5 text-right">{d.min.toFixed(2)}</td>
                        <td className="py-1.5 text-right">{d.max.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold text-emerald-700">
                      <td className="pt-2">Total</td>
                      <td className="pt-2 text-right">
                        {results.totalMin.toFixed(2)}
                      </td>
                      <td className="pt-2 text-right">
                        {results.totalMax.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráfico de barras */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Gráfico de Barras - Emissões por Componente
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: 'kg CO₂/m³',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 12 },
                    }}
                  />
                  <Tooltip
                    formatter={(value: any) => `${Number(value).toFixed(2)} kg CO₂/m³`}
                  />
                  <Legend />
                  <Bar dataKey="min" name="Minimo" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" name="Maximo" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de pizza */}
            <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-emerald-700">
                Contribuição Percentual (média)
              </h2>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    dataKey="value"
                    label={({ name, percent }: any) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
                    }
                  >
                    {pieData.map((_entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={CHART_COLORS[idx % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => `${Number(value).toFixed(2)} kg CO₂/m³`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* EQUIVALENCIAS */}
        {/* ================================================================= */}
        <section className="mt-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-emerald-700">
            Equivalencias de Emissão
          </h2>
          <p className="mb-6 text-center text-sm text-teal-600">
            Para {avgTotal.toFixed(1)} kg CO&#8322; (média), isso equivale aproximadamente a:
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Arvores */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100 p-6 shadow-md transition hover:shadow-lg">
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-emerald-200/30" />
              <TreePine className="mb-3 h-8 w-8 text-emerald-600" />
              <p className="text-3xl font-bold text-emerald-700">
                {equivalencies.trees.toFixed(1)}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-800">
                Arvores por 1 ano
              </p>
              <p className="mt-1 text-xs text-teal-600">
                1 arvore absorve ~22 kg CO&#8322;/ano
              </p>
            </div>

            {/* Km de carro */}
            <div className="group relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-100 p-6 shadow-md transition hover:shadow-lg">
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-teal-200/30" />
              <Car className="mb-3 h-8 w-8 text-teal-600" />
              <p className="text-3xl font-bold text-teal-700">
                {equivalencies.carKm.toFixed(0)}
              </p>
              <p className="mt-1 text-sm font-medium text-teal-800">
                Km de carro
              </p>
              <p className="mt-1 text-xs text-teal-600">
                1 km &asymp; 0,21 kg CO&#8322;
              </p>
            </div>

            {/* Voos SP-RJ */}
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-lime-100 p-6 shadow-md transition hover:shadow-lg">
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-emerald-200/30" />
              <Plane className="mb-3 h-8 w-8 text-emerald-600" />
              <p className="text-3xl font-bold text-emerald-700">
                {equivalencies.flights.toFixed(2)}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-800">
                Voos SP &rarr; RJ
              </p>
              <p className="mt-1 text-xs text-teal-600">
                1 voo &asymp; 70 kg CO&#8322;/pessoa
              </p>
            </div>

            {/* Meses de eletricidade */}
            <div className="group relative overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-sky-100 p-6 shadow-md transition hover:shadow-lg">
              <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-teal-200/30" />
              <Zap className="mb-3 h-8 w-8 text-teal-600" />
              <p className="text-3xl font-bold text-teal-700">
                {equivalencies.elecMonths.toFixed(1)}
              </p>
              <p className="mt-1 text-sm font-medium text-teal-800">
                Meses de eletricidade
              </p>
              <p className="mt-1 text-xs text-teal-600">
                Residencia média BR (~150 kWh/mes)
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* WATERFALL CHART */}
        {/* ================================================================= */}
        <section className="mt-10">
          <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
            <h2 className="mb-2 text-lg font-semibold text-emerald-700">
              Cascata de Emissões (Waterfall)
            </h2>
            <p className="mb-4 text-sm text-teal-600">
              Acúmulo passo a passo do CO&#8322; médio (kg/m&#179;)
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={waterfallData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{
                    value: 'kg CO₂/m³',
                    angle: -90,
                    position: 'insideLeft',
                    style: { fontSize: 12 },
                  }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === 'base') return [null, null];
                    return [`${Number(value).toFixed(2)} kg CO₂/m³`, 'Contribuição'];
                  }}
                />
                <Bar dataKey="base" stackId="waterfall" fill="transparent" />
                <Bar
                  dataKey="value"
                  stackId="waterfall"
                  radius={[4, 4, 0, 0]}
                >
                  {waterfallData.map((entry, idx) => (
                    <Cell
                      key={`wf-${idx}`}
                      fill={entry.name === 'Total' ? '#059669' : CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
                <ReferenceLine y={0} stroke="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ================================================================= */}
        {/* INTENSIDADE DE CARBONO POR MPa */}
        {/* ================================================================= */}
        <section className="mt-10">
          <div className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-emerald-700">
                Intensidade de Carbono por MPa
              </h2>
            </div>
            <p className="mb-4 text-sm text-teal-600">
              Concretos de maior resistencia podem ser mais eficientes por unidade de desempenho
              (menos CO&#8322; por MPa). Valores baseados no cimento {cementType} selecionado.
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={intensityData} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  label={{
                    value: 'kg CO₂ / MPa',
                    position: 'insideBottom',
                    offset: -2,
                    style: { fontSize: 12 },
                  }}
                />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 13 }} width={70} />
                <Tooltip
                  formatter={(value: any) => `${Number(value).toFixed(3)} kg CO₂/MPa`}
                />
                <Bar dataKey="intensity" name="kg CO₂/MPa" radius={[0, 6, 6, 0]}>
                  {intensityData.map((_entry, idx) => (
                    <Cell
                      key={`int-${idx}`}
                      fill={['#10b981', '#0d9488', '#059669'][idx]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-teal-600">
              {intensityData.map((d) => (
                <span key={d.name}>
                  <strong>{d.name}:</strong> {d.co2perM3} kg CO&#8322;/m&#179; &rarr;{' '}
                  {d.intensity} kg CO&#8322;/MPa
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* DICAS DE REDUÇÃO */}
        {/* ================================================================= */}
        <section className="mt-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-emerald-700">
            Dicas para Redução de Emissões
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Dica 1 */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-emerald-800">
                Use cimento com menor fator clínquer
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-teal-700">
                CP-III ou CP-IV podem reduzir as emissões do cimento em até 40% comparado
                ao CP-V ARI, por utilizarem mais adicoes minerais.
              </p>
            </div>

            {/* Dica 2 */}
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <Truck className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-sm font-bold text-teal-800">
                Reduza distâncias de transporte
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-teal-700">
                Priorize fornecedores locais de agregados e cimento. O transporte pode
                representar parcela significativa da pegada de carbono.
              </p>
            </div>

            {/* Dica 3 */}
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <Wrench className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-emerald-800">
                Otimize o traço
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-teal-700">
                Menor relação água/cimento e uso de aditivos plastificantes permitem
                reduzir o consumo de cimento sem perda de resistencia.
              </p>
            </div>

            {/* Dica 4 */}
            <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-sky-50 p-6 shadow-md transition hover:shadow-lg">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100">
                <Target className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-sm font-bold text-teal-800">
                Minimize perdas
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-teal-700">
                Controle de qualidade rigoroso e boas práticas de concretagem reduzem o
                desperdício de materiais e, consequentemente, as emissões.
              </p>
            </div>
          </div>
        </section>

        {/* Rodape */}
        <footer className="mt-12 text-center text-xs text-teal-500">
          <p>
            Fatores de emissão baseados na metodologia IBRACON. Os valores apresentados
            sao estimativas e podem variar conforme as condicoes locais.
          </p>
        </footer>
      </div>
    </div>
  );
}
