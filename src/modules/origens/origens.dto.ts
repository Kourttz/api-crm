import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarOrigemDto {
  @IsString()
  noOrigem: string;

  @IsBoolean()
  icSituacaoAtivo: boolean;
}

export class AtualizarOrigemDto {
    @IsNumber()
    @Min(1)
    coOrigem: number;
  
    @IsString()
    noOrigem: string;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarOrigemDto {
    @IsNumber()
    @Min(1)
    coOrigem: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coOrigem: number;
}
