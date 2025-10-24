import { DataSource } from "typeorm";
import { seedContatos } from "./contatos.seed";
import { seedOrigens } from "./origens.seed";
import { seedLeads } from "./leads.seed";
import { seedServicos } from "./servicos.seed";
import { seedUsuarios } from "./usuarios.seed";
import { AppDataSource } from "../../data_source";
import { seedEmpresas } from "./empresas.seed";
import { seedGrupos } from "./grupos.seed";

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log("📦 Conexão com banco estabelecida!");

    await seedUsuarios(AppDataSource);
    await seedGrupos(AppDataSource);
    await seedEmpresas(AppDataSource);
    await seedContatos(AppDataSource);
    await seedOrigens(AppDataSource);
    await seedServicos(AppDataSource);
    await seedLeads(AppDataSource);

    console.log("✅ Seeds concluídos!");
    process.exit(0);
  } catch (err) {
    console.error("Erro ao executar seeds:", err);
    process.exit(1);
  }
}

runSeeds();
