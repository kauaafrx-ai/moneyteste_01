/**
 * Icon + brand registry.
 * Stored data keeps only string keys, so it can be serialized to storage;
 * the UI resolves the key to a Lucide component here.
 */
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bike,
  Book,
  Briefcase,
  Building2,
  Bus,
  Car,
  Cat,
  Coffee,
  CreditCard,
  Dumbbell,
  Film,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  Music4,
  PawPrint,
  PiggyBank,
  Plane,
  Plug,
  Receipt,
  Repeat,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Stethoscope,
  Tv,
  Utensils,
  Wallet,
  Wifi,
  Wrench,
  Zap,
} from "lucide-react";

export const ICONS = {
  home: Home,
  building: Building2,
  car: Car,
  bus: Bus,
  bike: Bike,
  plane: Plane,
  utensils: Utensils,
  coffee: Coffee,
  cart: ShoppingCart,
  bag: ShoppingBag,
  shirt: Shirt,
  music: Music4,
  film: Film,
  tv: Tv,
  game: Gamepad2,
  book: Book,
  graduation: GraduationCap,
  dumbbell: Dumbbell,
  health: HeartPulse,
  stethoscope: Stethoscope,
  pet: PawPrint,
  cat: Cat,
  wifi: Wifi,
  zap: Zap,
  plug: Plug,
  phone: Smartphone,
  laptop: Laptop,
  card: CreditCard,
  bank: Landmark,
  wallet: Wallet,
  banknote: Banknote,
  piggy: PiggyBank,
  receipt: Receipt,
  repeat: Repeat,
  gift: Gift,
  work: Briefcase,
  tools: Wrench,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICONS;

export const ICON_KEYS = Object.keys(ICONS) as IconKey[];

export function resolveIcon(key: string | undefined): LucideIcon {
  return (ICONS as Record<string, LucideIcon>)[key ?? ""] ?? Sparkles;
}

/* -- Streaming / subscription brands ------------------------------------- */

export interface Brand {
  id: string;
  name: string;
  /** Short mark rendered inside the tile. */
  mark: string;
  /** Brand colour — intentionally literal, these are third-party identities. */
  color: string;
  category: string;
}

export const BRANDS: Brand[] = [
  { id: "netflix", name: "Netflix", mark: "N", color: "#E50914", category: "Vídeo" },
  { id: "spotify", name: "Spotify", mark: "S", color: "#1DB954", category: "Música" },
  { id: "primevideo", name: "Prime Video", mark: "P", color: "#00A8E1", category: "Vídeo" },
  { id: "disney", name: "Disney+", mark: "D+", color: "#113CCF", category: "Vídeo" },
  { id: "max", name: "Max", mark: "M", color: "#0C1BFF", category: "Vídeo" },
  { id: "globoplay", name: "Globoplay", mark: "G", color: "#FF4B00", category: "Vídeo" },
  { id: "appletv", name: "Apple TV+", mark: "TV", color: "#111111", category: "Vídeo" },
  { id: "youtube", name: "YouTube Premium", mark: "YT", color: "#FF0000", category: "Vídeo" },
  { id: "paramount", name: "Paramount+", mark: "P+", color: "#0064FF", category: "Vídeo" },
  { id: "deezer", name: "Deezer", mark: "Dz", color: "#A238FF", category: "Música" },
  { id: "applemusic", name: "Apple Music", mark: "AM", color: "#FA243C", category: "Música" },
  { id: "xbox", name: "Xbox Game Pass", mark: "X", color: "#107C10", category: "Games" },
  { id: "psplus", name: "PlayStation Plus", mark: "PS", color: "#0070D1", category: "Games" },
  { id: "icloud", name: "iCloud+", mark: "iC", color: "#3693F3", category: "Nuvem" },
  { id: "gdrive", name: "Google One", mark: "G1", color: "#1A73E8", category: "Nuvem" },
  { id: "chatgpt", name: "ChatGPT Plus", mark: "AI", color: "#10A37F", category: "Produtividade" },
  { id: "canva", name: "Canva Pro", mark: "Cv", color: "#00C4CC", category: "Produtividade" },
  { id: "office", name: "Microsoft 365", mark: "MS", color: "#D83B01", category: "Produtividade" },
  { id: "ifood", name: "iFood Clube", mark: "iF", color: "#EA1D2C", category: "Delivery" },
  { id: "academia", name: "Academia", mark: "GY", color: "#0F766E", category: "Saúde" },
  { id: "custom", name: "Personalizado", mark: "+", color: "#64748B", category: "Outros" },
];

export function findBrand(id: string | undefined): Brand {
  return BRANDS.find((b) => b.id === id) ?? BRANDS[BRANDS.length - 1];
}

/* -- Card networks & banks ------------------------------------------------ */

export interface CardBrand {
  id: string;
  name: string;
  mark: string;
  color: string;
}

export const CARD_NETWORKS: CardBrand[] = [
  { id: "visa", name: "Visa", mark: "VISA", color: "#1A1F71" },
  { id: "mastercard", name: "Mastercard", mark: "MC", color: "#EB001B" },
  { id: "elo", name: "Elo", mark: "ELO", color: "#000000" },
  { id: "amex", name: "American Express", mark: "AMEX", color: "#006FCF" },
  { id: "hipercard", name: "Hipercard", mark: "HC", color: "#B3131B" },
  { id: "outro", name: "Outro", mark: "•••", color: "#64748B" },
];

export const BANKS: CardBrand[] = [
  { id: "nubank", name: "Nubank", mark: "Nu", color: "#8A05BE" },
  { id: "itau", name: "Itaú", mark: "It", color: "#EC7000" },
  { id: "bb", name: "Banco do Brasil", mark: "BB", color: "#FAE128" },
  { id: "bradesco", name: "Bradesco", mark: "Bd", color: "#CC092F" },
  { id: "santander", name: "Santander", mark: "St", color: "#EC0000" },
  { id: "caixa", name: "Caixa", mark: "CX", color: "#0070AF" },
  { id: "inter", name: "Inter", mark: "In", color: "#FF7A00" },
  { id: "c6", name: "C6 Bank", mark: "C6", color: "#242424" },
  { id: "xp", name: "XP", mark: "XP", color: "#000000" },
  { id: "picpay", name: "PicPay", mark: "PP", color: "#21C25E" },
  { id: "outro", name: "Outro banco", mark: "$", color: "#64748B" },
];

export function findCard(list: CardBrand[], id: string | undefined): CardBrand {
  return list.find((b) => b.id === id) ?? list[list.length - 1];
}
