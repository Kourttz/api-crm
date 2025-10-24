import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  CriarLeadDto,
  AtualizarLeadDto,
} from './leads.dto';
import { LeadsService } from './leads.service';
import { Leads } from './leads.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as Leads' })
  async listar(@Req() request: Request): Promise<ResponseDto<Leads[]>> {
    const leads = await this.leadsService.listarLeads();
    return {
      statusCode: HttpStatus.OK,
      message: 'Leads listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: leads,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova Lead, Contato, Empresa e Serviços relacionados (Transação)' })
  @ApiBody({
    type: CriarLeadDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação complexa',
        value: { 
          contato: { 
            noName: 'Nome do Responsável', 
            noCargo: 'Comprador', 
            noEmail: 'email@empresa.com', 
            noTelefone: '999999999' 
          },
          empresa: {
            noEmpresa: 'Razão Social S.A.',
            coCnpj: '00000000000000',
            coCep: '00000000',
            noEstado: 'PR',
            noCidade: 'Curitiba',
            noBairro: 'Centro',
            noEndereco: 'Rua Principal',
            noNumero: '100',
            noComplemento: 'Sala 1',
          },
          coOrigem: 5, 
          dtCaptacao: '2025-10-22', 
          noObservacao: 'Interesse em Serviço A e B.',
          servicos: [{ coServico: 1 }, { coServico: 2 }],
          coUsuarioCreate: 10
        } as unknown as CriarLeadDto, 
      },
    },
  })
  async criar(
    @Body() dados: CriarLeadDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Leads>> {
    const lead = await this.leadsService.criarLead(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Lead, Contato e Empresa criados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: lead,
    };
  }

  @Patch(':coLead') 
  @ApiOperation({ summary: 'Atualiza uma Lead existente' })
  @ApiBody({
    type: AtualizarLeadDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização de Lead',
        value: { 
          coOrigem: 6,
          noObservacao: 'Observação atualizada e fechamento em andamento.',
          coUsuarioEdit: 10
        } as unknown as AtualizarLeadDto, 
      },
    },
  })
  @ApiParam({ name: 'coLead', type: Number, description: 'ID da Lead' })
  async atualizar(
    @Param('coLead') id: number, 
    @Body() dados: AtualizarLeadDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Leads>> {
    const dadosComId = { ...dados, coLead: id }; 
    const leadAtualizada = await this.leadsService.atualizarLead(id, dadosComId); 
    return {
      statusCode: HttpStatus.OK,
      message: 'Lead atualizada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: leadAtualizada,
    };
  }

  @Delete(':coLead')
  @ApiOperation({ summary: 'Deleta uma Lead existente' })
  @ApiParam({ name: 'coLead', type: Number, description: 'ID da Lead' })
  async deletar(
    @Param('coLead') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.leadsService.deletarLead(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Lead deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }
}