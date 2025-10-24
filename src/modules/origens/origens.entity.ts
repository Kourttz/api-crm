import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Leads } from '../leads/leads.entity'; 

@Entity({ name: 'tb_origens' })
export class Origens {
  @PrimaryGeneratedColumn({ name: 'co_origem', type: 'int' })
  coOrigem: number;

  @Column({ name: 'no_origem', type: 'varchar', length: 255 })
  noOrigem: string;

  @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
  dtRegistro: Date;

  @Column({ name: 'ic_situacao_ativo', type: 'boolean', default: true })
  icSituacaoAtivo: boolean;
  
  @OneToMany(() => Leads, lead => lead.origem)
  leads: Leads[];
}