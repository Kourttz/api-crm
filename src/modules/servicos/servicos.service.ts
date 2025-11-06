import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicos } from './servicos.entity';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servicos)
    private readonly servicosRepository: Repository<Servicos>,
  ) {}

  /**
   * 
   * @returns Lista todas os serviços
   */
  async listarServicos(): Promise<Servicos[]> {
    return this.servicosRepository.find();
  }

  /**
   * 
   * @param id ID da serviço a ser obtida
   * @returns 
   */
  async obterServicoPorId(id: number): Promise<Servicos> {
    const servico = await this.servicosRepository.findOneBy({ coServico: id });

    /* Verifica se a serviço foi encontrada */
    if (!servico) {
      throw new HttpException(
        'Serviço não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return servico;
  }

  /**
   * 
   * @param dados Dados para criar um novo serviço
   * @returns 
   */   
  async criarServico(dados: Partial<Servicos>): Promise<Servicos> {

    /* Verifica se o campo coServico foi fornecido */
    if (dados.coServico) {
      throw new HttpException(
        'Não é permitido informar um ID (coServico) para o novo serviço',
        HttpStatus.BAD_REQUEST,
      );
    }

    const servico = this.servicosRepository.create(dados);
    return await this.servicosRepository.save(servico);
  }

  /**
   * 
   * @param id ID da serviço a ser atualizado
   * @param dados 
   * @returns 
   */ 
  async atualizarServico(id: number, dados: Partial<Servicos>): Promise<Servicos> {

    /* Impede a atualizservico direta do campo icSituacaoAtivo */
    if (dados.icSituacaoAtivo !== undefined) {
      throw new HttpException(
        'Não é permitido atualizar icSituacaoAtivo diretamente. Use o endpoint de alternar status.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resultado = await this.servicosRepository.update(id, dados);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Serviço não encontrado para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const servicoAtualizado = await this.servicosRepository.findOneBy({ coServico: id });

    /* Verifica se a serviço atualizada foi recuperada com sucesso */
    if (!servicoAtualizado) {
      throw new HttpException(
        'Erro ao recuperar serviço após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return servicoAtualizado;
  }

  /**
   * 
   * @param id ID da serviço a ser deletado
   */
  async deletarServico(id: number): Promise<void> {

    const resultado = await this.servicosRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Serviço não encontrado para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /** 
   *  
   * @param id ID da serviço para alternar o status
   * @return Serviço com o status alternado
   */    
  async alternarStatus(id: number): Promise<Servicos> {

    const servico = await this.servicosRepository.findOneBy({ coServico: id });

    /* Verifica se a serviço foi encontrada */
    if (!servico) {
      throw new HttpException(
        'Serviço não encontrado para alternar status',
        HttpStatus.NOT_FOUND,
      );
    }

    servico.icSituacaoAtivo = !servico.icSituacaoAtivo;
    await this.servicosRepository.save(servico);

    return servico;
  }
}
