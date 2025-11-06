import { DataSource } from 'typeorm';
import { TipoAtribuicao } from '../../src/modules/tipo_atribuicao/tipo_atribuicao.entity';

export async function seedTipoAtribuicao(dataSource: DataSource) {
  const repo = dataSource.getRepository(TipoAtribuicao);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Tipos de atribuição já existentes, seed ignorado.');
    return;
  }

  const tipos = repo.create([
    {
      noTipoAtribuicao: 'Atribuição por Usuário Único',
      icSituacaoAtivo: true,
    },
    {
      noTipoAtribuicao: 'Atribuição por Grupo',
      icSituacaoAtivo: true,
    },
    {
      noTipoAtribuicao: 'Atribuição por Associação',
      icSituacaoAtivo: true,
    },
  ] as TipoAtribuicao[]);

  await repo.save(tipos);
  console.log('Tipos de atribuição inseridos com sucesso!');
}
