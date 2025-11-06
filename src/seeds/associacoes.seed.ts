import { DataSource } from 'typeorm';
import { Associacoes } from '../../src/modules/associacoes/associacoes.entity';

export async function seedAssociacoes(dataSource: DataSource) {
  const repo = dataSource.getRepository(Associacoes);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Associações já existentes, seed ignorado.');
    return;
  }

  const associacoes = repo.create([
    {
      coUsuario: 1,
      coAtribuido: 100,
      dtRegistro: new Date(),
    },
    {
      coUsuario: 2,
      coAtribuido: 100,
      dtRegistro: new Date(),
    },
  ] as Associacoes[]);

  await repo.save(associacoes);
  console.log('Associações inseridas com sucesso!');
}
