import { IsNumber, IsString, Min, IsOptional, IsDateString, Length, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer'; 
import { CriarContatoAninhadoDto } from '../contatos/contatos.dto';
import { CriarEmpresaAninhadoDto } from '../empresas/empresas.dto';
import { ServicoLeadDto } from '../servico_lead/servico_lead.dto';

export class CriarLeadDto {
    @ValidateNested()
    @Type(() => CriarContatoAninhadoDto)
    contato: CriarContatoAninhadoDto;
  
    @ValidateNested()
    @Type(() => CriarEmpresaAninhadoDto)
    empresa: CriarEmpresaAninhadoDto;
  
    @IsNumber()
    @Min(1)
    coOrigem: number;
  
    @IsOptional()
    @IsDateString() 
    @Type(() => Date)
    dtCaptacao?: Date;
  
    @IsOptional()
    @IsString()
    @Length(0, 500)
    noObservacao?: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServicoLeadDto)
    servicos: ServicoLeadDto[];
  
    @IsNumber()
    @Min(1)
    coUsuarioCreate: number;
  }

export class AtualizarLeadDto {
    @IsNumber()
    @Min(1)
    coLead: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    coContato?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    coOrigem?: number;

    @IsOptional()
    @IsDateString()
    @Type(() => Date) 
    dtCaptacao?: Date; 

    @IsOptional()
    @IsString()
    @Length(0, 500)
    noObservacao?: string;
    
    @IsNumber()
    @Min(1)
    coUsuarioEdit: number; 

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ServicoLeadDto)
    servicos?: ServicoLeadDto[];
}

export class DeletarLeadDto {
    @IsNumber()
    @Min(1)
    coLead: number;
}