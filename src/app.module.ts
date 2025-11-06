import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LeadsModule } from './modules/leads/leads.module';
import { GruposModule } from './modules/grupos/grupos.module';
import { OrigensModule } from './modules/origens/origens.module';
import { EmpresasModule } from './modules/empresas/empresas.module';
import { ContatosModule } from './modules/contatos/contatos.module';
import { ServicosModule } from './modules/servicos/servicos.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { GrupoUsuarioModule } from './modules/grupo_usuario/grupo_usuario.module';
import { AtribuicoesModule } from './modules/atribuicoes/atribuicoes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      logging: false,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      migrations: [__dirname + '/migrations/*{.js,.ts}']
    }),

    LeadsModule,
    GruposModule,
    OrigensModule,
    EmpresasModule,
    ContatosModule,
    ServicosModule,
    UsuariosModule,
    AtribuicoesModule,
    GrupoUsuarioModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
