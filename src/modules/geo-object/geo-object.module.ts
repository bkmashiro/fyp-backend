import { Module } from '@nestjs/common'
import { GeoObjectService } from './geo-object.service'
import { GeoObjectController } from './geo-object.controller'
import { GeoObjectGateway } from './geo-object.gateway'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeoObject } from './entities/geo-object.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GeoObject])],
  controllers: [GeoObjectController],
  providers: [GeoObjectService, GeoObjectGateway],
})
export class GeoObjectModule {}
