import { IsNumber, IsString, Min, IsOptional, IsEmail, Matches, Length } from 'class-validator';

export class CriarContatoDto {
  @IsString()
  noName: string;

  @IsOptional()
  @IsString()
  noCargo?: string;

  @IsOptional()
  @IsEmail()
  noEmail?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres.' })
  noTelefone?: string;
}

export class AtualizarContatoDto {
  @IsNumber()
  @Min(1)
  coContato: number;

  @IsOptional()
  @IsString()
  noName?: string;

  @IsOptional()
  @IsString()
  noCargo?: string;

  @IsOptional()
  @IsEmail()
  noEmail?: string;

  @IsOptional()
  @IsString()
  @Length(8, 20, { message: 'O telefone deve ter entre 8 e 20 caracteres.' })
  noTelefone?: string;
}

export class DeletarContatoDto {
  @IsNumber()
  @Min(1)
  coContato: number;
}

export class CriarContatoAninhadoDto extends CriarContatoDto {}