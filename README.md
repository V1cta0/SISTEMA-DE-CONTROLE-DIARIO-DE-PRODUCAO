# Sistema de Controle Diário de Produção — CICAL

Sistema web para registrar, consultar e acompanhar a produção diária de
café torrado, moído e blend da CICAL (Rondônia).

Projeto desenvolvido para a **Escola SENAI Ji-Paraná – RO**, no contexto
do desafio da empresa **CICAL IND. E COM. DE PRODUTOS ALIMENTÍCIOS LTDA**.

## Equipe

| Integrante | Função | Responsabilidade |
|---|---|---|
| Victor Hugo | Full Stack | Integração, desenvolvimento e organização do projeto |
| Miguel Gallo | Front-end | Interfaces e dashboard |
| Rafael Paiutto da Silva | Front-end | Banco de Dados|

## Tecnologias

- **Back-end:** Java 17 + Spring Boot (Web, Data JPA)
- **Banco de dados:** MySQL
- **Autenticação:** login simples com token em memória (sem JWT, para
  manter o código mais fácil de entender) + senhas com hash BCrypt
- **Front-end:** React (Vite) + React Router + Recharts (gráficos)

## Estrutura do projeto

```
cical-java/
├── backend/                        (Spring Boot / Maven)
│   ├── pom.xml
│   └── src/main/
│       ├── java/br/com/cical/producao/
│       │   ├── ProducaoApplication.java
│       │   ├── model/         (Usuario, Producao)
│       │   ├── repository/    (UsuarioRepository, ProducaoRepository)
│       │   ├── service/       (AutenticacaoService)
│       │   ├── controller/    (Autenticacao, Producao, Dashboard)
│       │   ├── dto/           (objetos de requisição/resposta)
│       │   └── config/        (interceptor de autenticação, CORS, seed do admin)
│       └── resources/application.properties
├── frontend/                       (React + Vite)
│   └── src/
│       ├── main.jsx, App.jsx, api.js, styles.css
│       ├── pages/    (Login, Dashboard, Cadastro, Historico)
│       └── components/ (MenuLateral)
└── docs/
    └── documentacao-tecnica.md
```

<<<<<<< HEAD
## Como executar

### 1. Banco de dados (MySQL)

Você tem duas formas de criar o banco — escolha uma:

**Opção A — deixar o Hibernate criar tudo (mais simples):**
```sql
CREATE DATABASE cical_producao;
```
As tabelas aparecem sozinhas quando você rodar o back-end pela primeira vez.

**Opção B — criar manualmente com o script pronto** (bom se você quiser
ver exatamente o que existe no banco): rode o conteúdo de
`backend/database/schema.sql` no MySQL Workbench, DBeaver ou no terminal:
```bash
mysql -u root -p < backend/database/schema.sql
```

Edite `backend/src/main/resources/application.properties` com o usuário
e senha do seu MySQL local:

```properties
spring.datasource.username=root
spring.datasource.password=SUA_SENHA_AQUI
```

### 2. Back-end (Spring Boot)

Pré-requisito: **Java 17+** e **Maven** instalados.

```bash
cd backend
mvn spring-boot:run
```

O servidor sobe em `http://localhost:8080`. Na primeira execução, ele
cria automaticamente as tabelas e um usuário administrador:

- Email: `admin@cical.com.br`
- Senha: `admin123`

### 3. Front-end (React)

Pré-requisito: **Node.js 18+**.

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

> O front-end (Vite, porta 5173) e o back-end (Spring Boot, porta 8080)
> rodam separados durante o desenvolvimento — por isso o CORS já vem
> liberado em `WebConfig.java` para `http://localhost:5173`.

## Funcionalidades implementadas (versão básica)

- [x] Login com autenticação simples por token
- [x] Cadastro de produção (data, turno, produto, torra, moagem, quantidade, observações)
- [x] Dashboard com produção do dia, do mês, por produto, por turno e gráfico dos últimos 14 dias
- [x] Histórico com filtros por período, produto e turno
- [x] Banco de dados MySQL persistente
- [x] Leitura de código de barras pela câmera do celular (direto pelo
      navegador, decodificada em Java com ZXing no back-end)

## Próximos passos sugeridos

- Tela de gestão de usuários
- Edição de registros de produção já lançados
- Exportação do histórico (Excel/PDF)
- Tela de troca de senha
- Deploy do back-end e do front-end em um servidor para acesso remoto

Consulte `docs/documentacao-tecnica.md` para detalhes do banco de dados
e dos endpoints da API.
=======
**Área de atuação:** Alimentos e Bebidas




Para utilização e testes em BD: https://dbdiagram.io/d
>>>>>>> 7a58168994b06799fef080bb3ad812d63e95a077
