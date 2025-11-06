import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Leads } from './leads.entity';
import { CriarLeadDto, AtualizarLeadDto } from './leads.dto';
import { Contatos } from '../contatos/contatos.entity';
import { Empresas } from '../empresas/empresas.entity';
import { EmpresaContato } from '../empresa_contato/empresa_contato.entity';
import { ServicoLead } from '../servico_lead/servico_lead.entity';
import { Atribuicoes } from '../atribuicoes/atribuicoes.entity';
import { TipoAtribuicao } from '../tipo_atribuicao/tipo_atribuicao.entity';
import { Associacoes } from '../associacoes/associacoes.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Leads)
    private readonly leadsRepository: Repository<Leads>,

    @InjectRepository(ServicoLead)
    private readonly ServicoLead: Repository<ServicoLead>,

    @InjectRepository(Atribuicoes)
    private readonly atribuicoesRepository: Repository<Atribuicoes>,

    @InjectRepository(TipoAtribuicao)
    private readonly tipoAtribuicaoRepository: Repository<TipoAtribuicao>,

    @InjectRepository(Associacoes)
    private readonly associacoesRepository: Repository<Associacoes>,

    private dataSource: DataSource,
  ) {}

  /**
   * 
   * @returns Lista todas as leads com detalhes das atribuições
   */
  async listarLeads(): Promise<any[]> {
    const leads = await this.leadsRepository.find({
      relations: [
        'contato',
        'origem',
        'empresaContatos.empresa',
        'servicoLead.servico',
        'usuarioCreate',
        'usuarioEdit',
      ],
      order: { coLead: 'ASC' },
    });

    const resultados: any[] = [];

    for (const lead of leads) {
      // Busca todas as atribuições vinculadas à lead
      const atribuicoes = await this.atribuicoesRepository.find({
        where: { coLead: lead.coLead },
        relations: ['tipoAtribuicao'],
      });

      const atribuicoesDetalhadas: any[] = []; 

      for (const atrib of atribuicoes) {
        let vinculo: any = null;

        switch (atrib.coTipoAtribuicao) {
          case 1:
            vinculo = await this.buscarUsuario(atrib.coAtribuido);
            break;
          case 2:
            vinculo = await this.buscarGrupo(atrib.coAtribuido);
            break;
          case 3:
            vinculo = await this.buscarUsuariosAssociados(atrib.coAtribuido);
            break;
        }

        atribuicoesDetalhadas.push({
          coAtribuicao: atrib.coAtribuicao,
          tipoAtribuicao: atrib.tipoAtribuicao?.noTipoAtribuicao,
          coAtribuido: atrib.coAtribuido,
          vinculo,
          dtRegistro: atrib.dtRegistro,
        });
      }

      resultados.push({
        ...lead,
        atribuicoes: atribuicoesDetalhadas,
      });
    }

    return resultados;
  }

  /**
   * 
   * @param id ID da lead a ser obtida
   * @returns A lead com detalhes das atribuições
   */
  async obterLeadPorId(id: number): Promise<any> {
    const lead = await this.leadsRepository.findOne({
      where: { coLead: id },
      relations: [
        'contato',
        'origem',
        'empresaContatos.empresa',
        'servicoLead.servico',
        'usuarioCreate',
        'usuarioEdit',
      ],
    });

    if (!lead) {
      throw new HttpException('Lead não encontrada', HttpStatus.NOT_FOUND);
    }

    // Busca atribuições vinculadas
    const atribuicoes = await this.atribuicoesRepository.find({
      where: { coLead: lead.coLead },
      relations: ['tipoAtribuicao'],
    });

    const atribuicoesDetalhadas: any[] = [];

    for (const atrib of atribuicoes) {
      let vinculo: any = null;

      switch (atrib.coTipoAtribuicao) {
        case 1:
          vinculo = await this.buscarUsuario(atrib.coAtribuido);
          break;
        case 2:
          vinculo = await this.buscarGrupo(atrib.coAtribuido);
          break;
        case 3:
          vinculo = await this.buscarUsuariosAssociados(atrib.coAtribuido);
          break;
      }

      atribuicoesDetalhadas.push({
        coAtribuicao: atrib.coAtribuicao,
        tipoAtribuicao: atrib.tipoAtribuicao?.noTipoAtribuicao,
        coAtribuido: atrib.coAtribuido,
        vinculo,
        dtRegistro: atrib.dtRegistro,
      });
    }

    return {
      ...lead,
      atribuicoes: atribuicoesDetalhadas,
    };
  }

  // Busca um usuário pelo co_usuario
  private async buscarUsuario(coUsuario: number): Promise<any> {
    const usuario = await this.leadsRepository.query(
      `SELECT co_usuario, no_name FROM gestao.tb_usuarios WHERE co_usuario = $1`,
      [coUsuario],
    );
    return usuario[0] || null;
  }

  // Busca um grupo pelo co_grupo
  private async buscarGrupo(coGrupo: number): Promise<any> {
    const grupo = await this.leadsRepository.query(
      `SELECT co_grupo, no_grupo FROM gestao.tb_grupos WHERE co_grupo = $1`,
      [coGrupo],
    );
    return grupo[0] || null;
  }

  /// Busca todos os usuários associados a um co_atribuido específico
  private async buscarUsuariosAssociados(coAtribuido: number): Promise<any[]> {
    const usuarios = await this.leadsRepository.query(
      `SELECT a.co_usuario, u.no_name
       FROM tb_associacoes a
       JOIN gestao.tb_usuarios u ON a.co_usuario = u.co_usuario
       WHERE a.co_atribuido = $1`,
      [coAtribuido],
    );
    return usuarios;
  }

  /**
   * 
   * @param dados Dados para criação da lead (tipado com CriarLeadDto)
   * @returns A lead criada
   */
  async criarLead(dados: CriarLeadDto): Promise<Leads> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { contato: dadosContato, empresa: dadosEmpresa, servicos, ...dadosLeadPuros } = dados;

      const contatoRepo = queryRunner.manager.getRepository(Contatos);
      const novoContato = contatoRepo.create(dadosContato);
      const contatoSalvo = await contatoRepo.save(novoContato);

      const empresaRepo = queryRunner.manager.getRepository(Empresas);
      const existenteEmpresa = await empresaRepo.findOneBy({ coCnpj: dadosEmpresa.coCnpj });

      let empresaSalva: Empresas;
      if (existenteEmpresa) {
        empresaSalva = existenteEmpresa;
      } else {
        const novaEmpresa = empresaRepo.create({ ...dadosEmpresa });
        empresaSalva = await empresaRepo.save(novaEmpresa);
      }

      const leadsRepo = queryRunner.manager.getRepository(Leads);
      const leadCriada = leadsRepo.create({
        ...dadosLeadPuros,
        coContato: contatoSalvo.coContato,
      });
      const leadSalva = await leadsRepo.save(leadCriada);

      const empresaContatoRepo = queryRunner.manager.getRepository(EmpresaContato);
      const relEmpresaContato = empresaContatoRepo.create({
        coEmpresa: empresaSalva.coEmpresa,
        coContato: contatoSalvo.coContato,
        coLead: leadSalva.coLead,
      });
      await empresaContatoRepo.save(relEmpresaContato);

      if (servicos && servicos.length > 0) {
        const servicoLeadRepo = queryRunner.manager.getRepository(ServicoLead);
        const relacoesServicos = servicos.map((s) =>
          servicoLeadRepo.create({
            coServico: s.coServico,
            coLead: leadSalva.coLead,
          }),
        );
        await servicoLeadRepo.save(relacoesServicos);
      }

      await queryRunner.commitTransaction();
      return leadSalva;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Erro na transação de criação de Lead:', error);
      throw new HttpException(
        'Erro ao criar Lead, Contato e entidades relacionadas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 
   * @param id ID da lead a ser atualizada
   * @param dados Dados para atualização (tipado com AtualizarLeadDto)
   * @returns
   */
  async atualizarLead(id: number, dados: AtualizarLeadDto): Promise<Leads> {
    const { coLead, ...dadosParaUpdate } = dados;

    const resultado = await this.leadsRepository.update(id, dadosParaUpdate as any);

    if (resultado.affected === 0) {
      throw new HttpException('Lead não encontrada para atualização', HttpStatus.NOT_FOUND);
    }

    if (dados.servicos) {
      await this.ServicoLead.delete({ coLead: id });
      const novosServicos = dados.servicos.map((s) =>
        this.ServicoLead.create({
          coLead: id,
          coServico: s.coServico,
        }),
      );
      await this.ServicoLead.save(novosServicos);
    }

    const leadAtualizada = await this.leadsRepository.findOneBy({ coLead: id });

    if (!leadAtualizada) {
      throw new HttpException('Erro ao recuperar lead após atualização', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return leadAtualizada;
  }

  /**
   * 
   * @param id ID da lead a ser deletada
   */
  async deletarLead(id: number): Promise<void> {
    const resultado = await this.leadsRepository.delete(id);

    // Verifica se alguma linha foi afetada
    if (resultado.affected === 0) {
      throw new HttpException('Lead não encontrada para exclusão', HttpStatus.NOT_FOUND);
    }
  }
}
