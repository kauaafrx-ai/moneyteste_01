/**
 * Reference content for the Financial University area.
 * Educational only — links always point to the original source.
 */

export type Level = "Iniciante" | "Intermediário" | "Avançado";

export interface Track {
  id: string;
  title: string;
  description: string;
  level: Level;
  minutes: number;
  lessons: number;
  progress: number;
  topics: string[];
  /** Aulas em vídeo verificadas — sempre abrem no YouTube, na fonte original. */
  videos?: { title: string; channel: string; url: string }[];
}

export const TRACKS: Track[] = [
  { id: "organizacao", title: "Organização Financeira", description: "Orçamento, controle de gastos e o método que sustenta todo o resto.", level: "Iniciante", minutes: 90, lessons: 8, progress: 62, topics: ["Orçamento 50/30/20", "Categorias", "Fluxo de caixa pessoal"], videos: [{ title: "7 passos simples para organizar sua vida financeira", channel: "Me Poupe!", url: "https://www.youtube.com/watch?v=Uru7IhCSjJI" }] },
  { id: "reserva", title: "Reserva de Emergência", description: "Quanto guardar, onde guardar e quando usar.", level: "Iniciante", minutes: 45, lessons: 5, progress: 40, topics: ["Meses de custo", "Liquidez diária", "Erros comuns"], videos: [{ title: "Reserva de emergência: dinheiro para imprevistos", channel: "Nath Finanças", url: "https://www.youtube.com/watch?v=bEqt--FVP68" }] },
  { id: "renda-fixa", title: "Renda Fixa", description: "Como funcionam títulos, taxas, prazos e marcação a mercado.", level: "Iniciante", minutes: 120, lessons: 10, progress: 0, topics: ["Pré x pós", "IPCA+", "Risco de crédito"], videos: [{ title: "Aula sobre CDB e renda fixa na prática", channel: "Primo Pobre", url: "https://www.youtube.com/watch?v=Ofd6goeBFho" }] },
  { id: "tesouro", title: "Tesouro Direto", description: "Selic, Prefixado e IPCA+ na prática.", level: "Iniciante", minutes: 75, lessons: 6, progress: 0, topics: ["Tesouro Selic", "Tesouro IPCA+", "Custos e IR"], videos: [{ title: "Como investir no Tesouro Direto: guia para iniciantes", channel: "Me Poupe!", url: "https://www.youtube.com/watch?v=bolG9pgxEAU" }] },
  { id: "cdb", title: "CDB", description: "Rentabilidade, FGC e comparação com o CDI.", level: "Iniciante", minutes: 50, lessons: 4, progress: 0, topics: ["% do CDI", "FGC", "Liquidez"], videos: [{ title: "Aula sobre CDB — o investimento que rende mais", channel: "Primo Pobre", url: "https://www.youtube.com/watch?v=Ofd6goeBFho" }] },
  { id: "lci-lca", title: "LCI / LCA", description: "Isenção de IR, carência e quando faz sentido.", level: "Intermediário", minutes: 40, lessons: 4, progress: 0, topics: ["Isenção", "Carência", "Comparativo bruto x líquido"], videos: [{ title: "LCI e LCA ganham espaço entre investidores", channel: "CNN Brasil Money", url: "https://www.youtube.com/watch?v=GLNBReVSOBM" }] },
  { id: "fiis", title: "Fundos Imobiliários (FIIs)", description: "Tijolo, papel, P/VP, vacância e dividendos mensais.", level: "Intermediário", minutes: 150, lessons: 12, progress: 18, topics: ["P/VP", "Dividend Yield", "Segmentos"], videos: [{ title: "5 dúvidas sobre fundos imobiliários", channel: "Professor Baroni", url: "https://www.youtube.com/watch?v=fDWhVB2i3wc" }] },
  { id: "etfs", title: "ETFs", description: "Índices, diversificação instantânea e custos.", level: "Intermediário", minutes: 70, lessons: 6, progress: 0, topics: ["Índices", "Taxa de administração", "Tributação"], videos: [{ title: "Como funcionam os ETFs na prática", channel: "Bruno Perini – Você MAIS Rico", url: "https://www.youtube.com/watch?v=qRGdvpvQPpI" }] },
  { id: "acoes", title: "Ações", description: "Análise de empresas, indicadores e comportamento do investidor.", level: "Intermediário", minutes: 180, lessons: 14, progress: 0, topics: ["P/L e ROE", "Margens", "Dividendos"], videos: [{ title: "Aula sobre ações do zero para iniciantes", channel: "Primo Pobre", url: "https://www.youtube.com/watch?v=khToouRsNts" }] },
  { id: "cripto", title: "Criptomoedas", description: "Tecnologia, custódia, volatilidade e riscos.", level: "Avançado", minutes: 110, lessons: 9, progress: 0, topics: ["Blockchain", "Autocustódia", "Riscos"], videos: [{ title: "O que é Bitcoin e como nasceu o dinheiro digital", channel: "Empiricus", url: "https://www.youtube.com/watch?v=B63A8nZWSmw" }] },
  { id: "planejamento", title: "Planejamento Financeiro", description: "Objetivos, prazos e alocação coerente com a sua vida.", level: "Intermediário", minutes: 95, lessons: 8, progress: 0, topics: ["Metas", "Perfil de risco", "Alocação"], videos: [{ title: "Como sair na frente de 99% dos investidores", channel: "Clube do Valor", url: "https://www.youtube.com/watch?v=HejZFiwePU8" }] },
  { id: "fire", title: "Independência Financeira (FIRE)", description: "Taxa de poupança, regra dos 4% e liberdade de escolha.", level: "Avançado", minutes: 85, lessons: 7, progress: 0, topics: ["Regra dos 4%", "Taxa de poupança", "Coast FIRE"], videos: [{ title: "Aposentadoria antecipada e movimento FIRE", channel: "Nomad Global", url: "https://www.youtube.com/watch?v=EinwhOO0Y4M" }] },
  { id: "aposentadoria", title: "Aposentadoria", description: "INSS, previdência privada e planejamento de longo prazo.", level: "Intermediário", minutes: 80, lessons: 7, progress: 0, topics: ["INSS", "PGBL x VGBL", "Retiradas"], videos: [{ title: "Onde investir pensando na aposentadoria", channel: "InfoMoney", url: "https://www.youtube.com/watch?v=xeADEwII9Vg" }] },
  { id: "ir", title: "Imposto de Renda", description: "Declaração, isenções e tributação de investimentos.", level: "Intermediário", minutes: 100, lessons: 8, progress: 0, topics: ["Come-cotas", "Isenções", "Darf"], videos: [{ title: "Imposto de Renda para investidores", channel: "Suno", url: "https://www.youtube.com/watch?v=MmVH9fkQhTo" }] },
  { id: "economia", title: "Economia Básica", description: "Juros, inflação, câmbio e ciclos econômicos.", level: "Iniciante", minutes: 90, lessons: 8, progress: 0, topics: ["Selic", "IPCA", "PIB"], videos: [{ title: "O que é a taxa Selic e como ela funciona", channel: "Nexo Jornal", url: "https://www.youtube.com/watch?v=WBNkhIaY7gc" }] },
  { id: "contabilidade", title: "Contabilidade Básica", description: "Balanço, DRE e fluxo de caixa sem complicação.", level: "Avançado", minutes: 120, lessons: 10, progress: 0, topics: ["Balanço", "DRE", "Fluxo de caixa"], videos: [{ title: "Como organizar as contas da sua empresa do zero", channel: "Sebrae PR", url: "https://www.youtube.com/watch?v=kFokS9Qw84Q" }] },
  { id: "empresarial", title: "Finanças Empresariais", description: "Capital de giro, margem e valuation de negócios.", level: "Avançado", minutes: 140, lessons: 11, progress: 0, topics: ["Capital de giro", "Margens", "Valuation"], videos: [{ title: "5 dicas de gestão financeira para o seu negócio", channel: "Sebrae PR", url: "https://www.youtube.com/watch?v=kFokS9Qw84Q" }] },
];

export interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "CDI", definition: "Taxa de referência dos empréstimos entre bancos, usada como parâmetro da renda fixa.", example: "Um CDB que paga 110% do CDI rende 10% acima da taxa de referência." },
  { term: "Selic", definition: "Taxa básica de juros da economia, definida pelo Copom.", example: "Com Selic a 10,5%, o Tesouro Selic acompanha essa variação." },
  { term: "IPCA", definition: "Índice oficial de inflação do Brasil, medido pelo IBGE.", example: "Um título IPCA+5% entrega inflação mais 5% ao ano." },
  { term: "Dividend Yield", definition: "Proporção entre os proventos pagos em 12 meses e o preço do ativo.", example: "R$ 1,00 de proventos sobre um preço de R$ 10,00 gera DY de 10%." },
  { term: "P/VP", definition: "Preço da cota dividido pelo valor patrimonial por cota.", example: "P/VP de 0,9 indica negociação abaixo do valor patrimonial." },
  { term: "P/L", definition: "Preço da ação dividido pelo lucro por ação.", example: "P/L 8 sugere 8 anos de lucro atual para pagar o preço." },
  { term: "ROE", definition: "Retorno sobre o patrimônio líquido da empresa.", example: "ROE de 20% significa R$ 20 de lucro para cada R$ 100 de patrimônio." },
  { term: "ETF", definition: "Fundo negociado em bolsa que replica um índice.", example: "Um ETF de Ibovespa acompanha a carteira teórica do índice." },
  { term: "REIT", definition: "Equivalente norte-americano dos fundos imobiliários.", example: "REITs distribuem a maior parte do lucro aos cotistas." },
  { term: "Valuation", definition: "Conjunto de métodos para estimar o valor de um ativo ou empresa.", example: "Fluxo de caixa descontado é um método clássico de valuation." },
  { term: "Liquidez", definition: "Facilidade de converter um ativo em dinheiro sem perder valor.", example: "Tesouro Selic tem liquidez diária." },
  { term: "Split", definition: "Desdobramento de ações que aumenta a quantidade e reduz o preço unitário.", example: "Um split 1:2 transforma 1 ação de R$ 100 em 2 de R$ 50." },
  { term: "Bonificação", definition: "Distribuição de novas ações aos acionistas sem custo.", example: "Bonificação de 10% entrega 1 ação nova a cada 10 possuídas." },
  { term: "Debênture", definition: "Título de dívida emitido por empresas para captar recursos.", example: "Debêntures incentivadas são isentas de IR para pessoa física." },
  { term: "Vacância", definition: "Percentual de imóveis desocupados na carteira de um FII.", example: "Vacância de 5% indica que 95% da área está locada." },
  { term: "Marcação a mercado", definition: "Atualização diária do preço de um título conforme as taxas atuais.", example: "Juros em alta reduzem o preço de títulos prefixados." },
  { term: "FGC", definition: "Fundo garantidor que protege aplicações elegíveis até um limite por CPF e instituição.", example: "CDBs contam com cobertura do FGC dentro do limite vigente." },
  { term: "Come-cotas", definition: "Antecipação semestral de IR em determinados fundos.", example: "Ocorre em maio e novembro em fundos de renda fixa." },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Qual índice mede a inflação oficial no Brasil?",
    options: ["CDI", "IPCA", "Ibovespa", "IFIX"],
    answer: 1,
    explanation: "O IPCA é o índice oficial de inflação, calculado pelo IBGE.",
  },
  {
    id: "q2",
    question: "O que o Dividend Yield representa?",
    options: [
      "O lucro total da empresa no ano",
      "O preço da ação dividido pelo lucro",
      "Os proventos de 12 meses sobre o preço do ativo",
      "A dívida líquida sobre o patrimônio",
    ],
    answer: 2,
    explanation: "DY relaciona os proventos distribuídos nos últimos 12 meses com o preço atual.",
  },
  {
    id: "q3",
    question: "Onde costuma fazer mais sentido manter a reserva de emergência?",
    options: [
      "Em ações de dividendos",
      "Em criptomoedas",
      "Em ativos de liquidez diária e baixo risco",
      "Em imóveis",
    ],
    answer: 2,
    explanation: "A reserva precisa de liquidez imediata e baixa oscilação de preço.",
  },
  {
    id: "q4",
    question: "A regra dos 4% no conceito FIRE serve para estimar:",
    options: [
      "A taxa de juros do próximo ano",
      "Quanto se pode retirar por ano do patrimônio",
      "O imposto devido sobre dividendos",
      "A inflação acumulada",
    ],
    answer: 1,
    explanation: "É uma referência histórica de retirada anual sustentável do patrimônio investido.",
  },
];

