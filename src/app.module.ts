import { Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AutoEntitiesModule } from './modules/auto-entities/auto-entities.module'
import { AuthModule } from './modules/auth/auth.module'
import { AccessControlModule } from 'nest-access-control'
import { roles } from './app.role'
import { RoleModule } from './modules/role/role.module'
import { FasterCrudModule } from './modules/faster-crud/faster-crud.module'
import { DataSource } from 'typeorm'
import { TestModule } from './modules/test/test.module'
import { InitDbService } from './modules/db/init_db/init_db.service'
import { FileModule } from './modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConsensusModule } from './modules/consensus/consensus.module';
import { GeoObjectModule } from './modules/geo-object/geo-object.module';
import { GeoImageModule } from './modules/geo-image/geo-image.module';
import { GeoCommentModule } from './modules/geo-comment/geo-comment.module';
import { StoryboardModule } from './modules/storyboard/storyboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env', '.env.production']
          : ['.env', '.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      // @ts-ignore dont know why sometimes this is not working
      useFactory: async (config: ConfigService) => {
        return {
          // @ts-ignore
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          database: config.get('DB_DATABASE'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          synchronize: config.get('DB_SYNC'),
          autoLoadEntities: true,
          timezone: '+00:00',
          logging: true,
          providers: [InitDbService],
          // installExtensions: ['postgis', 'postgis_raster'],
          maxQueryExecutionTime: 1000,
          poolSize: 10,
          extra: {
            max: 16,
            min: 1,
          },
        }
      },
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options)
        // @ts-ignore TypeORM does not support but the database supports
        dataSource.driver.supportedDataTypes.push('raster')
        await dataSource.initialize()

        return dataSource
      },

    }),
    AccessControlModule.forRoles(roles),
    AutoEntitiesModule.forRootAsync(),
    UserModule,
    AuthModule,
    RoleModule,
    FasterCrudModule,
    TestModule,
    FileModule,
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ([{
        rootPath: config.get('UPLOAD_PATH'),
      }])
    }),
    FileModule,
    ConsensusModule,
    GeoObjectModule,
    GeoImageModule,
    GeoCommentModule,
    StoryboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, InitDbService],
})
export class AppModule {}
