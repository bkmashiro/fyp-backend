import { Module } from '@nestjs/common'
import { GeoCommentService } from './geo-comment.service'
import { GeoCommentController } from './geo-comment.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GeoComment } from './entities/geo-comment.entity'
import { CloudAnchorModule } from '../cloud-anchor/cloud-anchor.module'

@Module({
  imports: [TypeOrmModule.forFeature([GeoComment]), CloudAnchorModule],
  controllers: [GeoCommentController],
  providers: [GeoCommentService],
})
export class GeoCommentModule {}
