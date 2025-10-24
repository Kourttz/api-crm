import { DataSource } from 'typeorm';
import { Servicos } from '../../src/modules/servicos/servicos.entity';

export async function seedServicos(dataSource: DataSource) {
  const repo = dataSource.getRepository(Servicos);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Serviços já existentes, seed ignorado.');
    return;
  }

  const servicos = repo.create([
    {
      noServico: 'Desenvolvimento de Software Customizado',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noServico: 'Consultoria em Cloud Computing (AWS/Azure)',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noServico: 'Suporte e Manutenção de Sistemas Legados',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noServico: 'Treinamento e Capacitação Técnica',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
  ] as Servicos[]);

  await repo.save(servicos);
  console.log('Serviços inseridos com sucesso!');
}