export interface InvestorProfile {
  name: string;
  bio: string;
  philosophy: string;
  quote: string;
  books: string[];
}

export const INVESTORS: InvestorProfile[] = [
  { name: "Warren Buffett", bio: "Investidor norte-americano à frente da Berkshire Hathaway desde 1965.", philosophy: "Comprar negócios excelentes a preços razoáveis e mantê-los por muito tempo.", quote: "O preço é o que você paga; valor é o que você leva.", books: ["The Essays of Warren Buffett"] },
  { name: "Charlie Munger", bio: "Sócio de Buffett, conhecido pelos modelos mentais e pelo pensamento invertido.", philosophy: "Qualidade acima de barganha, com disciplina e paciência extremas.", quote: "Inverta, sempre inverta.", books: ["Poor Charlie's Almanack"] },
  { name: "Ray Dalio", bio: "Fundador da Bridgewater Associates.", philosophy: "Diversificação estrutural e entendimento dos ciclos econômicos.", quote: "Dor mais reflexão é igual a progresso.", books: ["Princípios"] },
  { name: "Peter Lynch", bio: "Gestor do fundo Magellan, da Fidelity, entre 1977 e 1990.", philosophy: "Investir no que você entende e acompanhar o negócio de perto.", quote: "Conheça o que você possui e por que você possui.", books: ["O Jeito Peter Lynch de Investir"] },
  { name: "Benjamin Graham", bio: "Pai do value investing e professor de Buffett.", philosophy: "Margem de segurança e separação entre preço e valor intrínseco.", quote: "O investidor inteligente é um realista.", books: ["O Investidor Inteligente"] },
  { name: "Aswath Damodaran", bio: "Professor de finanças da NYU Stern, referência em valuation.", philosophy: "Toda história precisa virar número e todo número precisa de uma história.", quote: "Valuation é uma ponte entre narrativa e números.", books: ["Valuation: Como Avaliar Empresas"] },
  { name: "Luiz Barsi", bio: "Um dos maiores investidores pessoa física da bolsa brasileira.", philosophy: "Construir uma carteira previdenciária focada em dividendos consistentes.", quote: "Invista para receber, não para vender.", books: ["Ações Comuns, Lucros Extraordinários (leitura relacionada)"] },
  { name: "Howard Marks", bio: "Cofundador da Oaktree Capital.", philosophy: "Atenção ao ciclo e ao risco antes de pensar em retorno.", quote: "Você não pode prever, mas pode se preparar.", books: ["O Mais Importante Para o Investidor"] },
];

