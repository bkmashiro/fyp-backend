import { Module } from '@nestjs/common'
import { GeoImageService } from './geo-image.service'
import { GeoImageController } from './geo-image.controller'
import { FileModule } from '../file/file.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeoImage } from './entities/geo-image.entity'
import { CloudAnchorModule } from '../cloud-anchor/cloud-anchor.module'

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([GeoImage]),
    CloudAnchorModule,
  ],
  controllers: [GeoImageController],
  providers: [GeoImageService],
  exports: [GeoImageService],
})
export class GeoImageModule {}
