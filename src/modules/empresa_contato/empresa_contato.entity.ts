import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { Contatos } from '../contatos/contatos.entity'; 
import { Empresas } from '../empresas/empresas.entity';
import { Leads } from '../leads/leads.entity'; 

@Entity({ name: 'tb_empresa_contato' })
export class EmpresaContato {
  @PrimaryGeneratedColumn({ name: 'co_empresa_contato', type: 'int' })
  coEmpresaContato: number;

  @Column({ name: 'co_empresa', type: 'int' })
  coEmpresa: number;

  @Column({ name: 'co_contato', type: 'int' })
  coContato: number;

  @Column({ name: 'co_lead', type: 'int' })
  coLead: number;

  @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
  dtRegistro: Date;

  // Relações ManyToOne
  @ManyToOne(() => Empresas, empresa => empresa.empresaContatos)
  @JoinColumn({ name: 'co_empresa' })
  empresa: Empresas;

  @ManyToOne(() => Contatos, contato => contato.empresaContatos)
  @JoinColumn({ name: 'co_contato' })
  contato: Contatos;

  @ManyToOne(() => Leads, lead => lead.empresaContatos) 
  @JoinColumn({ name: 'co_lead' })
  lead: Leads;
}