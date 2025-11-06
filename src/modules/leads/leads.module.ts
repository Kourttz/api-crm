import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Leads } from './leads.entity';
import { ServicoLead } from '../servico_lead/servico_lead.entity';
import { Contatos } from '../contatos/contatos.entity';
import { Empresas } from '../empresas/empresas.entity';
import { EmpresaContato } from '../empresa_contato/empresa_contato.entity';
import { Atribuicoes } from '../atribuicoes/atribuicoes.entity';
import { TipoAtribuicao } from '../tipo_atribuicao/tipo_atribuicao.entity';
import { Associacoes } from '../associacoes/associacoes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Leads,
      ServicoLead,
      Contatos,
      Empresas,
      EmpresaContato,
      Atribuicoes,        
      TipoAtribuicao,     
      Associacoes,        
    ]),
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
