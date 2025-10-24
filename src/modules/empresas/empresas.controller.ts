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
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  CriarEmpresaDto,
  AtualizarEmpresaDto,
  BuscarEmpresaPorCnpjDto,
} from './empresas.dto';
import { EmpresasService } from './empresas.service';
import { Empresas } from './empresas.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';
import { Length } from 'class-validator';

@ApiTags('Empresas')
@UseFilters(HttpExceptionFilter)
@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresasService: EmpresasService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as Empresas' })
  async listar(@Req() request: Request): Promise<ResponseDto<Empresas[]>> {
    const empresas = await this.empresasService.listarEmpresas();
    return {
      statusCode: HttpStatus.OK,
      message: 'Empresas listadas com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: empresas,
    };
  }
  
  @Get(':cnpj')
  @ApiOperation({ summary: 'Busca uma empresa pelo CNPJ' })
  @ApiParam({ 
    name: 'cnpj', 
    type: String, 
    description: 'CNPJ da empresa (apenas 14 dígitos, sem formatação)', 
    example: '12345678901234' 
  })
  async buscarPorCnpj(
    @Param() params: BuscarEmpresaPorCnpjDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Empresas>> {
    
    const empresa = await this.empresasService.buscarEmpresaPorCnpj(params.cnpj);

    return {
      statusCode: HttpStatus.OK,
      message: 'Empresa encontrada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: empresa,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova empresa' })
  @ApiBody({
    type: CriarEmpresaDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de criação',
        value: {
          noEmpresa: 'Nova Empresa Ltda',
          coCnpj: '12345678000100', 
          coCep: '12345678',
          noEstado: 'SP',
          noCidade: 'São Paulo',
          noBairro: 'Centro',
          noEndereco: 'Rua Principal',
          noNumero: '100',
        },
      },
    },
  })
  async criar(
    @Body() dados: CriarEmpresaDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Empresas>> {
    const empresa = await this.empresasService.criarEmpresa(dados);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Empresa criada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: empresa,
    };
  }

  @Patch(':coEmpresa') 
  @ApiOperation({ summary: 'Atualiza uma empresa existente' })
  @ApiBody({
    type: AtualizarEmpresaDto,
    examples: {
      exemplo: {
        summary: 'Exemplo de atualização',
        value: { noEmpresa: 'Empresa Atualizada Ltda', noBairro: 'Jardim' },
      },
    },
  })
  @ApiParam({ name: 'coEmpresa', type: Number, description: 'ID da Empresa' })
  async atualizar(
    @Param('coEmpresa') id: number, 
    @Body() dados: AtualizarEmpresaDto,
    @Req() request: Request,
  ): Promise<ResponseDto<Empresas>> {
    const idNumber = Number(id); 
    const empresaAtualizada = await this.empresasService.atualizarEmpresa(idNumber, dados);
    return {
      statusCode: HttpStatus.OK,
      message: 'Empresa atualizada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: empresaAtualizada,
    };
  }

  @Delete(':coEmpresa') 
  @ApiOperation({ summary: 'Deleta uma empresa existente' })
  @ApiParam({ name: 'coEmpresa', type: Number, description: 'ID da Empresa' })
  async deletar(
    @Param('coEmpresa') id: number,
    @Req() request: Request,
  ): Promise<ResponseDto<void>> {
    await this.empresasService.deletarEmpresa(Number(id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Empresa deletada com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
    };
  }
}