import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  UseFilters,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import {
  CriarContatoDto,
  AtualizarContatoDto,
} from './contatos.dto';
import { ContatosService } from './contatos.service';
import { Contatos } from './contatos.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';

@ApiTags('Contatos')
@UseFilters(HttpExceptionFilter)
@Controller('contatos')
export class ContatosController {
  constructor(private readonly contatosService: ContatosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os Contatos' }) 
  async listar(@Req() request: Request): Promise<ResponseDto<Contatos[]>> {
    const contatos = await this.contatosService.listarContatos();
    return {
      statusCode: HttpStatus.OK,
      message: 'Contatos listados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: contatos,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo Contato' })
  @ApiBody({
    type: CriarContatoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação de Contato',
        value: { noName: 'Carlos Ferreira', noEmail: 'carlos@exemplo.com.br' },
      },
    },
  })
  async criar(
    @Body() dados: CriarContatoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Contatos>> {
    const contato = await this.contatosService.criarContato(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Contato criado com sucesso', 
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: contato,
    };
  }

  @Patch(':coContato')
  @ApiOperation({ summary: 'Atualiza um contato existente' })
  @ApiBody({
    type: AtualizarContatoDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noName: 'Carlos Ferreira (Atualizado)', noCargo: 'Tech Lead' }, 
      },
    },
  })
  @ApiParam({ name: 'coContato', type: Number, description: 'ID do Contato' })
  async atualizar(
    @Param('coContato') id: number,
    @Body() dados: AtualizarContatoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Contatos>> {
    const idNumber = Number(id);
    const contatoAtualizada = await this.contatosService.atualizarContato(idNumber, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contato atualizado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: contatoAtualizada,
    };
  }

  @Delete(':coContato')
  @ApiOperation({ summary: 'Deleta um contato existente' })
  @ApiParam({ name: 'coContato', type: Number, description: 'ID do Contato' })
  async deletar(
    @Param('coContato') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    const idNumber = Number(id);
    await this.contatosService.deletarContato(idNumber);
    return {
      statusCode: HttpStatus.OK,
      message: 'Contato deletado com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }

}