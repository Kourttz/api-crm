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
}
