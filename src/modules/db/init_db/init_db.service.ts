import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class InitDbService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly connection: DataSource,
    private readonly config: ConfigService,
  ) {}

  logger = new Logger('InitDbService')

  async onModuleInit() {
    // check if postgis & postgis-raster is enabled
    const extensions = await this.connection.query(
      'SELECT * FROM pg_extension;',
    )
    const postgis = extensions.find((ext: any) => ext.extname === 'postgis')
    if (!postgis) {
      this.logger.error('请先在数据库中安装 PostGIS 扩展')
      throw new Error('PostGIS is not enabled.')
    }
    // const postgis_raster = extensions.find(
    //   (ext: any) => ext.extname === 'postgis_raster',
    // )
    // if (!postgis_raster) {
    //   this.logger.error('请先在数据库中安装 PostGIS Raster 扩展')
    //   throw new Error('PostGIS Raster is not enabled.')
    // }

    //TODO disable this in production
    // await this.connection.query(
    //   `ALTER DATABASE ${this.config.getOrThrow('DB_DATABASE')} SET postgis.enable_outdb_rasters = true;`,
    // )
    // await this.connection.query(
    //   `ALTER DATABASE ${this.config.getOrThrow('DB_DATABASE')} SET postgis.gdal_enabled_drivers = 'ENABLE_ALL'`,
    // )

    Logger.log('PostGIS Initialized', 'DbConnInit')
  }
}
