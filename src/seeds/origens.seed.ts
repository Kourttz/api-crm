import { DataSource } from 'typeorm';
import { Origens } from '../../src/modules/origens/origens.entity';

export async function seedOrigens(dataSource: DataSource) {
  const repo = dataSource.getRepository(Origens);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Origens já existentes, seed ignorado.');
    return;
  }

  const origens = repo.create([
    {
      noOrigem: 'Website (Formulário de Contato)',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noOrigem: 'Cold Call (Telefone)',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noOrigem: 'Indicação de Cliente',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noOrigem: 'Mídia Social (LinkedIn, etc.)',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
    {
      noOrigem: 'Evento / Feira',
      icSituacaoAtivo: true,
      dtRegistro: new Date(),
    },
  ] as Origens[]);

  await repo.save(origens);
  console.log('Origens inseridas com sucesso!');
}