export interface Material {
  title: string;
  source: string;
  url: string;
  kind: "Guia" | "Cartilha" | "Portal" | "Vídeo";
}

/** Sempre links para a fonte original — nada é hospedado no app. */
export const MATERIALS: Material[] = [
  { title: "Educação do Investidor", source: "B3", url: "https://www.b3.com.br/pt_br/educacao/", kind: "Guia" },
  { title: "Cidadania Financeira", source: "Banco Central", url: "https://www.bcb.gov.br/cidadaniafinanceira", kind: "Cartilha" },
  { title: "Como investir no Tesouro Direto", source: "Tesouro Nacional", url: "https://www.tesourodireto.com.br/", kind: "Guia" },
  { title: "Portal do Investidor", source: "CVM", url: "https://www.investidor.gov.br/", kind: "Portal" },
  { title: "Imposto de Renda e investimentos", source: "Receita Federal", url: "https://www.gov.br/receitafederal/pt-br", kind: "Guia" },
  { title: "Investidor · Portal do Governo", source: "gov.br", url: "https://www.gov.br/investidor/pt-br", kind: "Portal" },
  { title: "Educar — educação financeira", source: "ANBIMA", url: "https://www.anbima.com.br/pt_br/educar/", kind: "Guia" },
  { title: "IBGE Explica: inflação", source: "IBGE", url: "https://www.ibge.gov.br/explica/inflacao.php", kind: "Portal" },
];
