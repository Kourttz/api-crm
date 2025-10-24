import { DataSource } from "typeorm";
import { Grupos } from "../modules/grupos/grupos.entity";

export async function seedGrupos(dataSource: DataSource) {
  const repo = dataSource.getRepository(Grupos);

  const existentes = await repo.count();
  if (existentes > 0) {
    console.log("Grupos já existentes, seed ignorado.");
    return;
  }

  const grupos = repo.create([
    { noGrupo: "Administração", coUsuarioDono: 1, icSituacaoAtivo: true },
    { noGrupo: "Desenvolvimento", coUsuarioDono: 1, coGrupoPai: 1, icSituacaoAtivo: true },
  ] as Grupos[]);

  await repo.save(grupos);
  console.log("Grupos inseridos com sucesso!");
}
