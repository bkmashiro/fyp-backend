import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StatisticsService } from './statistics.service'
import { StatisticsController } from './statistics.controller'
import { Scene } from '@/modules/scene/entities/scene.entity'
import { GeoImage } from '@/modules/geo-image/entities/geo-image.entity'
import { GeoComment } from '@/modules/geo-comment/entities/geo-comment.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Scene, GeoImage, GeoComment])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {} 