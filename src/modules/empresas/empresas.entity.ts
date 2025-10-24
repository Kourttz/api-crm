import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { EmpresaContato } from '../empresa_contato/empresa_contato.entity'; 

@Entity({ name: 'tb_empresas' })
export class Empresas {
  @PrimaryGeneratedColumn({ name: 'co_empresa', type: 'int' })
  coEmpresa: number;

  @Column({ name: 'no_empresa', type: 'varchar', length: 255 })
  noEmpresa: string;

  @Column({ name: 'co_cnpj', type: 'varchar', length: 14 })
  coCnpj: string;

  // Colunas de Endereço (Inferidas do DTO)
  @Column({ name: 'co_cep', type: 'varchar', length: 8 })
  coCep: string;

  @Column({ name: 'no_estado', type: 'varchar', length: 50 })
  noEstado: string;

  @Column({ name: 'no_cidade', type: 'varchar', length: 100 })
  noCidade: string;

  @Column({ name: 'no_bairro', type: 'varchar', length: 100 })
  noBairro: string;

  @Column({ name: 'no_endereco', type: 'varchar', length: 255 })
  noEndereco: string;

  @Column({ name: 'no_numero', type: 'varchar', length: 20 })
  noNumero: string;
  
  @Column({ name: 'no_complemento', type: 'varchar', length: 100, nullable: true })
  noComplemento?: string;

  @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
  dtRegistro: Date;
  
  // Relações
  @OneToMany(() => EmpresaContato, empresaContato => empresaContato.empresa)
  empresaContatos: EmpresaContato[];
}