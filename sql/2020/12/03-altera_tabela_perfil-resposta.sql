-- Adiciona id na perfil_resposta
ALTER TABLE `biodiesel`.`perfil_resposta`
    MODIFY COLUMN `id` INT UNSIGNED NOT NULL AUTO_INCREMENT;

-- Corrige fk com perfil_item
ALTER TABLE perfil_resposta DROP FOREIGN KEY fk_perfil_resposta1;

ALTER TABLE perfil_resposta
    ADD CONSTRAINT fk_perfil_resposta1
        FOREIGN KEY (resultado_qualitativo) REFERENCES perfil_item (id);
