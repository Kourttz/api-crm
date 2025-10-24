import { DataSource } from 'typeorm';
import { Leads } from '../../src/modules/leads/leads.entity';
import { ServicoLead } from '../../src/modules/servico_lead/servico_lead.entity'; 

export async function seedLeads(dataSource: DataSource) {
  const leadsRepo = dataSource.getRepository(Leads);
  const servicoLeadRepo = dataSource.getRepository(ServicoLead);

  if (await leadsRepo.count() > 0) {
    console.log('Leads já existentes, seed ignorado.');
    return;
  }

  // Assumindo que os seeders de Contatos e Origens foram executados
  // E que o ID 1, 2, 3 existem para Contato e ID 1, 2 para Origem.
  const leads = [
    {
      coContato: 3, // João Silva
      coOrigem: 1, // Website
      dtCaptacao: new Date('2024-01-10'),
      noObservacao: 'Interessado em soluções customizadas para e-commerce.',
      coUsuarioCreate: 2, // Assumindo um usuário administrador
      dtCreate: new Date(),
      servicos: [1, 2], // IDs de Serviço: Customizado e Cloud
    },
    {
      coContato: 2, // Maria Souza
      coOrigem: 3, // Indicação
      dtCaptacao: new Date('2024-02-05'),
      noObservacao: 'Busca por treinamento técnico avançado em NestJS.',
      coUsuarioCreate: 2,
      dtCreate: new Date(),
      servicos: [4], // ID de Serviço: Treinamento
    },
  ];

  for (const leadData of leads) {
    const { servicos, ...leadPura } = leadData;

    // Salva a Lead
    const newLead = leadsRepo.create(leadPura as Leads);
    const leadSalva = await leadsRepo.save(newLead);

    // Salva os relacionamentos (ServicoLead)
    const relacoesServicos = servicos.map(coServico => servicoLeadRepo.create({
      coServico: coServico,
      coLead: leadSalva.coLead,
      dtRegistro: new Date(),
    }));
    await servicoLeadRepo.save(relacoesServicos);
  }

  console.log('Leads e ServicoLeads inseridos com sucesso!');
}