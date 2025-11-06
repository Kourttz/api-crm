import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Atribuicoes } from '../atribuicoes/atribuicoes.entity';

@Entity({ name: 'tb_tipo_atribuicao' })
export class TipoAtribuicao {
  @PrimaryGeneratedColumn({ name: 'co_tipo_atribuicao', type: 'int' })
  coTipoAtribuicao: number;

  @Column({ name: 'no_tipo_atribuicao', type: 'varchar', length: 255 })
  noTipoAtribuicao: string;

  @Column({ name: 'ic_situacao_ativo', type: 'boolean', default: true })
  icSituacaoAtivo: boolean;

  @OneToMany(() => Atribuicoes, (at) => at.tipoAtribuicao)
  atribuicoes: Atribuicoes[];
}
