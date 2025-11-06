import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Put,
  UseFilters,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  CriarServicoDto,
  AtualizarServicoDto,
} from './servicos.dto';
import { ServicosService } from './servicos.service';
import { Servicos } from './servicos.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';

@ApiTags('Servicos')
@UseFilters(HttpExceptionFilter)
@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas os Serviços' })
  async listar(@Req() request: Request): Promise<ResponseDto<Servicos[]>> {
    const servicos = await this.servicosService.listarServicos();
    return {
      statusCode: HttpStatus.OK,
      message: 'Serviços listados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: servicos,
    };
  }

  @Get(':coServico')
  @ApiOperation({ summary: 'Obtém um Serviço por ID' })
  @ApiParam({ name: 'coServico', type: Number, description: 'ID do Serviço' })
  async obterPorId(@Req() request: Request, @Param('coServico') id: number): Promise<ResponseDto<Servicos>> {
    const servico = await this.servicosService.obterServicoPorId(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Serviço obtido com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: servico,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo Serviço' })
  @ApiBody({
    type: CriarServicoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação',
        value: { noServico: 'Serviço de teste', icSituacaoAtivo: true },
      },
    },
  })
  async criar(
    @Body() dados: CriarServicoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Servicos>> {
    const servico = await this.servicosService.criarServico(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Serviço criado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: servico,
    };
  }

  @Patch(':CoServico')
  @ApiOperation({ summary: 'Atualiza um serviço existente' })
  @ApiBody({
    type: AtualizarServicoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noServico: 'Serviço atualizada' },
      },
    },
  })
  @ApiParam({ name: 'coServico', type: Number, description: 'ID da Serviço' })
  async atualizar(
    @Param('coServico') id: number,
    @Body() dados: AtualizarServicoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Servicos>> {
    const servicoAtualizado = await this.servicosService.atualizarServico(id, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Serviço atualizada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: servicoAtualizado,
    };
  }

  @Delete(':coServico')
  @ApiOperation({ summary: 'Deleta um serviço existente' })
  @ApiParam({ name: 'coServico', type: Number, description: 'ID do Serviço' })
  async deletar(
    @Param('coServico') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.servicosService.deletarServico(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Serviço deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

  @Put(':coServico')
  @ApiOperation({ summary: 'Alterna o status ativo/inativo da serviço' })
  @ApiParam({ name: 'coServico', type: Number, description: 'ID do Serviço' })
  async alternarStatus(
    @Param('coServico') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<Servicos>> {
    const servicoAtualizado = await this.servicosService.alternarStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status da serviço alternado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: servicoAtualizado,
    };
  }
}
