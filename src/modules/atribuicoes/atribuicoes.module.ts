import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtribuicoesController } from './atribuicoes.controller';
import { AtribuicoesService } from './atribuicoes.service';
import { Atribuicoes } from './atribuicoes.entity';
import { Associacoes } from '../associacoes/associacoes.entity';
import { TipoAtribuicao } from '../tipo_atribuicao/tipo_atribuicao.entity';
import { Leads } from '../leads/leads.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Atribuicoes,
      Associacoes,       
      TipoAtribuicao,   
      Leads,             
    ]),
  ],
  controllers: [AtribuicoesController],
  providers: [AtribuicoesService],
  exports: [AtribuicoesService],
})
export class AtribuicoesModule {} 
