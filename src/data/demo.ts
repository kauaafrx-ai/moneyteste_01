/**
 * Demo dataset used to render the premium UI while real persistence is not
 * connected. Pure data — no logic, no side effects. Amounts are in cents.
 */
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Car,
  Coffee,
  Dumbbell,
  Home,
  Landmark,
  Music4,
  Plane,
  ShoppingBag,
  Utensils,
  Wifi,
  Zap,
} from "lucide-react";

export interface FlowPoint {
  label: string;
  income: number;
  expense: number;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

export interface CategorySlice {
  id: string;
  label: string;
  amount: number;
  icon: LucideIcon;
  colorVar: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  icon: LucideIcon;
  kind: "income" | "expense";
}

export interface BillItem {
  id: string;
  title: string;
  amount: number;
  dueInDays: number;
  dueDate: string;
  icon: LucideIcon;
  status: "pending" | "due" | "late";
}

export interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  icon: LucideIcon;
  deadline: string;
}

export const OVERVIEW = {
  balance: 4_872_340,
  income: 1_284_500,
  expense: 736_180,
  deltaRatio: 0.082,
  savingsRatio: 0.427,
  netWorth: 21_640_900,
  reserve: 3_120_000,
  reserveTarget: 4_800_000,
  subscriptions: 48_970,
  subscriptionCount: 7,
};

export const WEEK_FLOW: FlowPoint[] = [
  { label: "Seg", income: 62_000, expense: 41_200 },
  { label: "Ter", income: 18_400, expense: 63_800 },
  { label: "Qua", income: 121_000, expense: 28_600 },
  { label: "Qui", income: 34_500, expense: 92_400 },
  { label: "Sex", income: 210_000, expense: 118_300 },
  { label: "Sáb", income: 12_800, expense: 74_900 },
  { label: "Dom", income: 6_200, expense: 31_500 },
];

export const MONTH_FLOW: FlowPoint[] = [
  { label: "Sem 1", income: 412_000, expense: 231_400 },
  { label: "Sem 2", income: 286_500, expense: 198_700 },
  { label: "Sem 3", income: 318_000, expense: 174_200 },
  { label: "Sem 4", income: 268_000, expense: 131_880 },
];

export const NET_WORTH_SERIES: SeriesPoint[] = [
  { label: "Ago", value: 16_240_000 },
  { label: "Set", value: 16_910_000 },
  { label: "Out", value: 17_480_000 },
  { label: "Nov", value: 17_120_000 },
  { label: "Dez", value: 18_640_000 },
  { label: "Jan", value: 19_050_000 },
  { label: "Fev", value: 19_720_000 },
  { label: "Mar", value: 19_410_000 },
  { label: "Abr", value: 20_280_000 },
  { label: "Mai", value: 20_940_000 },
  { label: "Jun", value: 21_180_000 },
  { label: "Jul", value: 21_640_900 },
];

export const BALANCE_SPARK: SeriesPoint[] = [
  { label: "1", value: 4_120_000 },
  { label: "2", value: 4_260_000 },
  { label: "3", value: 4_180_000 },
  { label: "4", value: 4_430_000 },
  { label: "5", value: 4_610_000 },
  { label: "6", value: 4_540_000 },
  { label: "7", value: 4_872_340 },
];

export const CATEGORIES: CategorySlice[] = [
  { id: "moradia", label: "Moradia", amount: 248_000, icon: Home, colorVar: "var(--chart-1)" },
  { id: "alimentacao", label: "Alimentação", amount: 164_300, icon: Utensils, colorVar: "var(--chart-2)" },
  { id: "transporte", label: "Transporte", amount: 98_400, icon: Car, colorVar: "var(--chart-3)" },
  { id: "lazer", label: "Lazer", amount: 82_600, icon: Music4, colorVar: "var(--chart-4)" },
  { id: "compras", label: "Compras", amount: 142_880, icon: ShoppingBag, colorVar: "var(--chart-5)" },
];

export const ACTIVITY: ActivityItem[] = [
  { id: "a1", title: "Salário", category: "Receita fixa", amount: 1_180_000, date: "Hoje", icon: Landmark, kind: "income" },
  { id: "a2", title: "Mercado Aurora", category: "Alimentação", amount: -48_720, date: "Hoje", icon: Utensils, kind: "expense" },
  { id: "a3", title: "Uber", category: "Transporte", amount: -3_240, date: "Ontem", icon: Car, kind: "expense" },
  { id: "a4", title: "Café Matiz", category: "Alimentação", amount: -2_190, date: "Ontem", icon: Coffee, kind: "expense" },
  { id: "a5", title: "Academia Vitta", category: "Saúde", amount: -18_900, date: "23 jul", icon: Dumbbell, kind: "expense" },
  { id: "a6", title: "Passagem GRU–LIS", category: "Viagem", amount: -412_000, date: "21 jul", icon: Plane, kind: "expense" },
];

export const BILLS: BillItem[] = [
  { id: "b1", title: "Aluguel", amount: 320_000, dueInDays: 2, dueDate: "31 jul", icon: Building2, status: "due" },
  { id: "b2", title: "Energia elétrica", amount: 28_640, dueInDays: 5, dueDate: "03 ago", icon: Zap, status: "pending" },
  { id: "b3", title: "Internet fibra", amount: 14_990, dueInDays: 8, dueDate: "06 ago", icon: Wifi, status: "pending" },
  { id: "b4", title: "Seguro do carro", amount: 96_400, dueInDays: 12, dueDate: "10 ago", icon: Car, status: "pending" },
];

export const GOALS: GoalItem[] = [
  { id: "g1", title: "Viagem para Portugal", current: 1_840_000, target: 2_800_000, icon: Plane, deadline: "Dez 2026" },
  { id: "g2", title: "Entrada do apartamento", current: 6_200_000, target: 12_000_000, icon: Home, deadline: "Mar 2028" },
  { id: "g3", title: "Trocar de carro", current: 940_000, target: 4_500_000, icon: Car, deadline: "Set 2027" },
];

export const ALLOCATION: CategorySlice[] = [
  { id: "rf", label: "Renda fixa", amount: 9_820_000, icon: Landmark, colorVar: "var(--chart-2)" },
  { id: "rv", label: "Renda variável", amount: 6_140_000, icon: Building2, colorVar: "var(--chart-1)" },
  { id: "fii", label: "Fundos imobiliários", amount: 3_560_000, icon: Home, colorVar: "var(--chart-3)" },
  { id: "int", label: "Internacional", amount: 2_120_900, icon: Plane, colorVar: "var(--chart-4)" },
];

export const WEEK_SUMMARY = {
  spent: 450_700,
  budget: 620_000,
  best: "Você gastou 18% menos que na semana passada",
};
