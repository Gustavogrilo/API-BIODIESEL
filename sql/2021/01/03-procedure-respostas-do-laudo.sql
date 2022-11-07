DROP PROCEDURE IF EXISTS respostas_do_laudo;

CREATE PROCEDURE `biodiesel`.`respostas_do_laudo`(IN questionarioid int, IN temaid int)
BEGIN

    DECLARE sqlperguntas TEXT;
    DECLARE pergunta TEXT;

    DECLARE curperguntas
        CURSOR FOR
        SELECT CONCAT(CONCAT_WS('.', qt.item, qts.item, qsp.item), ' - ', qp.nome) pergunta
        FROM questionario q
                 JOIN questionario_tema qt ON q.id = qt.questionario_id
                 JOIN que_tema_subtema qts ON q.id = qts.questionario_id AND qt.tema_id = qts.tema_id
                 JOIN que_subtema_pergunta qsp
                      ON q.id = qsp.questionario_id AND qt.tema_id = qsp.tema_id AND qts.subtema_id = qsp.subtema_id
                 JOIN que_pergunta qp ON qsp.pergunta_id = qp.id
        WHERE q.id = questionarioid
          AND qt.tema_id = temaid
        GROUP BY qt.item, qts.item, qsp.item, qp.nome
        ORDER BY qt.item, qts.item, qsp.item;

    DECLARE currespostas
        CURSOR FOR
        SELECT CONCAT(CONCAT_WS('.', qt.item, qts.item, qsp.item), ' - ', qp.nome) pergunta
        FROM questionario q
                 JOIN questionario_tema qt ON q.id = qt.questionario_id
                 JOIN que_tema_subtema qts ON q.id = qts.questionario_id AND qt.tema_id = qts.tema_id
                 JOIN que_subtema_pergunta qsp
                      ON q.id = qsp.questionario_id AND qt.tema_id = qsp.tema_id AND qts.subtema_id = qsp.subtema_id
                 JOIN que_pergunta qp ON qsp.pergunta_id = qp.id
        WHERE q.id = questionarioid
          AND qt.tema_id = temaid
        GROUP BY qt.item, qts.item, qsp.item, qp.nome
        ORDER BY qt.item, qts.item, qsp.item;


    SET sqlperguntas =
            'CREATE TEMPORARY TABLE resposta_laudo (PROPRIEDADE VARCHAR(255) UNIQUE, ';

    DROP TEMPORARY TABLE IF EXISTS resposta_laudo;
    DROP TEMPORARY TABLE IF EXISTS propriedades_atendidas;

    OPEN curperguntas;
    BEGIN
        DECLARE exit_flag INT DEFAULT 0;
        DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET exit_flag = 1;

        getperguntas:
        LOOP
            FETCH curperguntas INTO pergunta;

            IF exit_flag THEN
                LEAVE getperguntas;
            END IF;

            SET sqlperguntas = CONCAT(sqlperguntas, ' `', pergunta, '`', ' TEXT,');

            SET sqlperguntas =
                    CONCAT(sqlperguntas, ' `', CONCAT(SUBSTRING_INDEX(pergunta, '-', 1), '- COMPLEMENTO'), '`',
                           ' TEXT,');


        END LOOP getperguntas;

        CLOSE curperguntas;

        SET sqlperguntas = CONCAT(sqlperguntas, 'FILIAL VARCHAR(255), CONSULTOR VARCHAR(255), CREA VARCHAR(30)');

        SET @stmtperguntas = CONCAT(sqlperguntas, ');');

        DROP TABLE IF EXISTS resposta_laudo;

        PREPARE stmt FROM @stmtperguntas;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END;


    OPEN currespostas;
    BEGIN
        DECLARE exit_flag INT DEFAULT 0;
        DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET exit_flag = 1;

        getperguntas:
        LOOP
            FETCH currespostas INTO pergunta;

            IF exit_flag THEN
                LEAVE getperguntas;
            END IF;

            SET @joinrespostas = 'JOIN ';

            IF TRIM(SUBSTRING_INDEX(pergunta, '-', -1)) IN ('LATITUDE', 'LONGITUDE', 'NOME DO PRODUTOR', 'DAP')
            THEN
                SET @joinrespostas = 'LEFT JOIN ';
            END IF;

            SET @sql = CONCAT(
                    'INSERT INTO resposta_laudo (consultor, crea, filial, propriedade,`', pergunta, '`, `',
                    CONCAT(SUBSTRING_INDEX(pergunta, '-', 1), '- COMPLEMENTO'), '`) ',
                    'SELECT consultor, crea, filial, propriedade, resposta, justificativa FROM ',
                    '(SELECT CONCAT(p.id, \' - \', p.nome) propriedade, ',
                    'CONCAT(consultor.nome, \' \', consultor.sobrenome) consultor, ',
                    'consultor.crea crea, ',
                    'f.nome filial, ',
                    'CASE WHEN \'', TRIM(SUBSTRING_INDEX(pergunta, '-', -1)),
                    '\' IN (\'LATITUDE\') AND qr.resultado IS NULL THEN p.latitude '
                        'WHEN \'', TRIM(SUBSTRING_INDEX(pergunta, '-', -1)),
                    '\' IN (\'LONGITUDE\') AND qr.resultado IS NULL THEN p.longitude '
                        'WHEN \'', TRIM(SUBSTRING_INDEX(pergunta, '-', -1)),
                    '\' IN (\'NOME DO PRODUTOR\') THEN CONCAT(produtor.nome, \' \', produtor.sobrenome) '
                        'WHEN \'', TRIM(SUBSTRING_INDEX(pergunta, '-', -1)),
                    '\' IN (\'DAP\') THEN MAX(dap.id) '
                        'ELSE qr.resultado END resposta, ',
                    'CASE ',
                    'WHEN GROUP_CONCAT(DISTINCT i.nome) <> \'\' THEN CONCAT(\'INSUMOS:\', GROUP_CONCAT(DISTINCT CONCAT(i.nome, \': \', qri.quantidade, \' \' ,i.unidade_medida) SEPARATOR \';\' )) ',
                    'WHEN GROUP_CONCAT(DISTINCT qil.nome) <> \'\' THEN GROUP_CONCAT(DISTINCT qil.nome) ',
                    'WHEN qr.quantidade IS NOT NULL THEN qr.quantidade ',
                    'WHEN qr.justificativa IS NOT NULL THEN qr.justificativa ',
                    'ELSE null END justificativa ',
                    'FROM questionario q ',
                    'JOIN questionario_tema qt ON q.id = qt.questionario_id ',
                    'JOIN que_tema_subtema qts ON q.id = qts.questionario_id AND qt.tema_id = qts.tema_id ',
                    'JOIN que_subtema_pergunta qsp ON q.id = qsp.questionario_id AND qt.tema_id = qsp.tema_id AND qts.subtema_id = qsp.subtema_id ',
                    'JOIN que_pergunta qp ON qsp.pergunta_id = qp.id ',
                    'JOIN que_diagnostico qd ON q.id = qd.questionario_id ',
                    'JOIN propriedade p ON qd.propriedade_id = p.id ',
                    @joinrespostas,
                    'que_resposta qr ON qd.id = qr.diagnostico_id AND qr.tema_id = qt.tema_id AND qr.pergunta_id = qsp.pergunta_id ',
                    'LEFT JOIN dap ON p.id = dap.propriedade_id ',
                    'JOIN pessoa produtor ON p.produtor_id = produtor.id ',
                    'JOIN pessoa consultor ON qd.consultor_id = consultor.id ',
                    'JOIN cliente_propriedade cp ON q.cliente_id = cp.cliente_id AND p.id = cp.propriedade_id ',
                    'LEFT JOIN filial f ON cp.filial_id = f.id ',
                    'LEFT JOIN que_resposta_insumo qri ON qr.id = qri.resposta_id ',
                    'LEFT JOIN insumo i ON qri.insumo_id = i.id ',
                    'LEFT JOIN que_resposta_item_lista qril ON qr.id = qril.que_resposta_id ',
                    'LEFT JOIN que_item_lista qil ON qril.que_item_lista_id = qil.id ',
                    'WHERE p.ativo IS TRUE AND CONCAT(CONCAT_WS(\'.\', qt.item, qts.item, qsp.item), \' - \', qp.nome) = \'',
                    pergunta,
                    '\' ',
                    'AND (',
                    'SELECT COUNT(DISTINCT propriedade_id) FROM que_resposta qr ',
                    'JOIN que_diagnostico qd ON qr.diagnostico_id = qd.id ',
                    'WHERE qr.tema_id = qt.tema_id AND qd.questionario_id = q.id AND qd.propriedade_id = p.id) > 0 ',
                    'GROUP BY qd.consultor_id, qd.propriedade_id, qr.resultado, qr.quantidade, qr.justificativa, qp.nome, f.nome, produtor.nome ',
                    'ORDER BY qd.propriedade_id) resultado ',
                    'ON DUPLICATE KEY UPDATE `', pergunta, '`=resposta, `', CONCAT(SUBSTRING_INDEX(pergunta, '-', 1),
                                                                                   '- COMPLEMENTO`=justificativa ')
                );


            PREPARE stmt FROM @sql;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;

        END LOOP getperguntas;
    END;
    CLOSE currespostas;

    SELECT * FROM resposta_laudo ORDER BY consultor, filial, propriedade;

    DROP TEMPORARY TABLE IF EXISTS resposta_laudo;
    DROP TEMPORARY TABLE IF EXISTS propriedades_atendidas;

END;
