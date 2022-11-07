CREATE OR REPLACE VIEW public.atendimento_perguntas
AS select 
	qp.*,
	qt.tema_id as tema_id,
	qt.questionario_id as questionario_id
from questionario_tema qt 
inner join questionario q on qt.questionario_id = q.id 
inner join que_tema qt2 on qt.tema_id = qt2.id 
inner join que_subtema_pergunta qsp on qsp.questionario_id = qt.questionario_id and qsp.tema_id = qt2.id 
inner join que_pergunta qp on qsp.pergunta_id = qp.id;
