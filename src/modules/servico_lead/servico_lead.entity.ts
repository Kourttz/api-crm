import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Leads } from '../leads/leads.entity'; 
import { Servicos } from '../servicos/servicos.entity'; 

@Entity({ name: 'tb_servico_lead' })
export class ServicoLead {
  @PrimaryGeneratedColumn({ name: 'co_servico_lead', type: 'int' })
  coServicoLead: number;

  @Column({ name: 'co_servico', type: 'int' })
  coServico: number;

  @Column({ name: 'co_lead', type: 'int' })
  coLead: number;

  @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
  dtRegistro: Date;
  
  // Relações ManyToOne
  @ManyToOne(() => Servicos, servico => servico.servicoLeads)
  @JoinColumn({ name: 'co_servico' })
  servico: Servicos;

  @ManyToOne(() => Leads, lead => lead.servicoLeads)
  @JoinColumn({ name: 'co_lead' })
  lead: Leads;
}