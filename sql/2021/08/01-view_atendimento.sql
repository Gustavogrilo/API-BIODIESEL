CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `view_atendimento` AS 
WITH perguntas AS (
    SELECT q.safra_id,
           qsp.questionario_id,
           qsp.tema_id,
           COUNT(DISTINCT qsp.pergunta_id) AS perguntas,
           q.nome                          AS questionario,
           qt.nome                         AS laudo
    FROM que_subtema_pergunta qsp
             JOIN que_tema qt ON qsp.tema_id = qt.id
             JOIN questionario q ON qsp.questionario_id = q.id
    GROUP BY q.safra_id, qsp.questionario_id, qsp.tema_id
),
     propriedades AS (
         SELECT DISTINCT p.id,
                         p.nome,
                         p2.id                             AS produtor_id,
                         CONCAT(p.nome, ' ', p2.sobrenome) AS produtor_nome,
                         m.id                              AS municipio_id,
                         m.estado_id                       AS estado_id
         FROM propriedade p
                  JOIN pessoa p2 ON p.produtor_id = p2.id
                  LEFT JOIN municipio m ON p.municipio_id = m.id
         WHERE p.id IN (SELECT DISTINCT propriedade_id FROM que_diagnostico)
     ),
     diagnosticos AS (
         SELECT 
         		qd.id                           AS diagnostico_id,
                qd.consultor_id,
                CONCAT(p.nome, ' ', p.sobrenome) as consultor, 
                qd.propriedade_id,
                qd.questionario_id,
                qr.tema_id,
                qd.data_atendimento,
                COUNT(DISTINCT qsp.pergunta_id) AS respostas
         FROM que_diagnostico qd
         		LEFT JOIN pessoa p on p.id = qd.consultor_id 
                LEFT JOIN que_resposta qr ON qd.id = qr.diagnostico_id AND qr.pergunta_id
                JOIN que_subtema_pergunta qsp ON qd.questionario_id = qsp.questionario_id
             AND qr.tema_id = qsp.tema_id AND qr.subtema_id = qsp.subtema_id AND qr.pergunta_id = qsp.pergunta_id
         GROUP BY qd.id, qd.questionario_id, qr.tema_id
     )
SELECT DISTINCT 
				cast(concat(CAST(d.diagnostico_id as char(50)) , CAST(p.tema_id as char(50))) as UNSIGNED) as id,
				d.diagnostico_id,
                p.safra_id,
                d.consultor_id,
                d.consultor,
                p.questionario_id,
                p.tema_id,
                propriedades.id            AS propriedade_id,
                propriedades.produtor_id,
                propriedades.municipio_id,
                propriedades.estado_id,
                p.questionario,
                p.laudo,
                propriedades.nome          AS propriedade,
                propriedades.produtor_nome AS produtor,
                d.data_atendimento,
                p.perguntas,
                d.respostas,
                COALESCE (a.concluido, 0) as concluido
FROM perguntas p
         JOIN diagnosticos d ON p.questionario_id = d.questionario_id AND p.tema_id = d.tema_id
         JOIN propriedades ON d.propriedade_id = propriedades.id
         LEFT JOIN atendimento a on a.diagnostico_id = d.diagnostico_id and a.tema_id = p.tema_id
ORDER BY diagnostico_id, p.questionario, p.laudo;
