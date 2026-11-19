-- Sistema de Controle Diario de Producao - CICAL
-- Script simples para criar o banco de dados MySQL manualmente.
--
-- Isso e OPCIONAL: se voce deixar "spring.jpa.hibernate.ddl-auto=update"
-- no application.properties, o Hibernate cria essas mesmas tabelas
-- sozinho quando o backend sobe pela primeira vez.
--
-- Use este script se preferir criar o banco "na mao", para entender
-- exatamente o que existe nele.

CREATE DATABASE IF NOT EXISTS cical_producao;
USE cical_producao;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'operador'
);

CREATE TABLE IF NOT EXISTS producoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    turno VARCHAR(20) NOT NULL,
    produto VARCHAR(50) NOT NULL,
    tipo_torra VARCHAR(20),
    tipo_moagem VARCHAR(20),
    quantidade_kg DOUBLE NOT NULL,
    codigo_barras VARCHAR(50),
    observacoes TEXT,
    usuario_id BIGINT NOT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Nao e preciso inserir o usuario administrador aqui: o proprio backend
-- (classe InicializadorDados.java) cria "admin@cical.com.br / admin123"
-- automaticamente na primeira vez que a aplicacao Spring Boot roda,
-- ja com a senha criptografada corretamente (BCrypt).
