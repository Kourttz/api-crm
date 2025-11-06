import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ServicoLead } from '../servico_lead/servico_lead.entity'; 

@Entity({ name: 'tb_servicos' })
export class Servicos {
    @PrimaryGeneratedColumn({ name: 'co_servico', type: 'int' })
    coServico: number;

    @Column({ name: 'no_servico', type: 'varchar', length: 255 })
    noServico: string;

    @Column({ name: 'ic_situacao_ativo', type: 'boolean', default: true })
    icSituacaoAtivo: boolean;

    @CreateDateColumn({ name: 'dt_registro', type: 'date', default: () => 'CURRENT_DATE' })
    dtRegistro: Date;

    // Relação com a Tabela de Junção ServicoLead
    @OneToMany(() => ServicoLead, servicoLead => servicoLead.servico)
    servicoLead: ServicoLead[];
}