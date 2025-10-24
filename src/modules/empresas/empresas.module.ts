import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { Empresas } from './empresas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresas])],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresasModule {}
