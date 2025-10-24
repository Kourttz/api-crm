  import {
    Controller,
    Get,
    UseFilters,
    Req,
    Param, 
    ParseIntPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
  import { GrupoUsuarioService } from './grupo_usuario.service';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  
  @ApiTags('Grupos Usuarios')
  @UseFilters(HttpExceptionFilter)
  @Controller('gu')
  export class GrupoUsuarioController {
      constructor(
          private readonly grupoUsuarioService: GrupoUsuarioService,
      ) {}
  
      @Get() 
      @ApiOperation({ summary: 'Lista todos os grupos e seus usuários aninhados.' })
      async listarTodosGrupos(@Req() request: Request): Promise<ResponseDto<any>> {
          const data = await this.grupoUsuarioService.listarTodosGruposComUsuarios();
          return {
              statusCode: 200,
              message: 'Grupos e usuários listados com sucesso.',
              timestamp: getGMT3Timestamp(),
              path: request.url,
              data, 
          };
      }
  
      @Get(':coGrupo') 
      @ApiOperation({ summary: 'Lista todos os usuários de um grupo específico.' })
      @ApiParam({
          name: 'coGrupo',
          description: 'ID do Grupo.',
          required: true,
          type: Number,
      })
      async listarUsuariosDeUmGrupo(
          @Req() request: Request,
          @Param('coGrupo', ParseIntPipe) coGrupo: number,
      ): Promise<ResponseDto<any>> {
          const data = await this.grupoUsuarioService.listarUsuariosPorGrupo(coGrupo);
          return {
              statusCode: 200,
              message: `Usuários do Grupo ${coGrupo} listados com sucesso.`,
              timestamp: getGMT3Timestamp(),
              path: request.url,
              data, 
          };
      }
  }