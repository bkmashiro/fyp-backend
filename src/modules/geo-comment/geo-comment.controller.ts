import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoCommentService } from './geo-comment.service';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('geo-comment')
@ApiTags('geo-comment')
export class GeoCommentController {
  constructor(private readonly geoCommentService: GeoCommentService) {}

  @Post()
  async create(@Body() createGeoCommentDto: CreateGeoCommentDto) {
    return this.geoCommentService.create(createGeoCommentDto)
  }
}
  