import { DataSource } from 'typeorm';
import { Atribuicoes } from '../../src/modules/atribuicoes/atribuicoes.entity';

export async function seedAtribuicoes(dataSource: DataSource) {
  const repo = dataSource.getRepository(Atribuicoes);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Atribuições já existentes, seed ignorado.');
    return;
  }

  const atribuicoes = repo.create([
    // Tipo 1 – Atribuição por usuário único
    {
      coLead: 1,
      coAtribuido: 1, // co_usuario
      coTipoAtribuicao: 1,
      dtRegistro: new Date(),
    },
    // Tipo 2 – Atribuição por grupo
    {
      coLead: 1,
      coAtribuido: 1, // co_grupo
      coTipoAtribuicao: 2,
      dtRegistro: new Date(),
    },
    // Tipo 3 – Associação múltipla
    {
      coLead: 2,
      coAtribuido: 100, // id incremental único para vincular múltiplos usuários
      coTipoAtribuicao: 3,
      dtRegistro: new Date(),
    },
  ] as Atribuicoes[]);

  await repo.save(atribuicoes);
  console.log('Atribuições inseridas com sucesso!');
}
