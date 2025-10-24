import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { GrupoUsuario } from '../grupo_usuario/grupo_usuario.entity';
import { Usuarios } from '../usuarios/usuarios.entity'; 

@Entity({ name: 'gestao.tb_grupos' })
export class Grupos {
  @PrimaryGeneratedColumn({ 
    name: 'co_grupo',
    type: 'int' 
  })
  coGrupo: number;

  @Column({ 
    name: 'no_grupo',
    type: 'varchar', 
    length: 255 
  })
  noGrupo: string;

  @Column({ 
    name: 'co_usuario_dono',
    type: 'int',
  })
  coUsuarioDono: number; 
  
  @ManyToOne(() => Usuarios)
  @JoinColumn({ name: 'co_usuario_dono', referencedColumnName: 'coUsuario' })
  coDono: Usuarios; 
  
  @Column({ 
    name: 'co_grupo_pai', 
    type: 'int', 
    nullable: true 
  })
  coGrupoPai: number | null;

  @Column({ 
    name: 'ic_situacao_ativo', 
    type: 'boolean',
    default: true 
  })
  icSituacaoAtivo: boolean;

  @OneToMany(() => GrupoUsuario, (gu) => gu.coGrupo)
  GruposUsuarios: GrupoUsuario[];
}