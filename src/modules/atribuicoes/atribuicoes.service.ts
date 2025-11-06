import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atribuicoes } from './atribuicoes.entity';
import { Associacoes } from '../associacoes/associacoes.entity';
import { TipoAtribuicao } from '../tipo_atribuicao/tipo_atribuicao.entity';
import { Leads } from '../leads/leads.entity';
import { AtualizarAtribuicaoDto } from './atribuicoes.dto';

@Injectable()
export class AtribuicoesService {
  constructor(
    @InjectRepository(Atribuicoes)
    private readonly atribuicoesRepository: Repository<Atribuicoes>,

    @InjectRepository(Associacoes)
    private readonly associacoesRepository: Repository<Associacoes>,

    @InjectRepository(TipoAtribuicao)
    private readonly tipoAtribuicaoRepository: Repository<TipoAtribuicao>,

    @InjectRepository(Leads)
    private readonly leadsRepository: Repository<Leads>,
  ) {}

  /**
   * 
   * @returns Lista todas as atribuições
   */
  async listarAtribuicoes(): Promise<any[]> {
    
    // Busca todas as atribuições com seus tipos
    const atribuicoes = await this.atribuicoesRepository.find({
      relations: ['tipoAtribuicao'],
      order: { coAtribuicao: 'ASC' },
    });

    // Prepara a lista de resultados com informações adicionais
    const resultados: any[] = [];

    for (const atrib of atribuicoes) {
      let infoVinculo: any = null;

      switch (atrib.coTipoAtribuicao) {
        case 1:
          infoVinculo = await this.buscarUsuario(atrib.coAtribuido);
          break;
        case 2:
          infoVinculo = await this.buscarGrupo(atrib.coAtribuido);
          break;
        case 3:
          infoVinculo = await this.buscarUsuariosAssociados(atrib.coAtribuido);
          break;
      }

      resultados.push({
        coAtribuicao: atrib.coAtribuicao,
        coLead: atrib.coLead,
        tipoAtribuicao: atrib.tipoAtribuicao?.noTipoAtribuicao,
        coAtribuido: atrib.coAtribuido,
        vinculo: infoVinculo,
        dtRegistro: atrib.dtRegistro,
      });
    }

    return resultados;
  }

