import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Leads } from '../leads/leads.entity'; 
import { EmpresaContato } from '../empresa_contato/empresa_contato.entity'; 

@Entity({ name: 'tb_contatos' })
export class Contatos {
  @PrimaryGeneratedColumn({ name: 'co_contato', type: 'int' })
  coContato: number;

  @Column({ name: 'no_name', type: 'varchar', length: 255 })
  noName: string;

  @Column({ name: 'no_cargo', type: 'varchar', length: 100, nullable: true })
  noCargo?: string;

  @Column({ name: 'no_email', type: 'varchar', length: 255, nullable: true })
  noEmail?: string;

  @Column({ name: 'no_telefone', type: 'varchar', length: 20, nullable: true })
  noTelefone?: string;

  @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
  dtRegistro: Date;

  // Relações
  @OneToMany(() => Leads, lead => lead.contato)
  leads: Leads[];

  @OneToMany(() => EmpresaContato, empresaContato => empresaContato.contato)
  empresaContatos: EmpresaContato[];
}