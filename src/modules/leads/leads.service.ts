import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Leads } from './leads.entity';
import { CriarLeadDto, AtualizarLeadDto } from './leads.dto'; 
import { Contatos } from '../contatos/contatos.entity'; 
import { Empresas } from '../empresas/empresas.entity'; 
import { EmpresaContato } from '../empresa_contato/empresa_contato.entity'; 
import { ServicoLead } from '../servico_lead/servico_lead.entity'; 


@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Leads)
    private readonly leadsRepository: Repository<Leads>,
    private dataSource: DataSource, 
  ) {}

  /**
   * Lista todas as Leads.
   */
  async listarLeads(): Promise<Leads[]> {
    return this.leadsRepository.find();
  }

  /**
   * Cria uma nova Lead, Contato, Empresa e seus relacionamentos em uma transação.
   * Garante que se uma parte falhar, todas as outras são desfeitas (rollback).
   * * @param dados Dados complexos para criar Lead, Contato, Empresa e Serviços.
   */   
  async criarLead(dados: CriarLeadDto): Promise<Leads> {

    // 1. Inicia o QueryRunner e a Transação
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Desestrutura o DTO para separar os dados das entidades
      const { contato: dadosContato, empresa: dadosEmpresa, servicos, ...dadosLeadPuros } = dados;

      // 2. CRIAR CONTATO (tb_contatos)
      const contatoRepo = queryRunner.manager.getRepository(Contatos);
      const novoContato = contatoRepo.create(dadosContato);
      const contatoSalvo = await contatoRepo.save(novoContato);

      // 3. CRIAR EMPRESA (tb_empresas)
      const empresaRepo = queryRunner.manager.getRepository(Empresas);
      const novaEmpresa = empresaRepo.create({ ...dadosEmpresa}); 
      const empresaSalva = await empresaRepo.save(novaEmpresa);

      // 4. CRIAR RELACIONAMENTO EMPRESA_CONTATO (tb_empresa_contato)
      const empresaContatoRepo = queryRunner.manager.getRepository(EmpresaContato);
      const relEmpresaContato = empresaContatoRepo.create({
         coEmpresa: empresaSalva.coEmpresa,
         coContato: contatoSalvo.coContato,
      });
      await empresaContatoRepo.save(relEmpresaContato);
      
      // 5. CRIAR LEAD (tb_leads)
      const leadsRepo = queryRunner.manager.getRepository(Leads);
      const leadCriada = leadsRepo.create({
        ...dadosLeadPuros,
        coContato: contatoSalvo.coContato, // Vincula o coContato recém-criado
      });
      const leadSalva = await leadsRepo.save(leadCriada);

      // 6. CRIAR RELACIONAMENTO SERVICO_LEAD (tb_servico_lead)
      if (servicos && servicos.length > 0) {
        const servicoLeadRepo = queryRunner.manager.getRepository(ServicoLead);
        
        // Mapeia os DTOs de Serviço para a Entity de Junção
        const relacoesServicos = servicos.map(s => servicoLeadRepo.create({
            coServico: s.coServico,
            coLead: leadSalva.coLead,
        }));
        // Salva todos os relacionamentos de uma vez
        await servicoLeadRepo.save(relacoesServicos);
      }
      
      // 7. Confirma a Transação se tudo ocorreu bem
      await queryRunner.commitTransaction();
      return leadSalva;

    } catch (error) {
      // 8. Desfaz a Transação em caso de erro
      await queryRunner.rollbackTransaction();
      console.error('Erro na transação de criação de Lead:', error);
      throw new HttpException(
        'Erro ao criar Lead, Contato e entidades relacionadas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // 9. Libera o QueryRunner, independentemente do sucesso ou falha
      await queryRunner.release();
    }
  }

  /**
   * Atualiza a lead existente.
   * @param id ID da lead a ser atualizada (@Param no controller)
   * @param dados DTO de atualização (@Body no controller)
   */ 
  async atualizarLead(id: number, dados: AtualizarLeadDto): Promise<Leads> {
    
    // Remove coLead do DTO para passar apenas dados de atualização para o update
    const { coLead, ...dadosParaUpdate } = dados; 

    const resultado = await this.leadsRepository.update(id, dadosParaUpdate as any);

    if (resultado.affected === 0) {
      throw new HttpException(
        'Lead não encontrada para atualização',
        HttpStatus.NOT_FOUND,
      );
    }

    const leadAtualizada = await this.leadsRepository.findOneBy({ coLead: id });

    if (!leadAtualizada) {
      throw new HttpException(
        'Erro ao recuperar lead após atualização',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return leadAtualizada;
  }
  
  /**
   * Deleta uma lead existente.
   * @param id ID da lead a ser deletada
   */
  async deletarLead(id: number): Promise<void> {
    
    const resultado = await this.leadsRepository.delete(id);

    if (resultado.affected === 0) {
      throw new HttpException(
        'Lead não encontrada para exclusão',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}