import {
  Controller,
  Get,
  UseFilters,
  HttpStatus,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from './usuarios.entity';
import { ResponseDto } from '../../common/filters/response.dto';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
import { Request } from 'express';

@ApiTags('Usuarios')
@UseFilters(HttpExceptionFilter)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os Usuários' })
  async listar(@Req() request:Request): Promise<ResponseDto<Usuarios[]>> {
    const usuarios = await this.usuariosService.listarUsuarios();
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuários listados com sucesso',
      timestamp: getGMT3Timestamp(),
      path: request.url,
      data: usuarios
    };
  }

}
