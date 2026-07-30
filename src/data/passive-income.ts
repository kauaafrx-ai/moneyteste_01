/**
 * Reference data for the Passive Income area.
 * Educational / illustrative only — never investment advice.
 */

export interface AssetClass {
  id: string;
  label: string;
  /** Expected nominal annual return used only for simulations. */
  annualReturn: number;
  /** Expected annual yield distributed as income (dividends/juros). */
  annualYield: number;
  risk: "Baixo" | "Médio" | "Alto";
}

export const ASSET_CLASSES: AssetClass[] = [
  { id: "acoes", label: "Ações", annualReturn: 0.12, annualYield: 0.05, risk: "Alto" },
  { id: "fiis", label: "FIIs", annualReturn: 0.1, annualYield: 0.09, risk: "Médio" },
  { id: "cripto", label: "Criptomoedas", annualReturn: 0.18, annualYield: 0, risk: "Alto" },
  { id: "tesouro", label: "Tesouro", annualReturn: 0.105, annualYield: 0.105, risk: "Baixo" },
  { id: "etfs", label: "ETFs", annualReturn: 0.11, annualYield: 0.02, risk: "Médio" },
  { id: "cdb", label: "CDB", annualReturn: 0.11, annualYield: 0.11, risk: "Baixo" },
  { id: "cdi", label: "CDI", annualReturn: 0.1015, annualYield: 0.1015, risk: "Baixo" },
  { id: "bdr", label: "BDR", annualReturn: 0.1, annualYield: 0.015, risk: "Alto" },
  { id: "ouro", label: "Ouro", annualReturn: 0.07, annualYield: 0, risk: "Médio" },
];

export const HORIZONS = [1, 3, 5, 10, 20] as const;

export interface MarketIndicator {
  id: string;
  label: string;
  value: string;
  day: number;
  month: number;
}

/** Illustrative snapshot — substituído por API de mercado quando conectada. */
export const MARKET_INDICATORS: MarketIndicator[] = [
  { id: "selic", label: "Selic", value: "10,50%", day: 0, month: -0.0025 },
  { id: "cdi", label: "CDI", value: "10,40%", day: 0, month: -0.002 },
  { id: "ipca", label: "IPCA (12m)", value: "4,12%", day: 0.0004, month: 0.0031 },
  { id: "ibov", label: "Ibovespa", value: "132.480", day: 0.0072, month: 0.0214 },
  { id: "ifix", label: "IFIX", value: "3.312", day: 0.0018, month: 0.0096 },
  { id: "btc", label: "Bitcoin", value: "US$ 68.240", day: -0.0121, month: 0.0842 },
  { id: "eth", label: "Ethereum", value: "US$ 3.410", day: 0.0043, month: 0.0517 },
  { id: "usd", label: "Dólar", value: "R$ 5,42", day: -0.0031, month: 0.0128 },
  { id: "gold", label: "Ouro", value: "US$ 2.348", day: 0.0026, month: 0.0189 },
];

export interface SimulatorDef {
  id: string;
  title: string;
  description: string;
}

export const SIMULATORS: SimulatorDef[] = [
  { id: "compound", title: "Juros compostos", description: "Aporte mensal, prazo e taxa — patrimônio projetado." },
  { id: "income", title: "Renda desejada", description: "Quanto preciso investir para receber R$ X por mês?" },
  { id: "fire", title: "Independência financeira (FIRE)", description: "Quando seus rendimentos cobrem seu custo de vida." },
];

/* ---------------------------------------------------------------- math ---- */

export const monthlyRate = (annual: number) => Math.pow(1 + annual, 1 / 12) - 1;

/** Future value of an initial amount plus fixed monthly contributions. */
export function futureValue(initial: number, monthly: number, annual: number, years: number) {
  const i = monthlyRate(annual);
  const n = Math.round(years * 12);
  if (i === 0) return initial + monthly * n;
  return initial * Math.pow(1 + i, n) + monthly * ((Math.pow(1 + i, n) - 1) / i);
}

/** Blended expectation for a basket of selected asset classes. */
export function blend(ids: string[]) {
  const picked = ASSET_CLASSES.filter((a) => ids.includes(a.id));
  if (picked.length === 0) return { annualReturn: 0.1, annualYield: 0.06 };
  return {
    annualReturn: picked.reduce((s, a) => s + a.annualReturn, 0) / picked.length,
    annualYield: picked.reduce((s, a) => s + a.annualYield, 0) / picked.length,
  };
}

/** Capital required so that `target` monthly income is produced by `annualYield`. */
export function capitalForIncome(monthlyTarget: number, annualYield: number) {
  if (annualYield <= 0) return 0;
  return (monthlyTarget * 12) / annualYield;
}

/** Years needed to reach a capital target with monthly contributions. */
export function yearsToTarget(initial: number, monthly: number, annual: number, target: number) {
  const i = monthlyRate(annual);
  let value = initial;
  let months = 0;
  while (value < target && months < 12 * 80) {
    value = value * (1 + i) + monthly;
    months += 1;
  }
  return months / 12;
}
