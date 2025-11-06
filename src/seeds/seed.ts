import { DataSource } from "typeorm";
import { seedContatos } from "./contatos.seed";
import { seedOrigens } from "./origens.seed";
import { seedLeads } from "./leads.seed";
import { seedServicos } from "./servicos.seed";
import { seedUsuarios } from "./usuarios.seed";
import { seedEmpresas } from "./empresas.seed";
import { seedGrupos } from "./grupos.seed";
import { seedTipoAtribuicao } from "./tipo_atribuicao.seed";  
import { seedAtribuicoes } from "./atribuicoes.seed";   
import { seedAssociacoes } from "./associacoes.seed";        
import { AppDataSource } from "../../data_source";

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
    await seedTipoAtribuicao(AppDataSource);
    await seedAtribuicoes(AppDataSource);
    await seedAssociacoes(AppDataSource);

    console.log("✅ Seeds concluídos com sucesso!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro ao executar seeds:", err);
    process.exit(1);
  }
}

runSeeds();
