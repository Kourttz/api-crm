import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateLeadsSchema1678820000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. tb_contatos
    await queryRunner.createTable(
      new Table({
        name: "tb_contatos",
        columns: [
          { name: "co_contato", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_name", type: "varchar", isNullable: true },
          { name: "no_cargo", type: "varchar", isNullable: true },
          { name: "no_email", type: "varchar", isNullable: true },
          { name: "no_telefone", type: "varchar", isNullable: true },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 2. tb_empresas
    await queryRunner.createTable(
      new Table({
        name: "tb_empresas",
        columns: [
          { name: "co_empresa", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_empresa", type: "varchar", isNullable: true },
          { name: "co_cnpj", type: "varchar", isNullable: true },
          { name: "co_cep", type: "varchar", isNullable: true },
          { name: "no_estado", type: "varchar", isNullable: true },
          { name: "no_cidade", type: "varchar", isNullable: true },
          { name: "no_bairro", type: "varchar", isNullable: true },
          { name: "no_endereco", type: "varchar", isNullable: true },
          { name: "no_numero", type: "varchar", isNullable: true },
          { name: "no_complemento", type: "varchar", isNullable: true },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 3. tb_origens
    await queryRunner.createTable(
      new Table({
        name: "tb_origens",
        columns: [
          { name: "co_origem", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_origem", type: "varchar", isNullable: true },
          { name: "ic_situacao_ativo", type: "boolean", default: true },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 4. tb_servicos
    await queryRunner.createTable(
      new Table({
        name: "tb_servicos",
        columns: [
          { name: "co_servico", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_servico", type: "varchar", isNullable: true },
          { name: "ic_situacao_ativo", type: "boolean", default: true },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 5. tb_leads
    await queryRunner.createTable(
      new Table({
        name: "tb_leads",
        columns: [
          { name: "co_lead", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_contato", type: "int" },
          { name: "co_origem", type: "int" },
          { name: "dt_captacao", type: "date", isNullable: true },
          { name: "no_observacao", type: "varchar", isNullable: true },
          { name: "co_usuario_create", type: "int", isNullable: true },
          { name: "dt_create", type: "timestamp", default: "CURRENT_TIMESTAMP" },
          { name: "co_usuario_edit", type: "int", isNullable: true },
          { name: "dt_edit", type: "timestamp", isNullable: true },
        ],
      }),
    );

    // 6. tb_empresa_contato
    await queryRunner.createTable(
      new Table({
        name: "tb_empresa_contato",
        columns: [
          { name: "co_empresa_contato", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_empresa", type: "int" },
          { name: "co_contato", type: "int" },
          { name: "co_lead", type: "int" },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 7. tb_servico_lead
    await queryRunner.createTable(
      new Table({
        name: "tb_servico_lead",
        columns: [
          { name: "co_servico_lead", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_servico", type: "int" },
          { name: "co_lead", type: "int" },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 8. tb_tipo_atribuicao
    await queryRunner.createTable(
      new Table({
        name: "tb_tipo_atribuicao",
        columns: [
          { name: "co_tipo_atribuicao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_tipo_atribuicao", type: "varchar", isNullable: false },
          { name: "ic_situacao_ativo", type: "boolean", default: true },
        ],
      }),
    );

    // 9. tb_atribuicoes
    await queryRunner.createTable(
      new Table({
        name: "tb_atribuicoes",
        columns: [
          { name: "co_atribuicao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_lead", type: "int" },
          { name: "co_atribuido", type: "int" },
          { name: "co_tipo_atribuicao", type: "int" },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // 10. tb_associacoes
    await queryRunner.createTable(
      new Table({
        name: "tb_associacoes",
        columns: [
          { name: "co_associacao", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_usuario", type: "int" },
          { name: "co_atribuido", type: "int" },
          { name: "dt_registro", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        ],
      }),
    );

    // Schema gestao
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS gestao`);

    // 11. gestao.tb_usuarios
    await queryRunner.createTable(
      new Table({
        name: "gestao.tb_usuarios",
        columns: [
          { name: "co_usuario", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_name", type: "varchar", isNullable: true },
          { name: "co_matricula", type: "varchar", isNullable: true },
          { name: "no_email", type: "varchar", isNullable: true },
          { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
          { name: "co_perfil", type: "int", isNullable: true },
          { name: "nu_filial", type: "int", isNullable: true },
        ],
      }),
    );

    // 12. gestao.tb_grupos
    await queryRunner.createTable(
      new Table({
        name: "gestao.tb_grupos",
        columns: [
          { name: "co_grupo", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "no_grupo", type: "varchar", isNullable: true },
          { name: "co_usuario_dono", type: "int", isNullable: true },
          { name: "co_grupo_pai", type: "int", isNullable: true },
          { name: "ic_situacao_ativo", type: "boolean", isNullable: true },
        ],
      }),
    );

    // 13. gestao.tb_grupo_usuario
    await queryRunner.createTable(
      new Table({
        name: "gestao.tb_grupo_usuario",
        columns: [
          { name: "co_grupo_usuario", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "co_grupo", type: "int" },
          { name: "co_usuario", type: "int" },
        ],
      }),
    );

    // === FOREIGN KEYS ===

    // tb_leads
    await queryRunner.createForeignKeys("tb_leads", [
      new TableForeignKey({
        columnNames: ["co_contato"],
        referencedTableName: "tb_contatos",
        referencedColumnNames: ["co_contato"],
      }),
      new TableForeignKey({
        columnNames: ["co_origem"],
        referencedTableName: "tb_origens",
        referencedColumnNames: ["co_origem"],
      }),
    ]);

    // tb_empresa_contato
    await queryRunner.createForeignKeys("tb_empresa_contato", [
      new TableForeignKey({
        columnNames: ["co_empresa"],
        referencedTableName: "tb_empresas",
        referencedColumnNames: ["co_empresa"],
      }),
      new TableForeignKey({
        columnNames: ["co_contato"],
        referencedTableName: "tb_contatos",
        referencedColumnNames: ["co_contato"],
      }),
      new TableForeignKey({
        columnNames: ["co_lead"],
        referencedTableName: "tb_leads",
        referencedColumnNames: ["co_lead"],
      }),
    ]);

    // tb_servico_lead
    await queryRunner.createForeignKeys("tb_servico_lead", [
      new TableForeignKey({
        columnNames: ["co_servico"],
        referencedTableName: "tb_servicos",
        referencedColumnNames: ["co_servico"],
      }),
      new TableForeignKey({
        columnNames: ["co_lead"],
        referencedTableName: "tb_leads",
        referencedColumnNames: ["co_lead"],
      }),
    ]);

    // tb_atribuicoes
    await queryRunner.createForeignKeys("tb_atribuicoes", [
      new TableForeignKey({
        columnNames: ["co_lead"],
        referencedTableName: "tb_leads",
        referencedColumnNames: ["co_lead"],
      }),
      new TableForeignKey({
        columnNames: ["co_tipo_atribuicao"],
        referencedTableName: "tb_tipo_atribuicao",
        referencedColumnNames: ["co_tipo_atribuicao"],
      }),
    ]);

    // gestao.tb_grupo_usuario
    await queryRunner.createForeignKeys("gestao.tb_grupo_usuario", [
      new TableForeignKey({
        columnNames: ["co_grupo"],
        referencedTableName: "gestao.tb_grupos",
        referencedColumnNames: ["co_grupo"],
      }),
      new TableForeignKey({
        columnNames: ["co_usuario"],
        referencedTableName: "gestao.tb_usuarios",
        referencedColumnNames: ["co_usuario"],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("tb_associacoes");
    await queryRunner.dropTable("tb_atribuicoes");
    await queryRunner.dropTable("tb_tipo_atribuicao");
    await queryRunner.dropTable("tb_servico_lead");
    await queryRunner.dropTable("tb_empresa_contato");
    await queryRunner.dropTable("tb_leads");
    await queryRunner.dropTable("gestao.tb_grupo_usuario");
    await queryRunner.dropTable("gestao.tb_grupos");
    await queryRunner.dropTable("gestao.tb_usuarios");
    await queryRunner.dropTable("tb_servicos");
    await queryRunner.dropTable("tb_origens");
    await queryRunner.dropTable("tb_empresas");
    await queryRunner.dropTable("tb_contatos");
  }
}
