import { Module } from '@nestjs/common';
import { GeoObjectService } from './geo-object.service';
import { GeoObjectController } from './geo-object.controller';
import { GeoObjectGateway } from './geo-object.gateway';

@Module({
  imports: [],
  controllers: [GeoObjectController],
  providers: [GeoObjectService, GeoObjectGateway],
})
export class GeoObjectModule {}
