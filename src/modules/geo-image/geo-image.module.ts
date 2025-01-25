import { Module } from '@nestjs/common';
import { GeoImageService } from './geo-image.service';
import { GeoImageController } from './geo-image.controller';

@Module({
  controllers: [GeoImageController],
  providers: [GeoImageService],
})
export class GeoImageModule {}
