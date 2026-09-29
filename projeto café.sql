CREATE DATABASE producao_Sical;
USE producao_sical;
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    categoria_id INT,
    peso_gramas INT,
    unidade_medida VARCHAR(20) DEFAULT 'UN',
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
);

CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    codigo_lote VARCHAR(50) NOT NULL UNIQUE,
    data_fabricacao DATE,
    data_validade DATE,
    quantidade_planejada INT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);

CREATE TABLE esteiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    localizacao VARCHAR(150),
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nivel_acesso VARCHAR(30) DEFAULT 'OPERADOR',
    ativo BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    produto_id INT NOT NULL,
    lote_id INT,
    esteira_id INT,
    usuario_id INT,

    codigo_barras_lido VARCHAR(50) NOT NULL,

    tipo_movimentacao VARCHAR(30) DEFAULT 'ENTRADA',

    quantidade INT DEFAULT 1,

    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    observacao TEXT,

    FOREIGN KEY (produto_id)
        REFERENCES produtos(id),

    FOREIGN KEY (lote_id)
        REFERENCES lotes(id),

    FOREIGN KEY (esteira_id)
        REFERENCES esteiras(id),

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);

CREATE TABLE leituras_invalidas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    codigo_barras VARCHAR(50) NOT NULL,

    esteira_id INT,
    usuario_id INT,

    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    motivo VARCHAR(200),

    FOREIGN KEY (esteira_id)
        REFERENCES esteiras(id),

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
);

CREATE INDEX idx_movimentacoes_data
ON movimentacoes(data_hora);

CREATE INDEX idx_movimentacoes_produto
ON movimentacoes(produto_id);

CREATE INDEX idx_movimentacoes_lote
ON movimentacoes(lote_id);

CREATE INDEX idx_movimentacoes_codigo
ON movimentacoes(codigo_barras_lido);

SHOW TABLES;