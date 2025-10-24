import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContatosController } from './contatos.controller';
import { ContatosService } from './contatos.service';
import { Contatos } from './contatos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contatos])],
  controllers: [ContatosController],
  providers: [ContatosService],
})
export class ContatosModule {}
