import { Module } from '@nestjs/common';
import { GeoImageService } from './geo-image.service';
import { GeoImageController } from './geo-image.controller';
import { FileModule } from '../file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeoImage } from './entities/geo-image.entity';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([GeoImage])],
  controllers: [GeoImageController],
  providers: [GeoImageService],
})
export class GeoImageModule {}
