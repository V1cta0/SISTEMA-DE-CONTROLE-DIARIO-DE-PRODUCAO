USE cical;

CREATE OR REPLACE VIEW vw_producao_diaria AS
SELECT
    data,
    COUNT(*)           AS registros,
    SUM(quantidade_kg) AS total_kg
FROM producoes
GROUP BY data;

CREATE OR REPLACE VIEW vw_producao_por_turno AS
SELECT
    data,
    turno,
    COUNT(*)           AS registros,
    SUM(quantidade_kg) AS total_kg
FROM producoes
GROUP BY data, turno;

CREATE OR REPLACE VIEW vw_producao_por_produto AS
SELECT
    data,
    produto,
    COUNT(*)           AS registros,
    SUM(quantidade_kg) AS total_kg,
    AVG(quantidade_kg) AS media_kg
FROM producoes
GROUP BY data, produto;

CREATE OR REPLACE VIEW vw_producao_semanal AS
SELECT
    YEARWEEK(data, 3)                    AS ano_semana,
    MIN(data)                            AS inicio_semana,
    produto,
    SUM(quantidade_kg)                   AS total_kg
FROM producoes
GROUP BY YEARWEEK(data, 3), produto;

CREATE OR REPLACE VIEW vw_producao_mensal AS
SELECT
    DATE_FORMAT(data, '%Y-%m')  AS mes,
    produto,
    COUNT(*)                    AS registros,
    SUM(quantidade_kg)          AS total_kg
FROM producoes
GROUP BY DATE_FORMAT(data, '%Y-%m'), produto;

CREATE OR REPLACE VIEW vw_producao_por_torra_moagem AS
SELECT
    produto,
    COALESCE(tipo_torra,  'Não se aplica') AS tipo_torra,
    COALESCE(tipo_moagem, 'Não se aplica') AS tipo_moagem,
    SUM(quantidade_kg)                      AS total_kg
FROM producoes
GROUP BY produto, tipo_torra, tipo_moagem;

CREATE OR REPLACE VIEW vw_historico_completo AS
SELECT
    p.id,
    p.data,
    p.turno,
    p.produto,
    p.tipo_torra,
    p.tipo_moagem,
    p.quantidade_kg,
    p.codigo_barras,
    p.observacoes,
    u.nome       AS operador,
    p.criado_em,
    p.atualizado_em
FROM producoes p
JOIN usuarios u ON u.id = p.usuario_id;
