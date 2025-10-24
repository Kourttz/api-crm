import { DataSource } from 'typeorm';
import { Contatos } from '../../src/modules/contatos/contatos.entity';

export async function seedContatos(dataSource: DataSource) {
  const repo = dataSource.getRepository(Contatos);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Contatos já existentes, seed ignorado.');
    return;
  }

  const contatos = repo.create([
    {
      noName: 'João Silva',
      noCargo: 'CEO',
      noEmail: 'joao.silva@tech.com',
      noTelefone: '41998765432',
      dtRegistro: new Date(),
    },
    {
      noName: 'Maria Souza',
      noCargo: 'Gerente de TI',
      noEmail: 'maria.souza@inovabr.com',
      noTelefone: '11987654321',
      dtRegistro: new Date(),
    },
    {
      noName: 'Pedro Santos',
      noCargo: 'Diretor Comercial',
      noEmail: 'pedro.santos@globalcorp.com',
      noTelefone: '21912345678',
      dtRegistro: new Date(),
    },
  ] as Contatos[]);

  await repo.save(contatos);
  console.log('Contatos inseridos com sucesso!');
}