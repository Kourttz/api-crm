import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuarios } from './usuarios.entity';



@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuarios)
    private readonly UsuariosRepository: Repository<Usuarios>,
  ) {}

  /**
   * 
   * @returns Lista todos os usuários com seus perfis associados
   */
  async listarUsuarios(): Promise<Usuarios[]> {
    return this.UsuariosRepository.find();
  }
 
}
