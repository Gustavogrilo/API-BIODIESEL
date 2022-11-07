BEGIN;

CREATE INDEX pessoa_ativo_IDX ON
biodiesel.pessoa (ativo);

CREATE INDEX pessoa_ativo_consultor_IDX ON
biodiesel.pessoa (ativo,
consultor);

CREATE INDEX pessoa_ativo_produtor_IDX ON
biodiesel.pessoa (ativo,
produtor);

CREATE INDEX propriedade_ativo_IDX ON
biodiesel.propriedade (ativo);

CREATE INDEX propriedade_ativo_id_IDX ON
biodiesel.propriedade (ativo,
id);

CREATE INDEX propriedade_ativo_produtor_id_IDX ON
biodiesel.propriedade (ativo,
produtor_id);

CREATE INDEX propriedade_ativo_municipio_id_IDX ON
biodiesel.propriedade (ativo,
municipio_id);

CREATE INDEX perfil_resposta_resultado_qualitativo_IDX ON
biodiesel.perfil_resposta (resultado_qualitativo,
propriedade_id,
cliente_id);

CREATE INDEX perfil_resposta_perfil_subtema_id_IDX ON
biodiesel.perfil_resposta (perfil_subtema_id,
propriedade_id,
cliente_id);

COMMIT;
