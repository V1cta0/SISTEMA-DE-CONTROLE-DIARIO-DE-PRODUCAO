# Torra Viva – Produção de café (React + Vite)

Painel de produção cafeeira com leitura de código de barras. Ao bipar um código, o lote aparece na tela.
Por enquanto roda com dados de demonstração (salvos no navegador). O backend entra depois.

## Rodar

    npm install
    npm run dev

## Estrutura

    src/
      App.jsx                      estado geral e composição da tela
      services/api.js              ÚNICO ponto de acesso a dados (mock ou backend)
      services/mock.js             dados de demonstração (localStorage)
      hooks/useBarcodeScanner.js   captura o leitor USB (age como teclado + Enter)
      components/                  Resumo, LeituraPanel, LotesTabela, LoteForm, LoteDetalhe, Modal

## Como ligar o backend

1. No `.env`, troque `VITE_USE_MOCK=false` e ajuste `VITE_API_URL` (ou a porta do proxy em `vite.config.js`).
2. O backend precisa expor:

| Método | Rota                        | Uso                                      |
|--------|-----------------------------|------------------------------------------|
| GET    | /api/lotes                  | lista de lotes                           |
| POST   | /api/lotes                  | cria lote                                |
| PUT    | /api/lotes/:id              | atualiza lote                            |
| DELETE | /api/lotes/:id              | remove lote                              |
| GET    | /api/lotes/codigo/:codigo   | busca lote pelo código lido (404 se não existe) |

Campos do lote: `id, codigo, tipo (torrado|moido|blend), data (YYYY-MM-DD), origem, composicao, entrada, saida, resp, status (producao|concluido|embalado), obs`.

## Leitor de código de barras

O leitor USB comum digita o código e aperta Enter. O hook `useBarcodeScanner` escuta isso na página
(quando nenhum campo está em foco) e chama `api.findByCode(codigo)`, mostrando o resultado em "Leitura de código de barras".
Se a leitura passar a ser feita pelo backend, troque o hook por WebSocket/SSE chamando a mesma função `aoLer(codigo)` no `App.jsx`.

O campo "Simular leitura" serve só para testar sem o leitor e pode ser removido.
