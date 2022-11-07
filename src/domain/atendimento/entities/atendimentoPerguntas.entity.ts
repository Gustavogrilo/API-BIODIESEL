import { Column, JoinColumn, ManyToOne, OneToMany, ViewEntity } from 'typeorm';

import { CoreEntity } from 'src/core';
import { InsumoTipo } from 'src/domain/insumo-tipo/insumo-tipo.entity';
import { QueLista } from 'src/domain/que-lista/que-lista.entity';
import { QuePerguntaItemLista } from 'src/domain/que-pergunta-item-lista/que-pergunta-item-lista.entity';
import { QuePerguntaVariavel } from 'src/domain/que-pergunta-variavel/que-pergunta-variavel.entity';
import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';

@ViewEntity('atendimento_perguntas')
export class AtendimentoPerguntas extends CoreEntity {
  @Column()
  nome: string;

  @Column()
  tipo: string;

  @Column()
  expressao: string;

  @Column()
  validacao: string;

  @Column()
  mensagem_validacao: string;

  @Column()
  insumo_tipo_id: number;

  @Column()
  lista_id: number;

  @Column()
  pergunta_referencia_id: number;

  @Column()
  cliente_id: number;

  @Column()
  tema_id: number;

  @Column()
  questionario_id: number;

  @Column()
  possui_quantidade: boolean;

  @Column()
  imprimir: boolean;

  @Column()
  opcional: boolean;

  @Column()
  ref: string;

  @ManyToOne(type => InsumoTipo, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'insumo_tipo_id' })
  tipo_insumo: InsumoTipo;

  @ManyToOne('QuePergunta', { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'pergunta_referencia_id' })
  pergunta_referencia: QuePergunta;

  @ManyToOne(type => QueLista, { cascade: ['insert', 'update'] })
  @JoinColumn({ name: 'lista_id' })
  lista: QueLista;

  @OneToMany(
    type => QuePerguntaItemLista,
    quePerguntaItemLista => quePerguntaItemLista.pergunta,
    { cascade: ['insert', 'update'] },
  )
  itens_lista: QuePerguntaItemLista[];

  @OneToMany(
    type => QuePerguntaVariavel,
    quePerguntaVariavel => quePerguntaVariavel.pergunta,
    { cascade: ['insert'] },
  )
  variaveis: QuePerguntaVariavel[];
}
