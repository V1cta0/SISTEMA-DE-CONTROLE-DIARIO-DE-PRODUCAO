USE cical;

DELETE FROM producoes WHERE observacoes = 'DADOS DE TESTE';

INSERT IGNORE INTO usuarios (nome, email, senha_hash, tipo_usuario) VALUES
    ('Operador Teste 1', 'operador1@teste.cical', '$2a$10$SENHA.FALSA.APENAS.PARA.TESTE.DE.DADOS.000000000000', 'operador'),
    ('Operador Teste 2', 'operador2@teste.cical', '$2a$10$SENHA.FALSA.APENAS.PARA.TESTE.DE.DADOS.000000000000', 'operador');

INSERT INTO producoes
    (data, turno, produto, tipo_torra, tipo_moagem, quantidade_kg, observacoes, usuario_id)
WITH RECURSIVE dias AS (
    SELECT 0 AS n
    UNION ALL
    SELECT n + 1 FROM dias WHERE n < 89
),
turnos AS (
    SELECT 'Manhã' AS nome, 1 AS i
    UNION ALL SELECT 'Tarde', 2
    UNION ALL SELECT 'Noite', 3
),
produtos AS (
    SELECT 'Café Torrado' AS nome, 1 AS j
    UNION ALL SELECT 'Café Moído', 2
    UNION ALL SELECT 'Blend', 3
)
SELECT
    DATE_SUB(CURDATE(), INTERVAL d.n DAY)                                        AS data,
    t.nome                                                                       AS turno,
    p.nome                                                                       AS produto,
    ELT(1 + MOD(d.n + t.i + p.j, 3), 'Claro', 'Médio', 'Escuro')                 AS tipo_torra,
    CASE WHEN p.nome IN ('Café Moído', 'Blend')
         THEN ELT(1 + MOD(d.n * 2 + t.i + p.j, 3), 'Grossa', 'Média', 'Fina')
         ELSE NULL END                                                           AS tipo_moagem,
    ROUND(60 + MOD(d.n * 17 + t.i * 31 + p.j * 13, 140) + (4 - t.i) * 5, 2)      AS quantidade_kg,
    'DADOS DE TESTE'                                                             AS observacoes,
    (SELECT id FROM usuarios
      WHERE email = CASE MOD(d.n, 2) WHEN 0 THEN 'operador1@teste.cical'
                                      ELSE 'operador2@teste.cical' END)          AS usuario_id
FROM dias d
CROSS JOIN turnos t
CROSS JOIN produtos p
WHERE DAYOFWEEK(DATE_SUB(CURDATE(), INTERVAL d.n DAY)) <> 1
  AND NOT (t.i = 3 AND MOD(d.n, 2) = 0);

SELECT COUNT(*) AS registros_de_teste, MIN(data) AS primeiro_dia, MAX(data) AS ultimo_dia
FROM producoes WHERE observacoes = 'DADOS DE TESTE';
