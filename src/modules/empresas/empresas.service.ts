import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresas } from './empresas.entity';
import { CriarEmpresaDto, AtualizarEmpresaDto } from './empresas.dto'; 

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresas)
    private readonly empresasRepository: Repository<Empresas>,
  ) {}

  /**
   * * @returns Lista todas as empresas
   */
  async listarEmpresas(): Promise<Empresas[]> {
    return this.empresasRepository.find();
  }
  
  /**
   * * @param cnpj CNPJ da empresa a ser buscada
   * @returns Empresa encontrada
   */
  async buscarEmpresaPorCnpj(cnpj: string): Promise<Empresas> {
    const empresa = await this.empresasRepository.findOneBy({ coCnpj: cnpj });
    
    if (!empresa) {
        throw new HttpException(
            `Empresa com CNPJ ${cnpj} não encontrada`,
            HttpStatus.NOT_FOUND,
        );
    }

    return empresa;
  }

  /**
   * * @param dados Dados para criar uma nova empresa (tipado com CriarEmpresaDto)
   * @returns 
   */   
  async criarEmpresa(dados: CriarEmpresaDto): Promise<Empresas> {
    const empresaExistente = await this.empresasRepository.findOneBy({ coCnpj: dados.coCnpj });
    if (empresaExistente) {
      throw new HttpException(
        `Já existe uma empresa cadastrada com o CNPJ ${dados.coCnpj}`,
        HttpStatus.CONFLICT,
      );
    }
  
    const empresa = this.empresasRepository.create(dados as Partial<Empresas>); 
    return await this.empresasRepository.save(empresa);
  }

  /**
   * * @param id ID da empresa a ser atualizado
   * @param dados Dados para atualização (tipado com AtualizarEmpresaDto)
   * @returns 
   */ 
  async atualizarEmpresa(id: number, dados: AtualizarEmpresaDto): Promise<Empresas> {

    // Cria uma cópia dos dados e remove 'coEmpresa' se estiver presente no DTO de atualização
    const { coEmpresa, ...dadosParaUpdate } = dados; 
    
    const resultado = await this.empresasRepository.update(id, dadosParaUpdate);

    /* Verifica se alguma linha foi afetada */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Empresa não encontrada para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const empresaAtualizada = await this.empresasRepository.findOneBy({ coEmpresa: id });

    /* Verifica se a empresa atualizada foi recuperada com sucesso */
    if (!empresaAtualizada) {
      throw new HttpException(
        'Erro ao recuperar empresa após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return empresaAtualizada;
  }

  /**
   * * @param id ID da empresa a ser deletado
   */
  async deletarEmpresa(id: number): Promise<void> {

    const resultado = await this.empresasRepository.delete(id);

    /* Verifica se algum registro foi afetado */
    if (resultado.affected === 0) {
      throw new HttpException(
        'Empresa não encontrada para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}