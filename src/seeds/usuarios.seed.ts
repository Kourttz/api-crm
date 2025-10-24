import { DataSource, DeepPartial } from "typeorm";
import { Usuarios } from "../modules/usuarios/usuarios.entity";

export async function seedUsuarios(dataSource: DataSource) {
  const repo = dataSource.getRepository(Usuarios);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log("Usuarios já existentes, seed ignorado.");
    return;
  }

  const usuarios = repo.create([
  {
    noName: "Renato Vinicius Amorim Bittencourt Silva",
    coMatricula: "129891",
    noEmail: "teste@gmail.com",
    icSituacaoAtivo: true,
    coPerfil: 1 ,
  },
  {
    noName: "Noan Caliel Brostt",
    coMatricula: "123036",
    noEmail: "teste2@gmail.com",
    icSituacaoAtivo: true,
    coPerfil: 2 ,
  },
] as DeepPartial<Usuarios>[]);

  await repo.save(usuarios);
  console.log("Usuarios inseridos com sucesso!");
}
