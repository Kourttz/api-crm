import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupos } from './grupos.entity';

@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupos)
    private readonly gruposRepository: Repository<Grupos>,
  ) {}
 /**
  * 
  * @returns Lista todos os grupos
  */
  async listarGrupos(): Promise<Grupos[]> {
    return this.gruposRepository.find();
  }

  /**
   * 
   * @param id ID do grupo a ser obtido
   * @returns 
   */
  async obterGrupoPorId(id: number): Promise<Grupos> {
    
    const grupo = await this.gruposRepository.findOneBy({ coGrupo: id });

    /* Verifica se o grupo foi encontrado */
    if (!grupo) {
      throw new HttpException(
        'Grupo não encontrado',
        HttpStatus.NOT_FOUND,
      );
    }

    return grupo;
  }

}
