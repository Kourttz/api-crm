import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { GrupoUsuario } from '../grupo_usuario/grupo_usuario.entity';

@Entity({ name: 'gestao.tb_usuarios' })
export class Usuarios {
  @PrimaryColumn({
    name: 'co_usuario',
    type: 'int',
    generated: true 
  })
  coUsuario: number;

  @Column({
    name: 'no_name',
    type: 'varchar',
    length: 255,
    nullable: false
  })
  noName: string;

  @Column({
    name: 'co_matricula',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true 
  })
  coMatricula: string;

  @Column({
    name: 'no_email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true 
  })
  noEmail: string;

  @Column({
    name: 'ic_situacao_ativo',
    type: 'bit',
    default: true 
  })
  icSituacaoAtivo: boolean;

  @Column({
    name: 'nu_filial',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true 
  })
  nuFilial: number | null;

  @Column({
    name: 'co_perfil',
    type: 'int',
    nullable: false
  })
  coPerfil: number;

  @OneToMany(() => Usuarios, usuario => usuario.leadsCreated)
  @JoinColumn({ name: 'co_usuario' })
  leadsCreated: Usuarios;

  @OneToMany(() => Usuarios, usuario => usuario.leadsEdited)
  @JoinColumn({ name: 'co_usuario' })
  leadsEdited: Usuarios;

  @OneToMany(() => GrupoUsuario, (gu) => gu.coUsuario)
  GruposUsuarios: GrupoUsuario[];

}