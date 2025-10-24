import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Grupos } from '../grupos/grupos.entity';
import { Usuarios } from '../usuarios/usuarios.entity';

@Entity({ name: 'gestao.tb_grupo_usuario' })
export class GrupoUsuario {
    @PrimaryColumn({
        name: 'co_grupo_usuario',
        type: 'int',
        generated: true
    })
    coGrupoUsuario: number;

    @ManyToOne(() => Grupos, (grupo) => grupo.GruposUsuarios)
    @JoinColumn({ name: 'co_grupo' })
    coGrupo: Grupos;

    @ManyToOne(() => Usuarios, (usuario) => usuario.coUsuario)
    @JoinColumn({ name: 'co_usuario' })
    coUsuario: Usuarios;
}