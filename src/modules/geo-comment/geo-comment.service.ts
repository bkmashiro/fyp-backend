import { Injectable } from '@nestjs/common';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';

@Injectable()
export class GeoCommentService {
  create(createGeoCommentDto: CreateGeoCommentDto) {
    return 'This action adds a new geoComment';
  }

  findAll() {
    return `This action returns all geoComment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoComment`;
  }

  update(id: number, updateGeoCommentDto: UpdateGeoCommentDto) {
    return `This action updates a #${id} geoComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoComment`;
  }
}