  /**
   * 
   * @param coAtribuicao ID da atribuição a ser obtida
   * @returns Atribuição obtida
   */
  async obterPorId(coAtribuicao: number): Promise<any> {

    // Busca a atribuição pelo ID
    const atrib = await this.atribuicoesRepository.findOne({
      where: { coAtribuicao },
      relations: ['tipoAtribuicao'],
    });

    //  Verifica se a atribuição foi encontrada
    if (!atrib) {
      throw new HttpException(
        `Atribuição ${coAtribuicao} não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    let infoVinculo: any = null;

    switch (atrib.coTipoAtribuicao) {
      case 1:
        infoVinculo = await this.buscarUsuario(atrib.coAtribuido);
        break;
      case 2:
        infoVinculo = await this.buscarGrupo(atrib.coAtribuido);
        break;
      case 3:
        infoVinculo = await this.buscarUsuariosAssociados(atrib.coAtribuido);
        break;
    }

    return {
      coAtribuicao: atrib.coAtribuicao,
      coLead: atrib.coLead,
      tipoAtribuicao: atrib.tipoAtribuicao?.noTipoAtribuicao,
      coAtribuido: atrib.coAtribuido,
      vinculo: infoVinculo,
      dtRegistro: atrib.dtRegistro,
    };
  }

  /**
   * 
   * @param dados Dados para criar uma nova atribuição (tipado com CriarAtribuicaoDto)
   * @returns Atribuição criada
   */ 
  async criarAtribuicao(dados: any): Promise<Atribuicoes | Atribuicoes[]> {
    const { coLead, coTipoAtribuicao, coAtribuido, associacoes } = dados;

    // Verifica se o lead existe
    const leadExiste = await this.leadsRepository.findOne({ where: { coLead } });
    if (!leadExiste) {
      throw new HttpException(
        `Lead ${coLead} não encontrado.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verifica se o tipo de atribuição é válido
    const tipo = await this.tipoAtribuicaoRepository.findOne({
      where: { coTipoAtribuicao },
    });
    if (!tipo) {
      throw new HttpException(
        `Tipo de atribuição ${coTipoAtribuicao} inválido.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Lógica por tipo de atribuição
    switch (coTipoAtribuicao) {

      //  Tipo 1: Usuário único
      case 1:
        if (!coAtribuido) {
          throw new HttpException(
            'Para tipo 1 (usuário único), o campo coAtribuido é obrigatório.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Verifica se o usuário existe
        const usuarioExiste = await this.verificarUsuario(coAtribuido);
        if (!usuarioExiste) {
          throw new HttpException(
            `Usuário ${coAtribuido} não encontrado em gestao.tb_usuarios.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const novaAtribuicaoUsuario = this.atribuicoesRepository.create({
          coLead,
          coTipoAtribuicao,
          coAtribuido,
        });
        return await this.atribuicoesRepository.save(novaAtribuicaoUsuario);

      // Tipo 2: Grupo
      case 2:
        if (!coAtribuido) {
          throw new HttpException(
            'Para tipo 2 (grupo), o campo coAtribuido é obrigatório.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Verifica se o grupo existe
        const grupoExiste = await this.verificarGrupo(coAtribuido);
        if (!grupoExiste) {
          throw new HttpException(
            `Grupo ${coAtribuido} não encontrado em gestao.tb_grupos.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const novaAtribuicaoGrupo = this.atribuicoesRepository.create({
          coLead,
          coTipoAtribuicao,
          coAtribuido,
        });
        return await this.atribuicoesRepository.save(novaAtribuicaoGrupo);

      // Tipo 3: Associação (múltiplos usuários)
      case 3:
        if (!Array.isArray(associacoes) || associacoes.length === 0) {
          throw new HttpException(
            'Para tipo 3 (associação), é necessário informar uma lista de usuários.',
            HttpStatus.BAD_REQUEST,
          );
        }

        // Valida se todos os usuários existem
        for (const a of associacoes) {
          const usuarioValido = await this.verificarUsuario(a.coUsuario);
          if (!usuarioValido) {
            throw new HttpException(
              `Usuário ${a.coUsuario} não encontrado em gestao.tb_usuarios.`,
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        // Gera co_atribuido incremental
        const ultimo = await this.atribuicoesRepository
          .createQueryBuilder('a')
          .orderBy('a.coAtribuido', 'DESC')
          .getOne();
        const novoCoAtribuido = ultimo ? ultimo.coAtribuido + 1 : 1;

        // Cria a atribuição principal
        const novaAtribuicaoAssociacao = this.atribuicoesRepository.create({
          coLead,
          coTipoAtribuicao,
          coAtribuido: novoCoAtribuido,
        });
        // Salva a atribuição principal
        const atribuicaoSalva = await this.atribuicoesRepository.save(
          novaAtribuicaoAssociacao,
        );

        // Cria as associações válidas
        const registrosAssociacoes = associacoes.map((a: any) =>
          this.associacoesRepository.create({
            coUsuario: a.coUsuario,
            coAtribuido: novoCoAtribuido,
          }),
        );
        await this.associacoesRepository.save(registrosAssociacoes);

        return atribuicaoSalva;

      default:
        throw new HttpException(
          `Tipo de atribuição ${coTipoAtribuicao} não suportado.`,
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  /**
   * 
   * @param coAtribuicao ID da atribuição a ser atualizada
   * @param dados Dados para atualização (tipado com AtualizarAtribuicaoDto)
   * @returns Atribuição atualizada
   */
  async atualizarAtribuicao(
    coAtribuicao: number,
    dados: AtualizarAtribuicaoDto,
  ): Promise<Atribuicoes> {
    const atribuicao = await this.atribuicoesRepository.findOne({
      where: { coAtribuicao },
    });

    /* Verifica se a atribuição foi encontrada */
    if (!atribuicao) {
      throw new HttpException(
        `Atribuição ${coAtribuicao} não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    Object.assign(atribuicao, dados);
    return await this.atribuicoesRepository.save(atribuicao);
  }

  /**
   * 
   * @param coAtribuicao ID da atribuição a ser deletada
   */
  async deletarAtribuicao(coAtribuicao: number): Promise<void> {
    const atribuicao = await this.atribuicoesRepository.findOne({
      where: { coAtribuicao },
    });

    /* Verifica se a atribuição foi encontrada */
    if (!atribuicao) {
      throw new HttpException(
        `Atribuição ${coAtribuicao} não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Se for do tipo 3 (associação), deleta as associações relacionadas
    if (atribuicao.coTipoAtribuicao === 3) {
      await this.associacoesRepository.delete({ coAtribuido: atribuicao.coAtribuido });
    }

    await this.atribuicoesRepository.remove(atribuicao);
  }

  /* Verifica se o usuário existe na tabela gestao.tb_usuarios */
  private async verificarUsuario(coUsuario: number): Promise<boolean> {
    const usuario = await this.atribuicoesRepository.query(
      `SELECT co_usuario FROM gestao.tb_usuarios WHERE co_usuario = $1`,
      [coUsuario],
    );
    return usuario.length > 0;
  }

  /* Verifica se o grupo existe na tabela gestao.tb_grupos */
  private async verificarGrupo(coGrupo: number): Promise<boolean> {
    const grupo = await this.atribuicoesRepository.query(
      `SELECT co_grupo FROM gestao.tb_grupos WHERE co_grupo = $1`,
      [coGrupo],
    );
    return grupo.length > 0;
  }

  /* Busca informações do usuário na tabela gestao.tb_usuarios */
  private async buscarUsuario(coUsuario: number): Promise<any> {
    const usuario = await this.atribuicoesRepository.query(
      `SELECT co_usuario, no_name FROM gestao.tb_usuarios WHERE co_usuario = $1`,
      [coUsuario],
    );
    return usuario[0] || null;
  }

  /* Busca informações do grupo na tabela gestao.tb_grupos */
  private async buscarGrupo(coGrupo: number): Promise<any> {
    const grupo = await this.atribuicoesRepository.query(
      `SELECT co_grupo, no_grupo FROM gestao.tb_grupos WHERE co_grupo = $1`,
      [coGrupo],
    );
    return grupo[0] || null;
  }

  /* Busca usuários associados para atribuições do tipo 3 */
  private async buscarUsuariosAssociados(coAtribuido: number): Promise<any[]> {
    const usuarios = await this.associacoesRepository.query(
      `SELECT a.co_usuario, u.no_name
       FROM tb_associacoes a
       JOIN gestao.tb_usuarios u ON a.co_usuario = u.co_usuario
       WHERE a.co_atribuido = $1`,
      [coAtribuido],
    );
    return usuarios;
  }
}
