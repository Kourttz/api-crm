import { IsNumber, IsString, IsBoolean, Min, IsOptional, Length } from 'class-validator';

export class CriarEmpresaDto {
  @IsString()
  noEmpresa: string;

  @IsString()
  @Length(14, 14, { message: 'O CNPJ deve ter 14 caracteres.' })
  coCnpj: string;

  @IsString()
  @Length(8, 8, { message: 'O CEP deve ter 8 caracteres.' })
  coCep: string;

  @IsString()
  noEstado: string;

  @IsString()
  noCidade: string;

  @IsString()
  noBairro: string;

  @IsString()
  noEndereco: string;

  @IsString()
  noNumero: string;

  @IsOptional()
  @IsString()
  noComplemento?: string;
  
}

export class AtualizarEmpresaDto {
    @IsNumber()
    @Min(1)
    coEmpresa: number;
  
    @IsOptional()
    @IsString()
    noEmpresa?: string;
    
    @IsOptional()
    @IsString()
    @Length(14, 14, { message: 'O CNPJ deve ter 14 caracteres.' })
    coCnpj?: string;

    @IsOptional()
    @IsString()
    @Length(8, 8, { message: 'O CEP deve ter 8 caracteres.' })
    coCep?: string;
  
    @IsOptional()
    @IsString()
    noEstado?: string;
  
    @IsOptional()
    @IsString()
    noCidade?: string;
  
    @IsOptional()
    @IsString()
    noBairro?: string;
  
    @IsOptional()
    @IsString()
    noEndereco?: string;
  
    @IsOptional()
    @IsString()
    noNumero?: string;
  
    @IsOptional()
    @IsString()
    noComplemento?: string;
    
    @IsOptional()
    @IsBoolean()
    icSituacaoAtivo?: boolean; 
}

export class DeletarEmpresaDto {
    @IsNumber()
    @Min(1)
    coEmpresa: number;
}

export class AlternarStatusDto {
    @IsNumber()
    @Min(1)
    coEmpresa: number;
}

export class BuscarEmpresaPorCnpjDto {
    @IsString()
    @Length(14, 14, { message: 'O CNPJ deve ter 14 caracteres.' })
    cnpj: string;
}

export class CriarEmpresaAninhadoDto extends CriarEmpresaDto {}