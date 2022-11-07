CREATE TABLE biodiesel.atendimento (
	id BIGINT auto_increment NOT NULL,
	diagnostico_id BIGINT NOT NULL,
	tema_id BIGINT NOT NULL,
	concluido BOOL DEFAULT FALSE NOT NULL,
	CONSTRAINT atendimento_FK FOREIGN KEY (diagnostico_id) REFERENCES biodiesel.que_diagnostico(id),
	CONSTRAINT atendimento_FK_1 FOREIGN KEY (tema_id) REFERENCES biodiesel.que_tema(id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;