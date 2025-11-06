import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  Req,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';
import { AtribuicoesService } from './atribuicoes.service';
import { ResponseDto } from '../../common/filters/response.dto';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import {
  CriarAtribuicaoDto,
  AtualizarAtribuicaoDto,
  DeletarAtribuicaoDto,
} from './atribuicoes.dto';
import { Atribuicoes } from './atribuicoes.entity';

@ApiTags('Atribuições')
@Controller('atribuicoes')
export class AtribuicoesController {
  constructor(private readonly atribuicoesService: AtribuicoesService) {}

 
  @Get()
  @ApiOperation({ summary: 'Lista todas as atribuições registradas no sistema.' })
  async listar(@Req() request: Request): Promise<ResponseDto<Atribuicoes[]>> {
    const atribuicoes = await this.atribuicoesService.listarAtribuicoes();
    return {
      statusCode: HttpStatus.OK,
      message: 'Atribuições listadas com sucesso.',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: atribuicoes,
    };
  }


  @Get(':coAtribuicao')
  @ApiOperation({ summary: 'Obtém uma atribuição específica pelo seu ID.' })
  @ApiParam({
    name: 'coAtribuicao',
    type: Number,
    description: 'ID da atribuição que se deseja consultar.',
  })
  async obterPorId(
    @Param('coAtribuicao') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<Atribuicoes>> {
    const atribuicao = await this.atribuicoesService.obterPorId(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Atribuição obtida com sucesso.',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: atribuicao,
    };
  }

  
  @Post()
  @ApiOperation({
    summary: 'Cria uma nova atribuição de lead conforme o tipo configurado.',
  })
  @ApiBody({
    type: CriarAtribuicaoDto,
    examples: {
      exemploUsuarioUnico: {
        summary: 'Atribuição por usuário único',
        value: {
          coLead: 15,
          coTipoAtribuicao: 1, // tipo "Usuário único"
          coAtribuido: 102, // co_usuario da tabela gestao.tb_usuarios
        } as unknown as CriarAtribuicaoDto,
      },
      exemploGrupo: {
        summary: 'Atribuição por grupo',
        value: {
          coLead: 15,
          coTipoAtribuicao: 2, // tipo "Grupo"
          coAtribuido: 8, // co_grupo da tabela gestao.tb_grupos
        } as unknown as CriarAtribuicaoDto,
      },
      exemploAssociacao: {
        summary: 'Atribuição por associação (vários usuários)',
        value: {
          coLead: 15,
          coTipoAtribuicao: 3, // tipo "Associação"
          associacoes: [
            { coUsuario: 10 },
            { coUsuario: 12 },
            { coUsuario: 18 },
          ],
        },
      },
    },
  })
  async criar(
    @Body() dados: any,
    @Req() request: Request,
  ): Promise<ResponseDto<Atribuicoes | Atribuicoes[]>> {
    const atribuicao = await this.atribuicoesService.criarAtribuicao(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Atribuição criada com sucesso.',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: atribuicao
    };
  }


  @Patch(':coAtribuicao')
  @ApiOperation({ summary: 'Atualiza uma atribuição existente.' })
  @ApiParam({
    name: 'coAtribuicao',
    type: Number,
    description: 'ID da atribuição que será atualizada.',
  })
  @ApiBody({
    type: AtualizarAtribuicaoDto,
    examples: {
      exemploAtualizacao: {
        summary: 'Atualização básica de atribuição',
        value: {
          coLead: 20,
          coAtribuido: 105,
        } as unknown as AtualizarAtribuicaoDto,
      },
    },
  })
  async atualizar(
    @Param('coAtribuicao') id: number,
    @Body() dados: AtualizarAtribuicaoDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Atribuicoes>> {
    const dadosComId = { ...dados, coAtribuicao: id };
    const atualizada = await this.atribuicoesService.atualizarAtribuicao(
      id,
      dadosComId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Atribuição atualizada com sucesso.',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: atualizada,
    };
  }

 
  @Delete(':coAtribuicao')
  @ApiOperation({ summary: 'Remove uma atribuição existente.' })
  @ApiParam({
    name: 'coAtribuicao',
    type: Number,
    description: 'ID da atribuição que será removida.',
  })
  async deletar(
    @Param('coAtribuicao') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<null>> {
    await this.atribuicoesService.deletarAtribuicao(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Atribuição removida com sucesso.',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }
}
