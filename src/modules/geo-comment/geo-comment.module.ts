import { Module } from '@nestjs/common';
import { GeoCommentService } from './geo-comment.service';
import { GeoCommentController } from './geo-comment.controller';

@Module({
  controllers: [GeoCommentController],
  providers: [GeoCommentService],
})
export class GeoCommentModule {}
