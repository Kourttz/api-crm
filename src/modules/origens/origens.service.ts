import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Origens } from './origens.entity';

@Injectable()
export class OrigensService {
  constructor(
    @InjectRepository(Origens)
    private readonly origensRepository: Repository<Origens>,
  ) {}

  /**
   * 
   * @returns Lista todas as ações
   */
  async listarOrigens(): Promise<Origens[]> {
    return this.origensRepository.find();
  }

  /**
   * 
   * @param id ID da origem a ser obtida
   * @returns 
   */
  async obterOrigemPorId(id: number): Promise<Origens> {
    const origem = await this.origensRepository.findOneBy({ coOrigem: id });

    /* Verifica se a origem foi encontrada */
    if (!origem) {
      throw new HttpException(
        'Origem não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return origem;
  }

  /**
   * 
   * @param dados Dados para criar uma nova origem
   * @returns 
   */   
  async criarOrigem(dados: Partial<Origens>): Promise<Origens> {

    /* Verifica se o campo coOrigem foi fornecido */
    if (dados.coOrigem) {
      throw new HttpException(
        'Não é permitido informar um ID (coOrigem) para a nova origem',
        HttpStatus.BAD_REQUEST,
      );
    }

    const origem = this.origensRepository.create(dados);
    return await this.origensRepository.save(origem);
  }

  /**
   * 
   * @param id ID da origem a ser atualizado
   * @param dados 
   * @returns 
   */ 
  async atualizarOrigem(id: number, dados: Partial<Origens>): Promise<Origens> {

    /* Impede a atualizorigem direta do campo icSituacaoAtivo */
    if (dados.icSituacaoAtivo !== undefined) {
      throw new HttpException(
        'Não é permitido atualizar icSituacaoAtivo diretamente. Use o endpoint de alternar status.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resultado = await this.origensRepository.update(id, dados);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Origem não encontrada para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const origemAtualizada = await this.origensRepository.findOneBy({ coOrigem: id });

    /* Verifica se a origem atualizada foi recuperada com sucesso */
    if (!origemAtualizada) {
      throw new HttpException(
        'Erro ao recuperar origem após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return origemAtualizada;
  }

  /**
   * 
   * @param id ID da origem a ser deletado
   */
  async deletarOrigem(id: number): Promise<void> {

    const resultado = await this.origensRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Origem não encontrada para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** 
   *  
   * @param id ID da origem para alternar o status
   * @return Origem com o status alternado
   */    
  async alternarStatus(id: number): Promise<Origens> {

    const origem = await this.origensRepository.findOneBy({ coOrigem: id });

    /* Verifica se a origem foi encontrada */
    if (!origem) {
      throw new HttpException(
        'Origem não encontrada para alternar status',
        HttpStatus.NOT_FOUND,
      );
    }

    origem.icSituacaoAtivo = !origem.icSituacaoAtivo;
    await this.origensRepository.save(origem);

    return origem;
  }
}
