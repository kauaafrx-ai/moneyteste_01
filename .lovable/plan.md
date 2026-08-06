# Configurar chaves de API para desenvolvimento local

## Contexto
O usuário quer fazer o carregamento de notícias funcionar no ambiente local (.env.local). As chaves necessárias são `LOVABLE_API_KEY` e `FIRECRAWL_API_KEY`. Não devo expor os valores reais no chat; preciso garantir que as chaves existam no projeto e instruir o usuário a copiá-las do painel de Secrets para o `.env.local`.

## Passos
1. Garantir que `LOVABLE_API_KEY` esteja provisionada no projeto (criar se estiver ausente) via ferramenta apropriada.
2. Verificar se a conexão Firecrawl ainda está vinculada ao projeto e se `FIRECRAWL_API_KEY` existe como secret.
3. Criar um arquivo `.env.example` contendo apenas os nomes das variáveis, sem valores reais, para servir de template local.
4. Instruir o usuário a copiar os valores exatos do painel Secrets do projeto Lovable para o arquivo `.env.local` na raiz do projeto.
5. Validar que o endpoint de busca de notícias responde corretamente com as chaves configuradas.

## Resultado esperado
- `.env.local` configurado localmente com as duas chaves.
- Carregamento de notícias funcionando no preview/dev local.
- Nenhum valor secreto exposto em arquivos commitados ou no chat.
