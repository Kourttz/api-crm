import { Module } from '@nestjs/common';
import { GrupoUsuarioController } from './grupo_usuario.controller';
import { GrupoUsuarioService } from './grupo_usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoUsuario } from './grupo_usuario.entity';
import { Grupos } from '../grupos/grupos.entity'; 
import { Usuarios } from '../usuarios/usuarios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GrupoUsuario,
      Grupos,     
      Usuarios,   
    ]),
  ],
  controllers: [GrupoUsuarioController],
  providers: [GrupoUsuarioService],
})
export class GrupoUsuarioModule {}