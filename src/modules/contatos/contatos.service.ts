import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contatos } from './contatos.entity';
import { CriarContatoDto, AtualizarContatoDto } from './contatos.dto'; 

@Injectable()
export class ContatosService {
  constructor(
    @InjectRepository(Contatos)
    private readonly contatosRepository: Repository<Contatos>,
  ) {}

  /**
   * * @returns Lista todas as ações
   */
  async listarContatos(): Promise<Contatos[]> {
    return this.contatosRepository.find();
  }

  /**
   * * @param dados Dados para criar um novo contato (tipado com CriarContatoDto)
   * @returns 
   */ 
  async criarContato(dados: CriarContatoDto): Promise<Contatos> {
    
    const contato = this.contatosRepository.create(dados as Partial<Contatos>);
    return await this.contatosRepository.save(contato);
  }

  /**
   * * @param id ID do contato a ser atualizado
   * @param dados Dados para atualização (tipado com AtualizarContatoDto)
   * @returns 
   */ 
  async atualizarContato(id: number, dados: AtualizarContatoDto): Promise<Contatos> {

    // Destrutura os dados para garantir que o ID (coContato) não seja usado no update
    const { coContato, ...dadosParaUpdate } = dados;

    const resultado = await this.contatosRepository.update(id, dadosParaUpdate);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Contato não encontrado para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const contatoAtualizada = await this.contatosRepository.findOneBy({ coContato: id });

    /* Verifica se o contato atualizado foi recuperado com sucesso */
    if (!contatoAtualizada) {
      throw new HttpException(
        'Erro ao recuperar contato após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return contatoAtualizada;
  }

  /**
   * * @param id ID do contato a ser deletado
   */
  async deletarContato(id: number): Promise<void> {

    const resultado = await this.contatosRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Contato não encontrado para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }

}