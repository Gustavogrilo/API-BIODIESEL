BEGIN;

-- Adiciona 'Cultivares' em que_resposta_insumo
INSERT IGNORE INTO que_resposta_insumo
SELECT qr.id resposta_id, i.id insumo_id, 1 AS quantidade
FROM que_resposta qr
         JOIN que_diagnostico qd ON qr.diagnostico_id = qd.id
         JOIN insumo i ON qr.resultado = i.nome
WHERE qr.tema_id = 1
  AND qr.pergunta_id = 72;

-- Corrige campo 'quantidade' de respostas de 'Estimativa de produção'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 74
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'Densidade das plantas'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 114
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'ÁREA CONTRATADA'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 91
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'QUAL ALTURA MEDIA DAS PLANTAS (m)'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 108
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'ESPAÇAMENTO ENTRE AS LINHAS (cm)'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 88
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'PLANTAS POR METRO LINEAR'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 139
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'PREVISÃO DE RENDIMENTO (sc/ha)'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 12
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'GRÃOS POR PLANTA'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 136
  AND qr.quantidade IS NULL;

-- Corrige campo 'quantidade' de respostas de 'PESO DE 100 GRÃOS (gramas)'
UPDATE IGNORE que_resposta qr
SET qr.quantidade = CAST(REPLACE(qr.resultado, ',', '.') AS DECIMAL(10, 2))
WHERE qr.pergunta_id = 66
  AND qr.quantidade IS NULL;

-- Insere em 'que_item_lista' entidades que nao foram importadas do firebase
INSERT INTO que_item_lista (nome, valor, cliente_id, criado_em, ref)
VALUES ('CRONNOS', 'CRONNOS', 1, '2020-11-27 01:10:58', 'NGYHlk8RRtKyu6nYzeBD'),
       ('Buva (conyza Bonariensis)', 'Buva (conyza Bonariensis)', 1, '2020-11-06 12:29:55',
        'NnBcVU2ixPadCCbhhupC'),
       ('CAPIM-BRAQUIÁRIA', 'CAPIM-BRAQUIÁRIA', 1, '2020-11-06 12:30:09', 'erMyPDdDAZ7F3EMoeNPg'),
       ('jandira', 'jandira', 1, '2020-11-16 13:46:05', 'k1esPJoBVBnGWx29BJhN');

-- Insere em 'insumo' entidades que nao foram importadas do firebase
INSERT INTO insumo (nome, unidade_medida, tipo_id, ref)
VALUES ('PODIUM', 'LT', 3, 'S7DwRi68VXwjy3YP2xbG');

-- Corrige respostas 'LAVOURA APRESENTA PLANTAS DANINHAS?', criando relacionamento com 'que_item_lista'
INSERT IGNORE INTO que_resposta_item_lista (que_resposta_id, que_item_lista_id)
SELECT qr.id que_resposta_id, qil.id que_item_lista_id
FROM que_resposta qr
         LEFT JOIN que_item_lista qil ON qil.ref = SUBSTRING_INDEX(SUBSTRING_INDEX(justificativa, '"', 4), '"', -1)
WHERE qr.pergunta_id = 73
  AND resultado = 'sim'
  AND justificativa <> '';

UPDATE que_resposta
SET justificativa = NULL
WHERE pergunta_id = 73
  AND resultado = 'sim'
  AND justificativa <> '';


INSERT IGNORE INTO que_resposta_insumo
SELECT qr.id                                                                    resposta_id,
       i.id                                                                     insumo_id,
       SUBSTRING_INDEX(SUBSTRING_INDEX(qr.justificativa, '"', 16), '"', -1) + 0 quantidade
FROM que_resposta qr
         JOIN insumo i ON i.ref = SUBSTRING_INDEX(SUBSTRING_INDEX(qr.justificativa, '"', 4), '"', -1)
WHERE LEFT(qr.justificativa, 1) = '['

INSERT IGNORE INTO que_resposta_item_lista (que_resposta_id, que_item_lista_id)
SELECT qr.id, qil.id
FROM que_resposta qr
         LEFT JOIN que_item_lista qil ON qil.ref = SUBSTRING_INDEX(SUBSTRING_INDEX(qr.justificativa, '"', 4), '"', -1)
WHERE LEFT(qr.justificativa, 1) = '{';

-- Desativa respostas duplicadas que nao tenham subtema_id
UPDATE que_resposta qr
SET ativo = 0
WHERE id IN (
    WITH
         respostas_sem_subtema AS (
             SELECT *
             FROM que_resposta qr
             WHERE diagnostico_id IS NOT NULL
               AND tema_id        IS NOT NULL
               AND subtema_id     IS NULL
         ),
         respostas_com_subtema AS (
             SELECT *
             FROM que_resposta qr
             WHERE diagnostico_id IS NOT NULL
               AND tema_id        IS NOT NULL
               AND subtema_id     IS NOT NULL
         )
    SELECT respostas_sem_subtema.id
    FROM respostas_sem_subtema
             JOIN respostas_com_subtema ON
                respostas_com_subtema.diagnostico_id = respostas_sem_subtema.diagnostico_id AND
                respostas_com_subtema.tema_id        = respostas_sem_subtema.tema_id AND
                respostas_com_subtema.pergunta_id    = respostas_sem_subtema.pergunta_id
);

COMMIT;
