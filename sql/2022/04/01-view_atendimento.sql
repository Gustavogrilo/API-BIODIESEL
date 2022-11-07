--Alterado a busca da data do atendimento que agora vem da resposta de uma perqunta

CREATE OR REPLACE
ALGORITHM = UNDEFINED VIEW `biodiesel`.`view_atendimento` AS with `perguntas` as (
select
    `q`.`safra_id` AS `safra_id`,
    `qsp`.`questionario_id` AS `questionario_id`,
    `qsp`.`tema_id` AS `tema_id`,
    count(distinct `qsp`.`pergunta_id`) AS `perguntas`,
    `q`.`nome` AS `questionario`,
    `qt`.`nome` AS `laudo`
from
    ((`biodiesel`.`que_subtema_pergunta` `qsp`
join `biodiesel`.`que_tema` `qt` on
    ((`qsp`.`tema_id` = `qt`.`id`)))
join `biodiesel`.`questionario` `q` on
    ((`qsp`.`questionario_id` = `q`.`id`)))
group by
    `q`.`safra_id`,
    `qsp`.`questionario_id`,
    `qsp`.`tema_id`),
`propriedades` as (
select
    distinct `p`.`id` AS `id`,
    `p`.`nome` AS `nome`,
    `p2`.`id` AS `produtor_id`,
    concat(`p2`.`nome`, ' ', `p2`.`sobrenome`) AS `produtor_nome`,
    `m`.`id` AS `municipio_id`,
    `m`.`estado_id` AS `estado_id`
from
    ((`biodiesel`.`propriedade` `p`
join `biodiesel`.`pessoa` `p2` on
    ((`p`.`produtor_id` = `p2`.`id`)))
left join `biodiesel`.`municipio` `m` on
    ((`p`.`municipio_id` = `m`.`id`)))
where
    `p`.`id` in (
    select
        distinct `biodiesel`.`que_diagnostico`.`propriedade_id`
    from
        `biodiesel`.`que_diagnostico`)),
`diagnosticos` as (
select
    `qd`.`id` AS `diagnostico_id`,
    `qd`.`consultor_id` AS `consultor_id`,
    concat(`p`.`nome`, ' ', `p`.`sobrenome`) AS `consultor`,
    `qd`.`propriedade_id` AS `propriedade_id`,
    `qd`.`questionario_id` AS `questionario_id`,
    `qr`.`tema_id` AS `tema_id`,
   STR_TO_DATE((
    select
        `qr2`.`resultado`
    from
        `biodiesel`.`que_resposta` `qr2`
    where
        ((`qr2`.`pergunta_id` = 98)
            and ((0 <> `qr2`.`ativo`) is true)
                and (`qr2`.`diagnostico_id` = `qd`.`id`)
                    and (`qr2`.`tema_id` = `qr`.`tema_id`))
    limit 1),'%d/%m/%Y') AS `data_atendimento`,
    count(distinct `qsp`.`pergunta_id`) AS `respostas`
from
    (((`biodiesel`.`que_diagnostico` `qd`
left join `biodiesel`.`pessoa` `p` on
    ((`p`.`id` = `qd`.`consultor_id`)))
left join `biodiesel`.`que_resposta` `qr` on
    (((`qd`.`id` = `qr`.`diagnostico_id`)
        and (0 <> `qr`.`pergunta_id`))))
join `biodiesel`.`que_subtema_pergunta` `qsp` on
    (((`qd`.`questionario_id` = `qsp`.`questionario_id`)
        and (`qr`.`tema_id` = `qsp`.`tema_id`)
            and (`qr`.`subtema_id` = `qsp`.`subtema_id`)
                and (`qr`.`pergunta_id` = `qsp`.`pergunta_id`))))
group by
    `qd`.`id`,
    `qd`.`questionario_id`,
    `qr`.`tema_id`)
select
    distinct cast(concat(cast(`d`.`diagnostico_id` as char(50) charset utf8mb4), cast(`p`.`tema_id` as char(50) charset utf8mb4)) as unsigned) AS `id`,
    `d`.`diagnostico_id` AS `diagnostico_id`,
    `p`.`safra_id` AS `safra_id`,
    `d`.`consultor_id` AS `consultor_id`,
    `d`.`consultor` AS `consultor`,
    `p`.`questionario_id` AS `questionario_id`,
    `p`.`tema_id` AS `tema_id`,
    `propriedades`.`id` AS `propriedade_id`,
    `propriedades`.`produtor_id` AS `produtor_id`,
    `propriedades`.`municipio_id` AS `municipio_id`,
    `propriedades`.`estado_id` AS `estado_id`,
    `p`.`questionario` AS `questionario`,
    `p`.`laudo` AS `laudo`,
    `propriedades`.`nome` AS `propriedade`,
    `propriedades`.`produtor_nome` AS `produtor`,
    `d`.`data_atendimento` AS `data_atendimento`,
    `p`.`perguntas` AS `perguntas`,
    `d`.`respostas` AS `respostas`,
    coalesce(`a`.`concluido`, 0) AS `concluido`
from
    (((`perguntas` `p`
join `diagnosticos` `d` on
    (((`p`.`questionario_id` = `d`.`questionario_id`)
        and (`p`.`tema_id` = `d`.`tema_id`))))
join `propriedades` on
    ((`d`.`propriedade_id` = `propriedades`.`id`)))
left join `biodiesel`.`atendimento` `a` on
    (((`a`.`diagnostico_id` = `d`.`diagnostico_id`)
        and (`a`.`tema_id` = `p`.`tema_id`))))
order by
    `d`.`diagnostico_id`,
    `p`.`questionario`,
    `p`.`laudo`;