import { IsNumber, IsString, IsBoolean, Min } from 'class-validator';

export class CriarGrupoDto {
    @IsString()
    noGrupo: string;

    @IsBoolean()
    icSituacaoAtivo: boolean;
    
    @IsNumber()
    @Min(1)
    coGrupoPai?: number;

    @IsNumber()
    @Min(1)
    coUsuarioDono: number;
}

export class AtualizarGrupoDto {
    @IsNumber()
    @Min(1)
    coGrupo: number;
  
    @IsString()
    noGrupo: string;

    @IsNumber()
    @Min(1)
    coGrupoPai?: number;

    @IsNumber()
    @Min(1)
    coUsuarioDono: number;
  
    @IsBoolean()
    icSituacaoAtivo: boolean;
}

export class DeletarGrupoDto {
    @IsNumber()
    @Min(1)
    coGrupo: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coGrupo: number;
}
