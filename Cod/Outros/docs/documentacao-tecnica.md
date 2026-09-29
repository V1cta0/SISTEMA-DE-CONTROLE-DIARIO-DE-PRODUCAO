# Documentação Técnica — Sistema de Controle Diário de Produção (CICAL)

## 1. Arquitetura

```
React (frontend, porta 5173)
        │  fetch() com JSON + token no header Authorization
        ▼
Spring Boot (backend, porta 8080)
        │  Spring Data JPA
        ▼
MySQL (banco "cical_producao")
```

O front-end e o back-end são dois projetos separados, cada um rodando
seu próprio servidor. Em produção, o front-end pode ser compilado
(`npm run build`) e hospedado separadamente ou junto do back-end.

## 2. Modelo de dados

### Tabela `usuarios`

| Campo | Tipo (MySQL) | Observações |
|---|---|---|
| id | BIGINT | Chave primária, auto incremento |
| nome | VARCHAR | Nome do usuário |
| email | VARCHAR | Único, usado no login |
| senha_hash | VARCHAR | Senha com hash BCrypt |
| tipo_usuario | VARCHAR | `administrador` ou `operador` |

### Tabela `producoes`

| Campo | Tipo (MySQL) | Observações |
|---|---|---|
| id | BIGINT | Chave primária, auto incremento |
| data | DATE | Data da produção |
| turno | VARCHAR | Manhã / Tarde / Noite |
| produto | VARCHAR | Café Torrado / Café Moído / Blend |
| tipo_torra | VARCHAR | Claro / Médio / Escuro (opcional) |
| tipo_moagem | VARCHAR | Grossa / Média / Fina (opcional) |
| quantidade_kg | DOUBLE | Quantidade produzida |
| observacoes | TEXT | Opcional |
| usuario_id | BIGINT | Chave estrangeira → usuarios.id |
| criado_em | DATETIME | Data/hora do registro no sistema |

```
usuarios (1) ─────< (N) producoes
```

As tabelas são criadas/atualizadas automaticamente pelo Hibernate
(`spring.jpa.hibernate.ddl-auto=update`) a partir das classes
`Usuario.java` e `Producao.java` — não é necessário rodar script SQL
manualmente.

## 3. Autenticação

Este projeto usa um esquema **simples**, pensado para ficar fácil de
entender e explicar:

1. No login, o back-end confere a senha (hash BCrypt) e gera um token
   aleatório (`UUID`), guardado em memória (`AutenticacaoService`),
   associado ao usuário.
2. O front-end guarda esse token no `localStorage` e o envia em todas
   as chamadas seguintes no header `Authorization: Bearer <token>`.
3. Um interceptor (`AutenticacaoInterceptor`) confere esse token antes
   de liberar o acesso às rotas de produção e dashboard.

Diferente do JWT, o token não carrega informação nele mesmo — ele só
funciona porque o servidor "lembra" dele em memória. Isso significa que,
se o back-end reiniciar, todo mundo precisa logar de novo. Para uma
evolução futura, dá para trocar por JWT ou por sessões do Spring Security.

## 4. Endpoints da API

Todas as rotas abaixo, exceto as de `/api/auth`, exigem o header
`Authorization: Bearer <token>`.

### Autenticação — `/api/auth`

| Método | Rota | Corpo | Descrição |
|---|---|---|---|
| POST | `/login` | `{ email, senha }` | Retorna `{ token, usuario }` |
| POST | `/cadastrar` | `{ nome, email, senha, tipoUsuario }` | Cria um novo usuário |

### Produção — `/api/producoes`

| Método | Rota | Descrição |
|---|---|---|
| POST | `/` | Registra uma nova produção |
| GET | `/` | Lista o histórico. Filtros via query string: `dataInicio`, `dataFim`, `produto`, `turno` (todos opcionais) |
| DELETE | `/{id}` | Remove um registro (somente `administrador`) |

### Dashboard — `/api/dashboard`

| Método | Rota | Descrição |
|---|---|---|
| GET | `/resumo` | Retorna produção do dia, do mês, agregados por produto/turno e série dos últimos 14 dias |

### Código de barras — `/api/codigo-barras`

| Método | Rota | Corpo | Descrição |
|---|---|---|---|
| POST | `/ler` | `multipart/form-data`, campo `imagem` | Recebe uma foto e devolve `{ codigo }` com o texto decodificado |

**Como funciona:** o celular é usado só como câmera, direto pelo navegador —
não precisa instalar nenhum app. O campo "Código de barras" na tela de
Cadastro tem um botão "📷 Ler" que abre a câmera traseira do celular
(via `<input type="file" capture="environment">`, um recurso padrão do
HTML, sem instalação). A foto é enviada para o back-end, onde a classe
`LeitorCodigoBarrasService` usa a biblioteca **ZXing** (a mesma usada
para QR Code) para decodificar o código — só que restrita aos formatos
de código de barras (EAN-13, EAN-8, UPC-A, UPC-E, CODE-128, CODE-39, ITF)
em vez de QR Code.

## 6. Modelo do banco no dbdiagram.io

O arquivo `docs/dbdiagram.dbml` contém o mesmo modelo (`usuarios` e
`producoes`) em formato DBML. Para visualizar: acesse
[dbdiagram.io/d](https://dbdiagram.io/d), crie um diagrama novo e use
"Import" para colar o conteúdo do arquivo.

## 7. Fluxo de uso resumido

1. O usuário acessa o React em `http://localhost:5173` e faz login.
2. O token retornado é salvo no navegador e enviado em toda chamada seguinte.
3. Em "Cadastrar Produção", o operador registra a produção do turno.
4. O Dashboard busca `/api/dashboard/resumo` e monta os gráficos com Recharts.
5. Em "Histórico", é possível consultar e filtrar todos os registros lançados.
