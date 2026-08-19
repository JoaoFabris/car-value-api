import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config'; // ConfigModule: É o módulo responsável por carregar o arquivo .env para a memória da aplicação
// ConfigService É o serviço injetável que você usa dentro de suas classes (controllers, services, middlewares)
//  para obter os valores carregados sem precisar acessar diretamente o process.env.
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // isGlobal: true: Torna as configurações acessíveis em qualquer módulo da aplicação
      //  sem precisar reimportar o ConfigModule no UsersModule ou ReportsModule
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'better-sqlite3',
          database: config.get<string>('DB_NAME'),
          synchronize: true, // only for use in dev env, No migration files, no review step — it just does it.
          entities: [User, Report],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'better-sqlite3',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true, // only for use in dev env, No migration files, no review step — it just does it.
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // removes properties from the JSON that are not defined in our DTO
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log(
      'DB_NAME CARREGADO:',
      this.configService.get<string>('DB_NAME'),
    );
  }
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['asdwdawd'],
        }),
      )
      .forRoutes('*'); // now he is a global middleware
  }
}
