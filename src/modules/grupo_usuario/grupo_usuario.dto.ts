import { IsArray, IsNumber, ArrayNotEmpty, IsOptional, IsBoolean, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CoUsuariosDto {
  @ApiProperty({
    description: 'Lista de IDs dos usuários que serão vinculados ao grupo. Pode ser um array vazio para desvincular todos.',
    type: [Number],
    example: [1, 2, 3, 4],
    required: false
  })
  @IsOptional() 
  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada elemento de coUsuarios deve ser um número inteiro.' })
  coUsuarios: number[] = [];
}

export class IdGrupoListUsuariosDto {
  @IsNumber()
  @Min(1)
  coGrupo: number;

  @IsBoolean()
  isRequired: boolean;
}

export class GrupoUsuarioResponseDto {
    id: string;
    label: string;
    section: string;
    path: string;
    icon: string | undefined;
    featureKey: string;
}


export class GrupoComUsuariosDto {
    coGrupo: number;
    noGrupo: string;
    usuarios: { coUsuario: number, noName: string }[];
}