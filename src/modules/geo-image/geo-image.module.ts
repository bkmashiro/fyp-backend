import { Module } from '@nestjs/common';
import { GeoImageService } from './geo-image.service';
import { GeoImageController } from './geo-image.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  controllers: [GeoImageController],
  providers: [GeoImageService],
})
export class GeoImageModule {}
