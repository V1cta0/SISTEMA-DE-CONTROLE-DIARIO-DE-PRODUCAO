-- Sistema de Controle Diario de Producao - CICAL
-- Script simples para criar o banco de dados MySQL manualmente.
--
-- Isso e OPCIONAL: o application.properties ja usa createDatabaseIfNotExist=true e
-- "spring.jpa.hibernate.ddl-auto=update", entao o proprio backend cria o banco "cical"
-- e as tabelas na primeira vez que sobe.
--
-- O banco aqui precisa se chamar "cical", o mesmo nome da URL do application.properties.
-- (Antes este script criava "cical_producao", e o backend nao enxergava essas tabelas.)
-- Para a versao completa, com restricoes, indices e views, use os scripts da raiz do projeto
-- (01_schema.sql, 03_views.sql e, se quiser dados de exemplo, 04_dados_teste).

CREATE DATABASE IF NOT EXISTS cical
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE cical;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    tipo_usuario VARCHAR(20) NOT NULL DEFAULT 'operador'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_producoes_codigo_barras (codigo_barras)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Nao e preciso inserir o usuario administrador aqui: o proprio backend
-- (classe AdminInicial.java) cria "admin@cical.com.br / admin123"
-- automaticamente na primeira vez que a aplicacao Spring Boot roda,
-- ja com a senha criptografada corretamente (BCrypt).
