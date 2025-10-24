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
  CriarOrigemDto,
  AtualizarOrigemDto,
} from './origens.dto';
import { OrigensService } from './origens.service';
import { Origens } from './origens.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';

@ApiTags('Origens')
@UseFilters(HttpExceptionFilter)
@Controller('origens')
export class OrigensController {
  constructor(private readonly origensService: OrigensService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as Ações' })
  async listar(@Req() request: Request): Promise<ResponseDto<Origens[]>> {
    const origens = await this.origensService.listarOrigens();
    return {
      statusCode: HttpStatus.OK,
      message: 'Ações listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: origens,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova Origem' })
  @ApiBody({
    type: CriarOrigemDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação',
        value: { noOrigem: 'Origem de teste', icSituacaoAtivo: true },
      },
    },
  })
  async criar(
    @Body() dados: CriarOrigemDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Origens>> {
    const origem = await this.origensService.criarOrigem(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Origem criada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: origem,
    };
  }

  @Patch(':CoOrigem')
  @ApiOperation({ summary: 'Atualiza uma origem existente' })
  @ApiBody({
    type: AtualizarOrigemDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noOrigem: 'Origem atualizada' },
      },
    },
  })
  @ApiParam({ name: 'coOrigem', type: Number, description: 'ID da Origem' })
  async atualizar(
    @Param('coOrigem') id: number,
    @Body() dados: AtualizarOrigemDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Origens>> {
    const origemAtualizada = await this.origensService.atualizarOrigem(id, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Origem atualizada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: origemAtualizada,
    };
  }

  @Delete(':coOrigem')
  @ApiOperation({ summary: 'Deleta uma origem existente' })
  @ApiParam({ name: 'coOrigem', type: Number, description: 'ID da Origem' })
  async deletar(
    @Param('coOrigem') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.origensService.deletarOrigem(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Origem deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

  @Put(':coOrigem')
  @ApiOperation({ summary: 'Alterna o status ativo/inativo da origem' })
  @ApiParam({ name: 'coOrigem', type: Number, description: 'ID da Origem' })
  async alternarStatus(
    @Param('coOrigem') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<Origens>> {
    const origemAtualizada = await this.origensService.alternarStatus(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Status da origem alternado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: origemAtualizada,
    };
  }
}
