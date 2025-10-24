import { 
    Injectable, 
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GrupoUsuario } from './grupo_usuario.entity';
import { Grupos } from '../grupos/grupos.entity';

@Injectable()
export class GrupoUsuarioService {
    constructor(
        @InjectRepository(GrupoUsuario)
        private readonly GrupoUsuarioRepository: Repository<GrupoUsuario>,
        @InjectRepository(Grupos)
        private readonly GruposRepository: Repository<Grupos>,
        private dataSource: DataSource,
    ) {}

    /**
     * Lista todos os grupos com seus respectivos usuários participantes,
     * incluindo o nome e a matrícula do dono do grupo.
     */
    async listarTodosGruposComUsuarios(): Promise<any> { 
        
        const gruposComUsuarios = await this.GruposRepository.find({ 
            // Inclui o relacionamento do dono ('coDono') e dos participantes
            relations: [
                'coDono', 
                'GruposUsuarios', 
                'GruposUsuarios.coUsuario'
            ], 
            select: {
                coGrupo: true,
                noGrupo: true,
                /* Seleciona apenas os campos necessários do dono do grupo */ 
                coDono: {
                    coUsuario: true,
                    noName: true,
                    coMatricula: true,
                },
                /* Seleciona apenas os campos necessários dos usuários participantes */
                GruposUsuarios: {
                    coUsuario: {
                        coUsuario: true,
                        noName: true,
                        coMatricula: true,
                    },
                },
            },
        });
        
        const conditions = gruposComUsuarios.filter(grupo => grupo.GruposUsuarios.length > 0);

        /* Verifica se há grupos com usuários */
        if (conditions.length === 0) {
            throw new HttpException(
                'Nenhum grupo com usuários encontrado.',
                HttpStatus.NOT_FOUND,
            );
            
        }
        
        return gruposComUsuarios.map(grupo => ({
            coGrupo: grupo.coGrupo,
            noGrupo: grupo.noGrupo,
            /* Info do dono do grupo */
            dono: {
                coUsuario: grupo.coDono.coUsuario,
                noName: grupo.coDono.noName,
                coMatricula: grupo.coDono.coMatricula,
            },
            /* Lista de usuários participantes do grupo */
            usuarios: grupo.GruposUsuarios.map(gu => ({
                coUsuario: gu.coUsuario.coUsuario,
                noName: gu.coUsuario.noName,
                coMatricula: gu.coUsuario.coMatricula,
            })), 
        }));
    }

    /**
     * Lista todos os usuários de um grupo específico.
     * @param coGrupo ID do grupo.
     */
    async listarUsuariosPorGrupo(coGrupo: number): Promise<any> { 
        
        const vinculos = await this.GrupoUsuarioRepository.createQueryBuilder('gu')
            .leftJoinAndSelect('gu.coUsuario', 'coUsuario')
            .where('gu.coGrupo = :idGrupo', { idGrupo: coGrupo }) 
            .select([
                'gu.coGrupoUsuario', 
                'coUsuario.coUsuario',
                'coUsuario.noName'
            ])
            .getMany();
        
        if (vinculos.length === 0) {
            throw new HttpException(
                `Nenhum usuário encontrado para o Grupo ${coGrupo}.`
                , HttpStatus.NOT_FOUND);
        }

        return vinculos.map(v => v.coUsuario);
    }
}