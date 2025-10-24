import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { Servicos } from './servicos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Servicos])],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}
