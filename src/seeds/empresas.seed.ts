import { DataSource } from 'typeorm';
import { Empresas } from '../../src/modules/empresas/empresas.entity';

export async function seedEmpresas(dataSource: DataSource) {
  const repo = dataSource.getRepository(Empresas);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log('Empresas já existentes, seed ignorado.');
    return;
  }

  const empresas = repo.create([
    {
      noEmpresa: 'Tech Solutions SA',
      coCnpj: '00111222000133',
      coCep: '80010000',
      noEstado: 'PR',
      noCidade: 'Curitiba',
      noBairro: 'Centro',
      noEndereco: 'Rua das Flores',
      noNumero: '123',
      dtRegistro: new Date(),
    },
    {
      noEmpresa: 'InovaBR Consultoria',
      coCnpj: '11222333000144',
      coCep: '01000000',
      noEstado: 'SP',
      noCidade: 'São Paulo',
      noBairro: 'Sé',
      noEndereco: 'Avenida Brasil',
      noNumero: '456',
      noComplemento: 'Sala 100',
      dtRegistro: new Date(),
    },
  ] as Empresas[]);

  await repo.save(empresas);
  console.log('Empresas inseridas com sucesso!');
}