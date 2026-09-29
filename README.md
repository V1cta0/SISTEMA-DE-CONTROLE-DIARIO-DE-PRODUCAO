# Sistema de Controle Diário de Produção — CICAL

Sistema web desenvolvido para registrar, consultar e acompanhar a produção diária de café da CICAL IND. E COM. DE PRODUTOS ALIMENTÍCIOS LTDA, empresa do setor de alimentos e bebidas localizada em Rondônia.

O projeto foi desenvolvido pela equipe da Escola SENAI Ji-Paraná – RO, com o objetivo de substituir o controle manual da produção por um sistema digital, facilitando o registro, armazenamento e consulta das informações.

## Problema

Atualmente, o controle da produção depende de anotações manuais, que podem apresentar inconsistências, perda de informações ou esquecimento.

A falta de registros confiáveis sobre o tipo de torra, moagem, quantidade produzida e produção por turno dificulta o acompanhamento da produção e pode prejudicar o planejamento e os resultados da empresa.

## Objetivo

Desenvolver um sistema simples e acessível para registrar e acompanhar a produção diária de café torrado, café moído e blend.

O sistema deve permitir o armazenamento permanente dos registros e facilitar a consulta das informações por diferentes períodos, produtos e turnos.

## Benefícios esperados

* Registro digital permanente da produção.
* Redução da dependência de anotações manuais.
* Histórico completo e consultável.
* Comparação da produção entre dias, semanas, meses e turnos.
* Visualização do volume produzido por tipo de produto.
* Apoio ao planejamento de estoque e vendas.
* Identificação mais rápida de variações no rendimento da produção.

## Equipe

| Integrante              | Função                | Responsabilidade                                                 |
| ----------------------- | --------------------- | ---------------------------------------------------------------- |
| Victor Hugo             | Back-end / Full Stack | Desenvolvimento do back-end, integração e organização do projeto |
| Miguel Gallo            | Front-end             | Desenvolvimento das interfaces e dashboard                       |
| Rafael Paiutto da Silva | Banco de Dados        | Desenvolvimento e organização do banco de dados                  |

## Tecnologias

### Back-end

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Maven

### Banco de dados

* MySQL

### Front-end

* React
* Vite
* React Router
* Recharts

### Outros

* BCrypt para armazenamento seguro das senhas
* Token em memória para autenticação
* ZXing para leitura de código de barras

## Estrutura do projeto

```text
cical-java/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── br/com/cical/producao/
│           │       ├── ProducaoApplication.java
│           │       ├── model/
│           │       ├── repository/
│           │       ├── service/
│           │       ├── controller/
│           │       ├── dto/
│           │       └── config/
│           └── resources/
│               └── application.properties
│
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── styles.css
│       ├── pages/
│       │   ├── Login/
│       │   ├── Dashboard/
│       │   ├── Cadastro/
│       │   └── Historico/
│       └── components/
│           └── MenuLateral/
│
└── docs/
    └── documentacao-tecnica.md
```

## Funcionalidades

* Login de usuários.
* Autenticação por token em memória.
* Cadastro da produção diária.
* Registro de data e turno.
* Registro do tipo de produto.
* Registro do tipo de torra.
* Registro do tipo de moagem.
* Registro da quantidade produzida.
* Campo para observações.
* Dashboard com informações da produção.
* Consulta do histórico de produção.
* Filtros por período, produto e turno.
* Gráficos para acompanhamento da produção.
* Armazenamento dos dados em banco MySQL.
* Leitura de código de barras pela câmera do celular.

## Banco de dados

O sistema utiliza o MySQL para armazenar os dados de forma permanente.

Para criar o banco de dados, pode ser utilizado:

```sql
CREATE DATABASE cical_producao;
```

Depois, configure o acesso ao banco no arquivo:

```text
backend/src/main/resources/application.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/cical_producao
spring.datasource.username=root
spring.datasource.password=SUA_SENHA
```

As tabelas podem ser criadas automaticamente pelo Hibernate durante a execução do back-end, conforme a configuração do projeto.

## Como executar

### 1. Banco de dados

Crie o banco MySQL:

```sql
CREATE DATABASE cical_producao;
```

Configure o usuário e a senha no arquivo `application.properties`.

### 2. Back-end

Entre na pasta do back-end:

```bash
cd backend
```

Execute o projeto:

```bash
mvn spring-boot:run
```

O back-end será executado em:

```text
http://localhost:8080
```

### 3. Front-end

Em outro terminal, entre na pasta do front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O front-end estará disponível em:

```text
http://localhost:5173
```

## Restrições do projeto

A solução deve:

* Possuir uma interface simples e objetiva.
* Ser adequada para operadores com diferentes níveis de familiaridade com sistemas digitais.
* Ser acessível por navegador web em computadores.
* Não exigir a instalação de software adicional para utilização.
* Possuir baixo custo de implementação e manutenção.
* Utilizar tecnologias abertas e acessíveis sempre que possível.

## Informações do projeto

**Escola:** Escola SENAI Ji-Paraná – RO

**Estado:** Rondônia (RO)

**Área de atuação:** Alimentos e Bebidas

**Empresa:** CICAL IND. E COM. DE PRODUTOS ALIMENTÍCIOS LTDA

**Data de cadastro:** 24/07/2026

**Data de início da vigência:** 24/07/2026

**Vigência:** 24/07/2026 a 24/07/2027

**Status:** Ativo

## Próximos passos

* Tela de gerenciamento de usuários.
* Edição de registros de produção.
* Exportação do histórico para Excel ou PDF.
* Tela de alteração de senha.
* Melhorias no dashboard.
* Deploy do sistema para acesso remoto.

## Documentação

A documentação técnica do projeto está disponível em:

```text
docs/documentacao-tecnica.md
```

Ela contém informações adicionais sobre o banco de dados, estrutura do sistema e endpoints da API.
