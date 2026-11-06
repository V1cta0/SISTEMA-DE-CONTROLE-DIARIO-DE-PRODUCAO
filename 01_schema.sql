CREATE DATABASE IF NOT EXISTS cical
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE cical;

CREATE TABLE IF NOT EXISTS usuarios (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    nome          VARCHAR(150) NOT NULL,
    email         VARCHAR(150) NOT NULL,
    senha_hash    VARCHAR(255) NOT NULL,
    tipo_usuario  VARCHAR(20)  NOT NULL DEFAULT 'operador',
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uq_usuarios_email UNIQUE (email)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS producoes (
    id             BIGINT         NOT NULL AUTO_INCREMENT,
    data           DATE           NOT NULL,
    turno          VARCHAR(20)    NOT NULL,
    produto        VARCHAR(50)    NOT NULL,
    tipo_torra     VARCHAR(20)    NULL,
    tipo_moagem    VARCHAR(20)    NULL,
    quantidade_kg  DECIMAL(10,2)  NOT NULL,
    codigo_barras  VARCHAR(50)    NULL,
    observacoes    TEXT           NULL,
    usuario_id     BIGINT         NOT NULL,
    criado_em      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_producoes PRIMARY KEY (id),
    CONSTRAINT fk_producoes_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id),

    INDEX idx_producoes_data          (data),
    INDEX idx_producoes_data_turno    (data, turno),
    INDEX idx_producoes_data_produto  (data, produto),
    INDEX idx_producoes_codigo_barras (codigo_barras),

    CONSTRAINT chk_producoes_quantidade CHECK (quantidade_kg > 0),
    CONSTRAINT chk_producoes_turno      CHECK (turno IN ('Manhã', 'Tarde', 'Noite')),
    CONSTRAINT chk_producoes_produto    CHECK (produto IN ('Café Torrado', 'Café Moído', 'Blend')),
    CONSTRAINT chk_producoes_torra      CHECK (tipo_torra  IS NULL OR tipo_torra  IN ('Claro', 'Médio', 'Escuro')),
    CONSTRAINT chk_producoes_moagem     CHECK (tipo_moagem IS NULL OR tipo_moagem IN ('Grossa', 'Média', 'Fina'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
