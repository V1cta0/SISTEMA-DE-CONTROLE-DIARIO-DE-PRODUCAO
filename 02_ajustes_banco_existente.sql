USE cical;

SELECT id, data, turno, produto, tipo_torra, tipo_moagem, quantidade_kg
FROM producoes
WHERE quantidade_kg <= 0
   OR turno   NOT IN ('Manhã', 'Tarde', 'Noite')
   OR produto NOT IN ('Café Torrado', 'Café Moído', 'Blend')
   OR (tipo_torra  IS NOT NULL AND tipo_torra  NOT IN ('Claro', 'Médio', 'Escuro'))
   OR (tipo_moagem IS NOT NULL AND tipo_moagem NOT IN ('Grossa', 'Média', 'Fina'));

ALTER TABLE usuarios  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE producoes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE usuarios
    ADD COLUMN ativo     BOOLEAN  NOT NULL DEFAULT TRUE,
    ADD COLUMN criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE producoes
    ADD COLUMN atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE producoes
    MODIFY criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE producoes MODIFY quantidade_kg DECIMAL(10,2) NOT NULL;

ALTER TABLE producoes
    ADD CONSTRAINT chk_producoes_quantidade CHECK (quantidade_kg > 0),
    ADD CONSTRAINT chk_producoes_turno      CHECK (turno IN ('Manhã', 'Tarde', 'Noite')),
    ADD CONSTRAINT chk_producoes_produto    CHECK (produto IN ('Café Torrado', 'Café Moído', 'Blend')),
    ADD CONSTRAINT chk_producoes_torra      CHECK (tipo_torra  IS NULL OR tipo_torra  IN ('Claro', 'Médio', 'Escuro')),
    ADD CONSTRAINT chk_producoes_moagem     CHECK (tipo_moagem IS NULL OR tipo_moagem IN ('Grossa', 'Média', 'Fina'));

CREATE INDEX idx_producoes_data          ON producoes (data);
CREATE INDEX idx_producoes_data_turno    ON producoes (data, turno);
CREATE INDEX idx_producoes_data_produto  ON producoes (data, produto);
CREATE INDEX idx_producoes_codigo_barras ON producoes (codigo_barras);
