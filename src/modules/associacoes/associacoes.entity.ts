import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tb_associacoes' })
export class Associacoes {
  @PrimaryGeneratedColumn({ name: 'co_associacao', type: 'int' })
  coAssociacao: number;

  @Column({ name: 'co_usuario', type: 'int' })
  coUsuario: number;

  @Column({ name: 'co_atribuido', type: 'int' })
  coAtribuido: number;

  @CreateDateColumn({
    name: 'dt_registro',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dtRegistro: Date;
}
