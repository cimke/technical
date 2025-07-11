import { Options } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerModule, Params, PinoLogger } from 'nestjs-pino';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { RequestMethod } from '@nestjs/common';

import { AppOptions, CONFIG } from './config';
import { PlayerServiceImpl } from './domain/services/manager';
import { factory } from './framework/provider';
import { HealthCheckModule } from './infrastructure/health-check/module';
import { PlayerEntity } from './infrastructure/persistence/entities/player';
import { PlayerRepositoryImpl } from './infrastructure/persistence/repositories/player';
import { PlayerResolver } from './entrypoints/player.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ load: Object.values(CONFIG), isGlobal: true }),
    MikroOrmModule.forRoot({ ...(CONFIG.DB() as Options), registerRequestContext: false }),
    MikroOrmModule.forFeature({ entities: [PlayerEntity], contextName: 'MAIN' }),
    MikroOrmModule.forMiddleware(),
    LoggerModule.forRoot(CONFIG.LOGGER() as Params),
    HealthCheckModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
      path: '/graphiql',
    }),
  ],
  providers: [factory(PlayerServiceImpl, [PlayerRepositoryImpl]), PlayerResolver],
  controllers: [],
})
export class MainModule {
  static async run(): Promise<void> {
    const logger = new Logger(new PinoLogger(CONFIG.LOGGER() as Params), {});
    const options = CONFIG.APP() as AppOptions;

    try {
      const app = await NestFactory.create(MainModule, {
        bufferLogs: true,
        logger,
        cors: {
          origin: process.env.CORS_ORIGIN || '*',
          credentials: true,
        },
      });

      app.enableCors({ origin: options.allowedOrigins || false });
      // graphql does not register route name globally so middleware never gets applied if it's not excluded
      app.setGlobalPrefix(options.prefix, {
        exclude: [
          { path: '/', method: RequestMethod.GET },
          'graphiql',
        ],
      });
      app.useLogger(logger);
      app.flushLogs();

      app.enableShutdownHooks();

      await app.listen(options.port, options.host);
    } catch (error) {
      logger.error(`${MainModule.name}: failed`);
      logger.error(error);
      process.exit(1);
    }
  }
}

MainModule.run();
