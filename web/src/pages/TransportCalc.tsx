import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  Cell,
} from 'recharts';
import {
  Truck,
  TreePine,
  Fuel,
  RotateCcw,
  Car,
  Plane,
  Home,
  Train,
  Ship,
  Lightbulb,
  TrendingDown,
  Route,
  Calendar,
  Repeat,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const VEHICLES = [
  { id: 'toco', label: 'Caminhão Toco 2E', factor: 0.09778 },
  { id: 'truck', label: 'Truck 3E', factor: 0.06801 },
  { id: 'carreta', label: 'Carreta 5E', factor: 0.06091 },
] as const;

const DIESEL_FACTOR = 2.29; // kg CO2 / L
const TREE_ABSORPTION = 22; // kg CO2 / year

const FUEL_CONSUMPTION = [
  { vehicle: 'Caminhão Toco 2E', kmPerLiter: 4.5, consumptionPer100km: 22.2 },
  { vehicle: 'Truck 3E', kmPerLiter: 3.5, consumptionPer100km: 28.6 },
  { vehicle: 'Carreta 5E', kmPerLiter: 2.8, consumptionPer100km: 35.7 },
];

// Equivalency factors
const CAR_KM_FACTOR = 0.21; // kg CO2 per km in a passenger car
const FLIGHT_SP_RIO = 70; // kg CO2 per flight SP->Rio per person
const HOME_ELECTRICITY_DAY = 0.35; // kg CO2 per day of home electricity
const GASOLINE_LITER = 1.63; // kg CO2 per liter of gasoline burned

// Alternative transport modes (kg CO2 / t.km)
const ALT_MODES = [
  { id: 'toco', label: 'Toco 2E', factor: 0.09778, color: '#dc2626' },
  { id: 'truck', label: 'Truck 3E', factor: 0.06801, color: '#ea580c' },
  { id: 'carreta', label: 'Carreta 5E', factor: 0.06091, color: '#f59e0b' },
  { id: 'ferrovia', label: 'Ferrovia', factor: 0.022, color: '#10b981' },
  { id: 'cabotagem', label: 'Cabotagem', factor: 0.016, color: '#0ea5e9' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TransportCalc() {
  const [vehicleId, setVehicleId] = useState<string>('toco');
  const [mass, setMass] = useState(25);
  const [distance, setDistance] = useState(100);
  const [roundTrip, setRoundTrip] = useState(true);
  const [tripsPerMonth, setTripsPerMonth] = useState(20);

  const selectedVehicle = VEHICLES.find((v) => v.id === vehicleId)!;
  const effectiveDistance = roundTrip ? distance * 2 : distance;

  const co2 = useMemo(
    () => mass * effectiveDistance * selectedVehicle.factor,
    [mass, effectiveDistance, selectedVehicle],
  );

  const trees = useMemo(() => co2 / TREE_ABSORPTION, [co2]);

  // Equivalencies
  const carKm = useMemo(() => co2 / CAR_KM_FACTOR, [co2]);
  const flights = useMemo(() => co2 / FLIGHT_SP_RIO, [co2]);
  const homeDays = useMemo(() => co2 / HOME_ELECTRICITY_DAY, [co2]);
  const gasolineLiters = useMemo(() => co2 / GASOLINE_LITER, [co2]);

  // Multiple trips
  const monthlyCo2 = useMemo(() => co2 * tripsPerMonth, [co2, tripsPerMonth]);
  const annualCo2 = useMemo(() => monthlyCo2 * 12, [monthlyCo2]);
  const annualTrees = useMemo(() => annualCo2 / TREE_ABSORPTION, [annualCo2]);

  // Comparison chart data: same mass/distance, all vehicles
  const comparisonData = useMemo(
    () =>
      VEHICLES.map((v) => ({
        name: v.label,
        co2: parseFloat((mass * effectiveDistance * v.factor).toFixed(2)),
      })),
    [mass, effectiveDistance],
  );

  // Mode comparison data (all 5 modes)
  const modeComparisonData = useMemo(
    () =>
      ALT_MODES.map((m) => ({
        name: m.label,
        co2: parseFloat((mass * effectiveDistance * m.factor).toFixed(2)),
        color: m.color,
      })),
    [mass, effectiveDistance],
  );

  // Distance impact chart data (0 to 500 km)
  const distanceImpactData = useMemo(() => {
    const points = [];
    for (let d = 0; d <= 500; d += 25) {
      const effDist = roundTrip ? d * 2 : d;
      points.push({
        distância: d,
        co2: parseFloat((mass * effDist * selectedVehicle.factor).toFixed(2)),
      });
    }
    return points;
  }, [mass, selectedVehicle, roundTrip]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 p-3 text-white shadow-md">
            <Truck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            Calculadora de Transporte
          </h1>
        </div>
        <p className="text-gray-500">
          Estime as emissões de CO&#x2082; geradas no transporte rodoviário de
          materiais de construção.
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Parametros</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Vehicle Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Veículo
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            >
              {VEHICLES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.factor} kg CO&#x2082;/t.km)
                </option>
              ))}
            </select>
          </div>

          {/* Mass */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Massa da Carga (t)
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={mass}
              onChange={(e) => setMass(Math.max(0, parseFloat(e.target.value) || 0))}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
          </div>

          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distância (km)
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={distance}
              onChange={(e) => setDistance(Math.max(0, parseFloat(e.target.value) || 0))}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
          </div>

          {/* Round Trip */}
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <RotateCcw className="h-4 w-4 text-gray-400" />
                Ida e volta
              </span>
            </label>
          </div>
        </div>

        {roundTrip && (
          <p className="mt-3 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 inline-block">
            Distância efetiva: {effectiveDistance} km (ida + volta)
          </p>
        )}
      </div>

      {/* Result */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 shadow-xl text-white">
        <h2 className="text-lg font-semibold text-emerald-100 mb-2">
          Emissão Estimada
        </h2>
        <p className="text-5xl font-extrabold tracking-tight">
          {co2.toFixed(2)}{' '}
          <span className="text-2xl font-medium text-emerald-200">
            kg CO&#x2082;
          </span>
        </p>

        {/* Equivalency Cards Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Trees */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <TreePine className="h-8 w-8 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-200">Árvores absorvendo CO&#x2082;/ano</p>
              <p className="text-lg font-bold text-white">{trees.toFixed(1)} árvores</p>
            </div>
          </div>

          {/* Car km */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <Car className="h-8 w-8 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-200">Km em carro de passeio</p>
              <p className="text-lg font-bold text-white">{carKm.toFixed(0)} km</p>
            </div>
          </div>

          {/* Flights SP->Rio */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <Plane className="h-8 w-8 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-200">Voos SP-Rio (por pessoa)</p>
              <p className="text-lg font-bold text-white">{flights.toFixed(1)} voos</p>
            </div>
          </div>

          {/* Home electricity days */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <Home className="h-8 w-8 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-200">Dias de eletricidade residencial</p>
              <p className="text-lg font-bold text-white">{homeDays.toFixed(0)} dias</p>
            </div>
          </div>

          {/* Gasoline liters */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <Fuel className="h-8 w-8 text-emerald-300 flex-shrink-0" />
            <div>
              <p className="text-sm text-emerald-200">Litros de gasolina queimados</p>
              <p className="text-lg font-bold text-white">{gasolineLiters.toFixed(1)} L</p>
            </div>
          </div>

          {/* Reference info */}
          <div className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/10">
            <Route className="h-8 w-8 text-emerald-300/60 flex-shrink-0" />
            <div className="text-xs text-emerald-200/80 space-y-0.5">
              <p>1 km carro = {CAR_KM_FACTOR} kg CO&#x2082;</p>
              <p>1 voo SP-Rio = {FLIGHT_SP_RIO} kg CO&#x2082;</p>
              <p>1 dia eletric. = {HOME_ELECTRICITY_DAY} kg CO&#x2082;</p>
              <p>1 L gasolina = {GASOLINE_LITER} kg CO&#x2082;</p>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Trips Calculator */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 p-2.5 text-white shadow-md">
            <Repeat className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Calculadora de Múltiplas Viagens
            </h2>
            <p className="text-sm text-gray-500">
              Projete o impacto acumulado de viagens recorrentes
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {/* Trips per month */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Viagens por mês
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={tripsPerMonth}
              onChange={(e) => setTripsPerMonth(Math.max(1, parseInt(e.target.value) || 1))}
              onFocus={(e) => e.target.select()}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
            />
          </div>

          {/* Single trip display */}
          <div className="flex flex-col justify-center bg-teal-50 rounded-xl px-5 py-3">
            <p className="text-xs text-teal-600 font-medium">Emissão por viagem</p>
            <p className="text-lg font-bold text-teal-800">{co2.toFixed(2)} kg CO&#x2082;</p>
          </div>

          {/* Vehicle info */}
          <div className="flex flex-col justify-center bg-gray-50 rounded-xl px-5 py-3">
            <p className="text-xs text-gray-500 font-medium">Veículo selecionado</p>
            <p className="text-sm font-bold text-gray-800">{selectedVehicle.label}</p>
            <p className="text-xs text-gray-500">{mass} t | {effectiveDistance} km</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Monthly total */}
          <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-teal-200" />
              <p className="text-sm font-medium text-teal-100">Total Mensal</p>
            </div>
            <p className="text-3xl font-extrabold">{monthlyCo2.toFixed(0)}</p>
            <p className="text-sm text-teal-200">kg CO&#x2082;</p>
            <p className="text-xs text-teal-300 mt-1">{tripsPerMonth} viagens/mês</p>
          </div>

          {/* Annual total */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-cyan-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-emerald-200" />
              <p className="text-sm font-medium text-emerald-100">Total Anual</p>
            </div>
            <p className="text-3xl font-extrabold">
              {annualCo2 >= 1000
                ? `${(annualCo2 / 1000).toFixed(1)} t`
                : `${annualCo2.toFixed(0)} kg`}
            </p>
            <p className="text-sm text-emerald-200">CO&#x2082;</p>
            <p className="text-xs text-emerald-300 mt-1">{tripsPerMonth * 12} viagens/ano</p>
          </div>

          {/* Annual trees */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="h-5 w-5 text-cyan-200" />
              <p className="text-sm font-medium text-cyan-100">Compensacao Anual</p>
            </div>
            <p className="text-3xl font-extrabold">{annualTrees.toFixed(0)}</p>
            <p className="text-sm text-cyan-200">árvores necessárias</p>
            <p className="text-xs text-cyan-300 mt-1">absorvendo CO&#x2082; por 1 ano</p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Comparação entre Veículos
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Mesma carga ({mass} t) e distância ({effectiveDistance} km) para os 3 tipos
          de veículo
        </p>
        <div className="mt-6 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#6b7280' }}
                label={{
                  value: 'kg CO\u2082',
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
                formatter={(value: any) => [`${Number(value)} kg CO\u2082`, 'Emissão']}
              />
              <Legend />
              <Bar
                dataKey="co2"
                name="kg CO\u2082"
                fill="#059669"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mode Comparison Chart (Horizontal Bar) */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-2.5 text-white shadow-md">
            <TrendingDown className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Comparação entre Modais de Transporte
          </h2>
        </div>
        <p className="mt-1 mb-2 text-sm text-gray-500">
          Mesma carga ({mass} t) e distância ({effectiveDistance} km) em diferentes modais
        </p>

        {/* Reference factors table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 font-semibold text-gray-600 rounded-tl-xl">Modal</th>
                <th className="px-4 py-2 font-semibold text-gray-600 text-right">Fator (kg CO&#x2082;/t.km)</th>
                <th className="px-4 py-2 font-semibold text-gray-600 text-right rounded-tr-xl">Emissão Total (kg CO&#x2082;)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ALT_MODES.map((m) => (
                <tr key={m.id} className="hover:bg-emerald-50/40 transition">
                  <td className="px-4 py-2 font-medium text-gray-800 flex items-center gap-2">
                    {m.id === 'ferrovia' && <Train className="h-4 w-4 text-emerald-500" />}
                    {m.id === 'cabotagem' && <Ship className="h-4 w-4 text-sky-500" />}
                    {['toco', 'truck', 'carreta'].includes(m.id) && <Truck className="h-4 w-4 text-gray-400" />}
                    {m.label}
                  </td>
                  <td className="px-4 py-2 text-right text-gray-600">{m.factor}</td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-800">
                    {(mass * effectiveDistance * m.factor).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Horizontal bar chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={modeComparisonData} layout="vertical" barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{
                  value: 'kg CO\u2082',
                  position: 'insideBottomRight',
                  offset: -5,
                  style: { fill: '#6b7280' },
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                }}
                formatter={(value: any) => [`${Number(value)} kg CO\u2082`, 'Emissão']}
              />
              <Bar dataKey="co2" name="kg CO&#x2082;" radius={[0, 8, 8, 0]}>
                {modeComparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Fontes: IPCC, NT-GHG, ANTAQ. Fatores médios para transporte de carga no Brasil.
        </p>
      </div>

      {/* Distance Impact Chart */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 p-2.5 text-white shadow-md">
            <Route className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Impacto da Distância nas Emissões
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-500 mb-6">
          Como o CO&#x2082; cresce com a distância para {selectedVehicle.label} com {mass} t
          {roundTrip ? ' (ida e volta)' : ' (somente ida)'}
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={distanceImpactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="distância"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                label={{
                  value: 'Distância (km)',
                  position: 'insideBottomRight',
                  offset: -5,
                  style: { fill: '#6b7280' },
                }}
              />
              <YAxis
                tick={{ fill: '#6b7280' }}
                label={{
                  value: 'kg CO\u2082',
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
                formatter={(value: any) => [`${Number(value)} kg CO\u2082`, 'Emissão']}
                labelFormatter={(label) => `${label} km`}
              />
              <Line
                type="monotone"
                dataKey="co2"
                name="kg CO\u2082"
                stroke="#0d9488"
                strokeWidth={3}
                dot={{ fill: '#0d9488', r: 3 }}
                activeDot={{ r: 6, fill: '#059669' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          A relacao entre distância e emissão e linear: dobrar a distância dobra a emissão.
        </p>
      </div>

      {/* Optimization Tips */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 p-2.5 text-white shadow-md">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dicas de Otimização
            </h2>
            <p className="text-sm text-gray-500">
              Estrategias para reduzir a pegada de carbono no transporte
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tip 1: Consolidate loads */}
          <div className="group rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 hover:shadow-md hover:border-emerald-200 transition-all">
            <div className="flex items-start gap-4">
              <div className="inline-flex rounded-xl bg-emerald-100 p-2.5 text-emerald-600 group-hover:bg-emerald-200 transition">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Consolide cargas</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Carregar mais peso por viagem dilui a emissão por tonelada transportada.
                  Um caminhão a 100% da capacidade emite menos CO&#x2082; por tonelada
                  do que dois caminhões a 50%.
                </p>
              </div>
            </div>
          </div>

          {/* Tip 2: Use larger trucks */}
          <div className="group rounded-2xl border border-teal-100 bg-teal-50/50 p-6 hover:shadow-md hover:border-teal-200 transition-all">
            <div className="flex items-start gap-4">
              <div className="inline-flex rounded-xl bg-teal-100 p-2.5 text-teal-600 group-hover:bg-teal-200 transition">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Use caminhões maiores</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Uma Carreta 5E é ~38% mais eficiente por t.km do que um Toco 2E
                  ({VEHICLES[2].factor} vs {VEHICLES[0].factor} kg CO&#x2082;/t.km).
                  Sempre que possível, prefira veículos de maior capacidade.
                </p>
              </div>
            </div>
          </div>

          {/* Tip 3: Local suppliers */}
          <div className="group rounded-2xl border border-cyan-100 bg-cyan-50/50 p-6 hover:shadow-md hover:border-cyan-200 transition-all">
            <div className="flex items-start gap-4">
              <div className="inline-flex rounded-xl bg-cyan-100 p-2.5 text-cyan-600 group-hover:bg-cyan-200 transition">
                <Route className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Prefira fornecedores locais</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Reduzir a distância e o fator mais impactante na redução de emissões.
                  Um fornecedor a 50 km emite metade do CO&#x2082; comparado a um a 100 km,
                  independente do veículo utilizado.
                </p>
              </div>
            </div>
          </div>

          {/* Tip 4: Alternative modes */}
          <div className="group rounded-2xl border border-sky-100 bg-sky-50/50 p-6 hover:shadow-md hover:border-sky-200 transition-all">
            <div className="flex items-start gap-4">
              <div className="inline-flex rounded-xl bg-sky-100 p-2.5 text-sky-600 group-hover:bg-sky-200 transition">
                <Train className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Considere modais alternativos</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ferrovia (0.022 kg CO&#x2082;/t.km) e cabotagem (0.016 kg CO&#x2082;/t.km)
                  podem reduzir emissões em até 75-84% comparado ao transporte rodoviário,
                  quando viavel logisticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diesel Factor & Consumption Table */}
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Fuel className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-800">
            Fator de Emissão do Diesel e Consumo Estimado
          </h2>
        </div>

        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 inline-block">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Fator de emissão do óleo diesel:</span>{' '}
            <span className="text-amber-700 font-bold">{DIESEL_FACTOR} kg CO&#x2082;/L</span>
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 font-semibold text-gray-600 rounded-tl-xl">
                  Veículo
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right">
                  Rendimento (km/L)
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600 text-right rounded-tr-xl">
                  Consumo a cada 100 km (L)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {FUEL_CONSUMPTION.map((row) => (
                <tr key={row.vehicle} className="hover:bg-emerald-50/40 transition">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {row.vehicle}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    {row.kmPerLiter}
                  </td>
                  <td className="px-6 py-3 text-right text-gray-600">
                    {row.consumptionPer100km}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Fonte: Sidac / DAPs / IPCC. Valores estimados para veículos carregados em
          condições típicas.
        </p>
      </div>
    </div>
  );
}
