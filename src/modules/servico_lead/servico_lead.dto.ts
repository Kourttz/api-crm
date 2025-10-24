import { IsNumber, Min } from 'class-validator';

/**
 * DTO para representar um único serviço a ser associado à Lead.
 * Usada dentro de um array no CriarLeadDto.
 */
export class ServicoLeadDto {
  @IsNumber()
  @Min(1)
  coServico: number;
}