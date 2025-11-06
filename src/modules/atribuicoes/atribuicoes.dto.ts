import {
    IsInt,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
    Min,
  } from 'class-validator';
  
  export class CriarAtribuicaoDto {
    @IsInt()
    @Min(1)
    coLead: number;
  
    @IsInt()
    @Min(1)
    coTipoAtribuicao: number;
  
    @IsOptional()
    @IsInt()
    @Min(1)
    coUsuario?: number; // usado para tipo 1
  
    @IsOptional()
    @IsInt()
    @Min(1)
    coGrupo?: number; // usado para tipo 2
  
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    usuarios?: number[]; // usado para tipo 3
  }
  
  export class AtualizarAtribuicaoDto {
    @IsInt()
    @Min(1)
    coAtribuicao: number;
  
    @IsOptional()
    @IsInt()
    coLead?: number;
  
    @IsOptional()
    @IsInt()
    coAtribuido?: number;
  }
  
  export class DeletarAtribuicaoDto {
    @IsInt()
    @Min(1)
    coAtribuicao: number;
  }
  