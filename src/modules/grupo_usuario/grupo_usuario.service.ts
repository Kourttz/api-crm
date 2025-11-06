import { 
    Injectable, 
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { GrupoUsuario } from './grupo_usuario.entity';
import { Grupos } from '../grupos/grupos.entity';
import { Usuarios } from '../usuarios/usuarios.entity';
import { CoUsuariosDto } from './grupo_usuario.dto';

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
    * Lista todos os grupos com seus participantes, incluindo participantes de grupos filhos (recursivamente).
    * Cada grupo é retornado individualmente com sua subárvore completa.
    * @returns Lista de grupos com seus participantes agregados.
    */
    async listarTodosGruposComUsuarios(): Promise<any[]> {
        // Busca todos os grupos com suas relações
        const grupos = await this.GruposRepository.find({
        relations: [
            'coDono',
            'GruposUsuarios',
            'GruposUsuarios.coUsuario',
        ],
        });
    
        // Função recursiva que monta a árvore e agrega participantes
        const montarArvore = (grupo: any): any => {
        // Busca todos os filhos diretos
        const filhos = grupos.filter((g) => g.coGrupoPai === grupo.coGrupo);
    
        // Monta as subárvores de forma recursiva
        const gruposFilhos = filhos.map((filho) => montarArvore(filho));
    
        // Mapa para evitar duplicatas de participantes
        const todosParticipantes = new Map<number, any>();
    
        // Extrai os participantes do grupo atual (GruposUsuarios)
        grupo.GruposUsuarios?.forEach((gu) => {
            if (gu.coUsuario) {
            todosParticipantes.set(gu.coUsuario.coUsuario, gu.coUsuario);
            }
        });
    
        // Função auxiliar que percorre filhos recursivamente
        const adicionarParticipantesFilhos = (subgrupo: any) => {
            subgrupo.GruposUsuarios?.forEach((gu) => {
            if (gu.coUsuario) {
                todosParticipantes.set(gu.coUsuario.coUsuario, gu.coUsuario);
            }
            });
            subgrupo.gruposFilhos?.forEach(adicionarParticipantesFilhos);
        };
    
        gruposFilhos.forEach(adicionarParticipantesFilhos);
    
        // Retorna o grupo com sua subárvore e lista completa de participantes
        return {
            coGrupo: grupo.coGrupo,
            noGrupo: grupo.noGrupo,
            coGrupoPai: grupo.coGrupoPai,
            icSituacaoAtivo: grupo.icSituacaoAtivo,
            dono: grupo.coDono ? {
            coUsuario: grupo.coDono.coUsuario,
            noName: grupo.coDono.noName,
            coMatricula: grupo.coDono.coMatricula,
            } : null,
            participantes: Array.from(todosParticipantes.values()).map((p) => ({
            coUsuario: p.coUsuario,
            noName: p.noName,
            coMatricula: p.coMatricula,
            })),
            gruposFilhos,
        };
        };
    
        // Retorna todos os grupos individualmente, cada um com sua árvore completa
        return grupos.map((grupo) => montarArvore(grupo));
    }
    
    /**
    * Lista um grupo e seus usuários, com ou sem filhos recursivos.
    * @param coGrupo ID do grupo.
    * @param incluirFilhos Se verdadeiro, inclui recursivamente os grupos filhos.
    * @returns Grupo com seus usuários e, opcionalmente, seus grupos filhos.
    */
    async listarUsuariosPorGrupo(coGrupo: number, incluirFilhos = false): Promise<any> {
        // Define os relacionamentos que serão carregados
        const baseRelations = ['coDono', 'GruposUsuarios', 'GruposUsuarios.coUsuario'];
        const relations = incluirFilhos
            ? [...baseRelations, 'gruposFilhos', 'gruposFilhos.GruposUsuarios', 'gruposFilhos.GruposUsuarios.coUsuario', 'gruposFilhos.coDono']
            : baseRelations;
        
        // Busca o grupo pelo ID com as relações necessárias
        const grupo = await this.GruposRepository.findOne({
            where: { coGrupo },
            relations,
        });
        
        // Verifica se o grupo foi encontrado
        if (!grupo) {
            throw new HttpException(`Grupo ${coGrupo} não encontrado.`, HttpStatus.NOT_FOUND);
        }
    
        /**
         * Função recursiva para buscar filhos no banco
         */
        const carregarFilhosRecursivamente = async (g: any): Promise<any> => {
            if (!incluirFilhos) return g;
    
            const filhos = await this.GruposRepository.find({
                where: { coGrupoPai: g.coGrupo },
                relations: [
                    'coDono',
                    'GruposUsuarios',
                    'GruposUsuarios.coUsuario',
                ],
            });
            
            // Carrega os filhos recursivamente
            g.gruposFilhos = [];
            for (const filho of filhos) {
                const filhoComSubFilhos = await carregarFilhosRecursivamente(filho);
                g.gruposFilhos.push(filhoComSubFilhos);
            }
    
            return g;
        };
        
        // Monta o objeto final do grupo com participantes e filhos
        const montarGrupo = (g: any): any => {
            const participantes = g.GruposUsuarios.map((gu: any) => ({
                coUsuario: gu.coUsuario.coUsuario,
                noName: gu.coUsuario.noName,
                coMatricula: gu.coUsuario.coMatricula,
            }));
            
            const gruposFilhos = (g.gruposFilhos || []).map((filho: any) => montarGrupo(filho));
            
            return {
                coGrupo: g.coGrupo,
                noGrupo: g.noGrupo,
                dono: g.coDono
                    ? {
                          coUsuario: g.coDono.coUsuario,
                          noName: g.coDono.noName,
                          coMatricula: g.coDono.coMatricula,
                      }
                    : null,
                participantes,
                gruposFilhos,
            };
        };
    
        const grupoCompleto = await carregarFilhosRecursivamente(grupo);
        return montarGrupo(grupoCompleto);
    } 

    /** 
     * Atualiza ou cadastra os vínculos entre um grupo e seus usuários.
     * @param coGrupo ID do grupo.
     * @param coUsuariosDto DTO contendo a lista de IDs de usuários.
     */
    async atualizarOuCadastrar(
        coGrupo: number,
        coUsuariosDto: CoUsuariosDto,
    ): Promise<void> {
        const coUsuarios = coUsuariosDto.coUsuarios || [];
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        /* Tenta encontrar o grupo pelo ID fornecido */
        try {
            const grupoExiste = await queryRunner.manager.findOne(Grupos, { where: { coGrupo } });
            
            if (!grupoExiste) {
                throw new HttpException(
                    `Grupo com ID ${coGrupo} não encontrado.`,
                    HttpStatus.NOT_FOUND,
                );
            }
            /* Remove todos os vínculos existentes para o grupo */
            await queryRunner.manager.delete(GrupoUsuario, {
                coGrupo: { coGrupo } as Grupos,
            });

            if (coUsuarios.length === 0) {
                await queryRunner.commitTransaction();
                return;
            }
            
            /* Cria novos vínculos com os IDs de usuários fornecidos */
            const novosGU: GrupoUsuario[] = coUsuarios.map((coUsuario) => 
                queryRunner.manager.create(GrupoUsuario, {
                    coGrupo: { coGrupo } as Grupos,
                    coUsuario: { coUsuario } as Usuarios,
                })
            );
            
            /* Salva os novos vínculos no banco de dados */
            await queryRunner.manager.save(novosGU);
            
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            
            if (error instanceof HttpException) {
                throw error;
            }
            
            throw new HttpException(
                'Erro ao processar a atualização de vínculos. Verifique os IDs de grupo e usuários.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        } finally {
            await queryRunner.release();
        }
    }
}