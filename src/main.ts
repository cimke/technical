import { Options } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Logger, LoggerModule, Params, PinoLogger } from 'nestjs-pino';

import { AppOptions, CONFIG } from './config';
import { PlayerServiceImpl } from './domain/services/manager';
import { factory } from './framework/provider';
import { HealthCheckModule } from './infrastructure/health-check/module';
import { PlayerEntity } from './infrastructure/persistence/entities/player';
import { PlayerRepositoryImpl } from './infrastructure/persistence/repositories/player';

@Module({
  imports: [
    ConfigModule.forRoot({ load: Object.values(CONFIG), isGlobal: true }),
    MikroOrmModule.forRoot({ ...(CONFIG.DB() as Options), registerRequestContext: false }),
    MikroOrmModule.forFeature({ entities: [PlayerEntity], contextName: 'MAIN' }),
    MikroOrmModule.forMiddleware(),
    LoggerModule.forRoot(CONFIG.LOGGER() as Params),
    HealthCheckModule,
  ],
  providers: [factory(PlayerServiceImpl, [PlayerRepositoryImpl])],
  controllers: [],
})
export class MainModule {
  static async run(): Promise<void> {
    const logger = new Logger(new PinoLogger(CONFIG.LOGGER() as Params), {});
    const options = CONFIG.APP() as AppOptions;

    try {
      const app = await NestFactory.create(MainModule, {
        // Maybe something goes here
      });

      app.enableCors({ origin: options.allowedOrigins || false });
      // graphql does not register route name globally so middleware never gets applied if it's not excluded
      app.setGlobalPrefix(options.prefix, { exclude: ['graphql'] });
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
