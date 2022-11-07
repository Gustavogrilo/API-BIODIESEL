import { Logger } from '@nestjs/common';

import {
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CoreEntity } from 'src/core';
import { QueDiagnostico } from 'src/domain/que-diagnostico/que-diagnostico.entity';
import { QuePergunta } from 'src/domain/que-pergunta/que-pergunta.entity';
import { QueItemLista } from 'src/domain/que-item-lista/que-item-lista.entity';
import { QueRespostaInsumo } from 'src/domain/que-resposta-insumo/que-resposta-insumo.entity';
import { Anexo } from '../anexo/anexo.entity';

@Entity()
export class QueResposta extends CoreEntity {
  @Column()
  resultado: string;

  @Column()
  justificativa: string;

  @Column()
  qual: string;

  @Column()
  unidade_medida: string;

  @Column()
  quantidade: number;

  @Column()
  pergunta_id: number;

  @Column()
  tema_id: number;

  @Column()
  subtema_id: number;

  @Column()
  diagnostico_id: number;

  @Column()
  ref: string;

  @ManyToOne(type => QueDiagnostico)
  @JoinColumn({ name: 'diagnostico_id' })
  diagnostico: QueDiagnostico;

  @ManyToOne(type => QuePergunta)
  @JoinColumn({ name: 'pergunta_id' })
  pergunta: QuePergunta;

  @ManyToMany(() => QueItemLista)
  @JoinTable({
    name: 'que_resposta_item_lista',
    joinColumns: [{ name: 'que_resposta_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [
      { name: 'que_item_lista_id', referencedColumnName: 'id' },
    ],
  })
  itensDeLista?: QueItemLista[];

  @OneToMany(
    () => QueRespostaInsumo,
    queRespostaInsumo => queRespostaInsumo.resposta,
    {
      cascade: true,
    },
  )
  insumos: QueRespostaInsumo[];

  @ManyToMany(() => Anexo, {
    cascade: ['insert', 'update', 'remove', 'soft-remove'],
  })
  @JoinTable({
    name: 'que_resposta_anexo',
    joinColumns: [{ name: 'resposta_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'anexo_id', referencedColumnName: 'id' }],
  })
  anexos?: Anexo[];

  @BeforeInsert()
  converterAnexosBase64() {
    if (this.anexos) {
      for (const anexo of this.anexos) {
        try {
          const buffer = Buffer.from(anexo.arquivo, 'base64');

          anexo.arquivo = buffer;
          anexo.tamanho = ((buffer.byteLength / 1024) ^ 2) / 1000;
        } catch (e) {
          new Logger('QueResposta').error(e);
        }
      }
    }
  }

  @BeforeUpdate()
  converterAnexosBase64Update() {
    if (this.anexos) {
      for (const anexo of this.anexos) {
        try {
          const buffer = Buffer.from(anexo.arquivo, 'base64');

          anexo.arquivo = buffer;
          anexo.tamanho = ((buffer.byteLength / 1024) ^ 2) / 1000;
        } catch (e) {
          new Logger('QueResposta').error(e);
        }
      }
    }
  }

  @AfterInsert()
  removerAnexos() {
    if (this.anexos) {
      delete this.anexos;
    }
  }

  @AfterUpdate()
  removerAnexosUpdate() {
    if (this.anexos) {
      delete this.anexos;
    }
  }
}
