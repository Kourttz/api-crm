import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrigensController } from './origens.controller';
import { OrigensService } from './origens.service';
import { Origens } from './origens.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Origens])],
  controllers: [OrigensController],
  providers: [OrigensService],
})
export class OrigensModule {}
