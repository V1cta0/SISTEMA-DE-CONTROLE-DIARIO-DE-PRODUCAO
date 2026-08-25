# Sistema de Controle Diário de Produção - CICAL

## Sobre o projeto

O Sistema de Controle Diário de Produção é uma aplicação web desenvolvida para a CICAL, empresa do setor de alimentos e bebidas localizada em Rondônia.

A proposta é substituir o controle manual da produção por um sistema digital, permitindo registrar, consultar e acompanhar a produção de café torrado, moído e blend.

## Problema

Atualmente, os registros de produção são realizados de forma manual. Isso pode causar perda de informações, erros nos registros e dificuldade para consultar dados anteriores.

A falta de informações organizadas também dificulta a comparação da produção entre diferentes dias, turnos e produtos.

## Objetivo

Desenvolver um sistema simples e acessível pelo navegador para:

* Registrar a produção diária;
* Armazenar os dados de forma permanente;
* Consultar o histórico de produção;
* Filtrar registros por período, produto e turno;
* Acompanhar a quantidade produzida;
* Visualizar gráficos e informações da produção.

## Principais funcionalidades

### Cadastro de produção

O usuário poderá informar:

* Data;
* Turno;
* Produto;
* Tipo de torra;
* Tipo de moagem;
* Quantidade produzida;
* Observações.

### Dashboard

Apresentará um resumo da produção, como:

* Produção do dia;
* Produção do mês;
* Produção por produto;
* Produção por turno;
* Gráficos de acompanhamento.

### Histórico

Permite consultar os registros já realizados e utilizar filtros para encontrar informações específicas.

## Estrutura do sistema

```text
Login
   ↓
Dashboard
   ↓
Cadastro de Produção
   ↓
Banco de Dados
   ↓
Histórico
   ↓
Gráficos e Relatórios
```

## Banco de dados

As principais informações do sistema serão relacionadas a:

**Usuários**

* Identificação;
* Nome;
* Email;
* Tipo de usuário.

**Produções**

* Data;
* Turno;
* Produto;
* Tipo de torra;
* Tipo de moagem;
* Quantidade produzida;
* Observações;
* Usuário responsável pelo registro.

## Divisão da equipe

| Integrante   | Função         | Responsabilidade                                     |
| ------------ | -------------- | ---------------------------------------------------- |
| Victor Hugo  | Full Stack     | Integração, desenvolvimento e organização do projeto |
| Miguel Gallo | Front-end      | Interfaces e dashboard                               |
| Mikael Levi  | Back-end       | API e regras de negócio                              |
| Luiz Vieira  | Banco de Dados | Estrutura e gerenciamento do banco                   |

## Benefícios esperados

* Redução do uso de anotações manuais;
* Menor risco de perda de informações;
* Histórico permanente da produção;
* Facilidade para consultar dados;
* Comparação entre turnos e períodos;
* Melhor acompanhamento da produção;
* Apoio ao planejamento de estoque e vendas.

## Restrições

O sistema deverá possuir uma interface simples e objetiva, funcionar através do navegador, não exigir instalação de software adicional e ter baixo custo de implementação e manutenção.

## Tecnologias

*Preencher posteriormente.*

## Escola

**Escola SENAI Ji-Paraná - RO**

**Área de atuação:** Alimentos e Bebidas
