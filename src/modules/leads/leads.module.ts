import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { Leads } from './leads.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Leads])],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
