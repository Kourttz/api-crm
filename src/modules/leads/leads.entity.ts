import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  ManyToOne, 
  JoinColumn, 
  OneToMany 
} from 'typeorm';
import { Contatos } from '../contatos/contatos.entity'; 
import { Origens } from '../origens/origens.entity'; 
import { ServicoLead } from '../servico_lead/servico_lead.entity'; 

@Entity({ name: 'tb_leads' })
export class Leads {
  @PrimaryGeneratedColumn({ name: 'co_lead', type: 'int' })
  coLead: number;

  // Chaves Estrangeiras
  @Column({ name: 'co_contato', type: 'int' })
  coContato: number;

  @Column({ name: 'co_origem', type: 'int' })
  coOrigem: number;

  // Campos de Dados
  @Column({ name: 'dt_captacao', type: 'date', nullable: true })
  dtCaptacao?: Date;

  @Column({ name: 'no_observacao', type: 'varchar', length: 500, nullable: true })
  noObservacao?: string;

  // Colunas de Auditoria
  @Column({ name: 'co_usuario_create', type: 'int' })
  coUsuarioCreate: number;

  @CreateDateColumn({ name: 'dt_create', type: 'date', default: () => 'CURRENT_DATE' })
  dtCreate: Date;

  @Column({ name: 'co_usuario_edit', type: 'int', nullable: true })
  coUsuarioEdit?: number;

  @UpdateDateColumn({ name: 'dt_edit', type: 'date', nullable: true })
  dtEdit?: Date;
  
  // RELACIONAMENTOS (JOINs)

  // Contato (ManyToOne)
  @ManyToOne(() => Contatos, contato => contato.leads)
  @JoinColumn({ name: 'co_contato' })
  contato: Contatos;
  
  // Origem (ManyToOne)
  @ManyToOne(() => Origens, origem => origem.leads)
  @JoinColumn({ name: 'co_origem' })
  origem: Origens;

  // Servicos (OneToMany através da tabela de junção)
  @OneToMany(() => ServicoLead, servicoLead => servicoLead.lead)
  servicoLeads: ServicoLead[];
}