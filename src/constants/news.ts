export type NewsCategory = {
  id: string;
  label: string;
  emoji: string;
  query: string;
};

export const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "destaques", label: "Destaques", emoji: "⭐", query: "principais notícias economia Brasil hoje" },
  { id: "economia-br", label: "Economia BR", emoji: "🇧🇷", query: "economia brasileira notícias" },
  { id: "economia-mundial", label: "Economia Mundial", emoji: "🌍", query: "economia mundial notícias" },
  { id: "bolsa-br", label: "Bolsa BR", emoji: "📈", query: "Ibovespa B3 bolsa brasileira notícias" },
  { id: "bolsa-us", label: "Bolsa EUA", emoji: "🇺🇸", query: "Wall Street S&P 500 Nasdaq notícias" },
  { id: "fiis", label: "FIIs", emoji: "🏢", query: "fundos imobiliários FIIs notícias IFIX" },
  { id: "cripto", label: "Criptomoedas", emoji: "₿", query: "bitcoin ethereum criptomoedas notícias" },
  { id: "selic", label: "Juros / Selic", emoji: "💵", query: "Selic Copom Banco Central taxa de juros" },
  { id: "ipca", label: "Inflação (IPCA)", emoji: "📊", query: "IPCA inflação Brasil notícias" },
  { id: "dolar", label: "Dólar", emoji: "💲", query: "cotação dólar câmbio Brasil" },
  { id: "empresas", label: "Empresas", emoji: "🏭", query: "grandes empresas balanço resultados Brasil" },
  { id: "bancos", label: "Bancos", emoji: "🏦", query: "bancos brasileiros Itaú Bradesco Santander notícias" },
  { id: "startups", label: "Startups", emoji: "🚀", query: "startups Brasil venture capital notícias" },
  { id: "receita", label: "Receita Federal", emoji: "🧾", query: "Receita Federal notícias imposto de renda" },
];
