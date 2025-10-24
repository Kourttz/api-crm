import {
    Controller,
    Get,
    UseFilters,
    HttpStatus,
    Req,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation} from '@nestjs/swagger';
  import { GruposService } from './grupos.service';
  import { Grupos } from './grupos.entity';
  import { ResponseDto } from '../../common/filters/response.dto';
  import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
  import { getGMT3Timestamp } from '../../common/utils/timestamp.util';
  import { Request } from 'express';
  
  @ApiTags('Grupos')
  @UseFilters(HttpExceptionFilter)
  @Controller('grupos')
  export class GruposController {
    constructor(private readonly gruposService: GruposService) {}
  
    @Get()
    @ApiOperation({ summary: 'Lista todos os Grupos' })
    async listar(@Req() request: Request): Promise<ResponseDto<Grupos[]>> {
      const grupos = await this.gruposService.listarGrupos();
      return {
        statusCode: HttpStatus.OK,
        message: 'Grupos listados com sucesso',
        timestamp: getGMT3Timestamp(),
        path: request.url,
        data: grupos,
      };
    }
  }
  