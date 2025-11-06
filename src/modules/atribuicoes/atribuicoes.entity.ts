import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Leads } from '../leads/leads.entity';
import { TipoAtribuicao } from '../tipo_atribuicao/tipo_atribuicao.entity';

@Entity({ name: 'tb_atribuicoes' })
export class Atribuicoes {
  @PrimaryGeneratedColumn({ name: 'co_atribuicao', type: 'int' })
  coAtribuicao: number;

  @Column({ name: 'co_lead', type: 'int' })
  coLead: number;

  @Column({ name: 'co_atribuido', type: 'int' })
  coAtribuido: number;

  @Column({ name: 'co_tipo_atribuicao', type: 'int' })
  coTipoAtribuicao: number;

  @CreateDateColumn({
    name: 'dt_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dtRegistro: Date;

  // RELACIONAMENTOS

  @ManyToOne(() => Leads, (lead) => lead.atribuicoes)
  @JoinColumn({ name: 'co_lead' })
  lead: Leads;

  @ManyToOne(() => TipoAtribuicao, (tipo) => tipo.atribuicoes)
  @JoinColumn({ name: 'co_tipo_atribuicao' })
  tipoAtribuicao: TipoAtribuicao;
}
