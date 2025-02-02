import { Module } from '@nestjs/common';
import { GeoObjectService } from './geo-object.service';
import { GeoObjectController } from './geo-object.controller';

@Module({
  imports: [],
  controllers: [GeoObjectController],
  providers: [GeoObjectService],
})
export class GeoObjectModule {}
