import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarServicoDto {
  @IsString()
  noServico: string;

  @IsBoolean()
  icSituacaoAtivo: boolean;
}

export class AtualizarServicoDto {
    @IsNumber()
    @Min(1)
    coServico: number;
  
    @IsString()
    noServico: string;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarServicoDto {
    @IsNumber()
    @Min(1)
    coServico: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coServico: number;
}

export class ServicoLeadDto {
    @IsNumber()
    @Min(1)
    coServico: number;
}
