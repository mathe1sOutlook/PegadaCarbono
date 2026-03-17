// ============================================================
// Fatores de emissão extraídos do Boletim Técnico IBRACON/ABECE/ABCIC
// "Quantificação das emissões de CO2 incorporadas em materiais
//  cimentícios e estruturas de concreto" (2024)
// ============================================================

export interface FuelFactor {
  name: string;
  factor: number;
  unit: string;
  renewable: boolean;
  note?: string;
}

export interface CarbonateFactor {
  formula: string;
  mineral: string;
  factor: number;
  factorMax?: number;
}

export interface TransportFactor {
  mode: string;
  factor: number;
  unit: string;
}

export interface MaterialFactor {
  name: string;
  factorMin: number;
  factorMax: number;
  unit: string;
  source: string;
}

export interface ConcreteRecipe {
  fck: number;
  cement: number;
  sand: number;
  gravel: number;
  additive: number;
  water: number;
}

// Tabela 2 - Fatores de emissão de CO2 para combustíveis (IPCC)
export const fuelFactors: FuelFactor[] = [
  { name: 'Álcool etílico hidratado', factor: 0, unit: 'kg CO₂/L', renewable: true, note: 'Biomassa renovável' },
  { name: 'Carvão mineral', factor: 2.26, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Carvão vegetal não renovável', factor: 3.03, unit: 'kg CO₂/kg', renewable: false, note: 'Proveniente de desmatamento' },
  { name: 'Carvão vegetal renovável', factor: 0, unit: 'kg CO₂/kg', renewable: true, note: 'Biomassa renovável' },
  { name: 'Coque de carvão mineral', factor: 2.73, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Coque de petróleo', factor: 3.42, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Gás liquefeito de petróleo (GLP)', factor: 2.93, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Gás natural', factor: 2.33, unit: 'kg CO₂/m³', renewable: false },
  { name: 'Gasolina automotiva', factor: 1.63, unit: 'kg CO₂/L', renewable: false },
  { name: 'Lenha não renovável', factor: 566, unit: 'kg CO₂/st', renewable: false, note: 'st = metro estéreo' },
  { name: 'Lenha renovável', factor: 0, unit: 'kg CO₂/st', renewable: true, note: 'Biomassa renovável' },
  { name: 'Óleo combustível', factor: 3.11, unit: 'kg CO₂/L', renewable: false },
  { name: 'Óleo diesel', factor: 2.29, unit: 'kg CO₂/L', renewable: false },
  { name: 'Resíduo de madeira renovável', factor: 0, unit: 'kg CO₂/kg', renewable: true, note: 'Biomassa renovável' },
  { name: 'Resíduo de óleo', factor: 3.11, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Resíduo de pneu', factor: 3.14, unit: 'kg CO₂/kg', renewable: false },
  { name: 'Resíduo plástico', factor: 1.98, unit: 'kg CO₂/kg', renewable: false },
];

// Tabela 3 - Fatores de emissão de CO2 para calcinação de carbonatos (IPCC)
export const carbonateFactors: CarbonateFactor[] = [
  { formula: 'CaCO₃', mineral: 'Calcita', factor: 0.44 },
  { formula: 'MgCO₃', mineral: 'Magnesita', factor: 0.52 },
  { formula: 'CaMg(CO₃)₂', mineral: 'Dolomita', factor: 0.48 },
  { formula: 'FeCO₃', mineral: 'Siderita', factor: 0.38 },
  { formula: 'Ca(Fe,Mg,Mn)(CO₃)₂', mineral: 'Ankerita', factor: 0.41, factorMax: 0.48 },
  { formula: 'MnCO₃', mineral: 'Rodocrosita', factor: 0.38 },
  { formula: 'Na₂CO₃', mineral: 'Carbonato de sódio', factor: 0.41 },
];

// Fatores de emissão de CO2 para transporte (Sidac)
export const transportFactors: TransportFactor[] = [
  { mode: 'Caminhão toco (2 eixos)', factor: 0.09778, unit: 'kg CO₂/(t·km)' },
  { mode: 'Caminhão truck (3 eixos)', factor: 0.06801, unit: 'kg CO₂/(t·km)' },
  { mode: 'Caminhão carreta (5 eixos)', factor: 0.06091, unit: 'kg CO₂/(t·km)' },
];

// Fatores de emissão de CO2 para materiais (Sidac + DAPs)
export const materialFactors: MaterialFactor[] = [
  { name: 'Cimento CP-II-F', factorMin: 600, factorMax: 750, unit: 'kg CO₂/t', source: 'DAP / Sidac' },
  { name: 'Cimento CP-II-Z', factorMin: 450, factorMax: 650, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Cimento CP-III', factorMin: 300, factorMax: 500, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Cimento CP-IV', factorMin: 350, factorMax: 550, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Cimento CP-V ARI', factorMin: 700, factorMax: 850, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Areia', factorMin: 0, factorMax: 12.51, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Brita', factorMin: 0, factorMax: 4.669, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Aço CA-50', factorMin: 800, factorMax: 2200, unit: 'kg CO₂/t', source: 'Sidac' },
  { name: 'Aço CA-60', factorMin: 800, factorMax: 2200, unit: 'kg CO₂/t', source: 'Sidac' },
];

// Fator de emissão da eletricidade da rede pública brasileira
export const electricityFactor = {
  factor: 0.07,
  unit: 'kg CO₂/kWh',
  source: 'Sidac',
};

// Traços dos concretos do exemplo do PDF (Tabela 4)
export const concreteRecipes: ConcreteRecipe[] = [
  { fck: 25, cement: 294, sand: 784, gravel: 1078, additive: 1.47, water: 176 },
  { fck: 30, cement: 343, sand: 760, gravel: 1029, additive: 1.96, water: 189 },
  { fck: 35, cement: 377, sand: 735, gravel: 1005, additive: 2.45, water: 189 },
];

// Estágios do ciclo de vida (EN 15978)
export interface LifeCycleStage {
  id: string;
  module: string;
  name: string;
  stage: string;
  description: string;
  examples: string;
  color: string;
}

export const lifeCycleStages: LifeCycleStage[] = [
  { id: 'A1', module: 'A1', name: 'Produção das matérias-primas', stage: 'Estágio de Produto', description: 'Extração de recursos naturais e produção de matérias-primas', examples: 'Extração do calcário, minério de ferro, areia', color: '#10b981' },
  { id: 'A2', module: 'A2', name: 'Transporte', stage: 'Estágio de Produto', description: 'Transporte dos recursos até as fábricas', examples: 'Transporte do calcário até a fábrica de cimento', color: '#34d399' },
  { id: 'A3', module: 'A3', name: 'Fabricação', stage: 'Estágio de Produto', description: 'Fabricação dos produtos de construção', examples: 'Produção de cimento, aço, concreto', color: '#6ee7b7' },
  { id: 'A4', module: 'A4', name: 'Transporte à obra', stage: 'Processo Construtivo', description: 'Transporte dos produtos até a obra', examples: 'Transporte do concreto e vergalhão até a obra', color: '#3b82f6' },
  { id: 'A5', module: 'A5', name: 'Construção', stage: 'Processo Construtivo', description: 'Processo construtivo e perdas', examples: 'Bombeamento do concreto, montagem de estruturas', color: '#60a5fa' },
  { id: 'B1', module: 'B1', name: 'Uso', stage: 'Estágio de Uso', description: 'Processos durante o uso previsto', examples: 'Carbonatação de materiais cimentícios', color: '#f59e0b' },
  { id: 'B2', module: 'B2', name: 'Manutenção', stage: 'Estágio de Uso', description: 'Manutenção preventiva', examples: 'Aplicação de hidrofugante', color: '#fbbf24' },
  { id: 'B3', module: 'B3', name: 'Reparo', stage: 'Estágio de Uso', description: 'Manutenção corretiva', examples: 'Recuperação de fissuras', color: '#fcd34d' },
  { id: 'B4', module: 'B4', name: 'Substituição', stage: 'Estágio de Uso', description: 'Substituição planejada de componentes', examples: 'Substituição de telhas', color: '#fde68a' },
  { id: 'B5', module: 'B5', name: 'Reforma', stage: 'Estágio de Uso', description: 'Reformas significativas', examples: 'Retrofit de edifício', color: '#fef3c7' },
  { id: 'C1', module: 'C1', name: 'Demolição', stage: 'Fim de Vida', description: 'Desconstrução ou demolição', examples: 'Uso de rompedores e marteletes', color: '#ef4444' },
  { id: 'C2', module: 'C2', name: 'Transporte de resíduos', stage: 'Fim de Vida', description: 'Transporte dos resíduos', examples: 'Transporte para ATT ou aterro', color: '#f87171' },
  { id: 'C3', module: 'C3', name: 'Processamento', stage: 'Fim de Vida', description: 'Processamento para reuso/reciclagem', examples: 'Separação de sucata, triagem de RCD', color: '#fca5a5' },
  { id: 'C4', module: 'C4', name: 'Disposição final', stage: 'Fim de Vida', description: 'Disposição final dos resíduos', examples: 'Incineração, operação de aterro', color: '#fecaca' },
  { id: 'D', module: 'D', name: 'Reuso/Reciclagem', stage: 'Além da Fronteira', description: 'Potencial de reuso, recuperação ou reciclagem', examples: 'Uso de sucata metálica, agregado reciclado', color: '#8b5cf6' },
];

// Benchmark data: CO2 per m² for concrete structures (from Figure 6)
export const benchmarkData = [
  { co2: 45, percentage: 5 },
  { co2: 50, percentage: 10 },
  { co2: 55, percentage: 18 },
  { co2: 60, percentage: 28 },
  { co2: 65, percentage: 40 },
  { co2: 70, percentage: 52 },
  { co2: 75, percentage: 63 },
  { co2: 80, percentage: 74 },
  { co2: 85, percentage: 83 },
  { co2: 90, percentage: 90 },
  { co2: 95, percentage: 95 },
  { co2: 100, percentage: 98 },
  { co2: 110, percentage: 100 },
];

// Contribution analysis (from Figure 7)
export const contributionByMaterial = [
  { name: 'Concreto', value: 97, color: '#10b981' },
  { name: 'Aço', value: 3, color: '#3b82f6' },
];

export const contributionByElement = [
  { name: 'Lajes', value: 57, color: '#10b981' },
  { name: 'Pilares', value: 25, color: '#3b82f6' },
  { name: 'Vigas', value: 18, color: '#f59e0b' },
];
