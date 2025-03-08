import { Injectable } from '@nestjs/common';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoComment } from './entities/geo-comment.entity';
import { CloudAnchorService } from '../cloud-anchor/cloud-anchor.service';
@Injectable()
export class GeoCommentService {
  constructor(
    @InjectRepository(GeoComment)
    private readonly geoCommentRepository: Repository<GeoComment>,
    private readonly cloudAnchorService: CloudAnchorService,
  ) { }

  async create(createGeoCommentDto: CreateGeoCommentDto) {
    const geoComment = await GeoComment.create({
      ...createGeoCommentDto,
      cloudAnchor: await this.cloudAnchorService.findOne(createGeoCommentDto.cloudAnchorId),
    }).save()

    return geoComment
  }
}