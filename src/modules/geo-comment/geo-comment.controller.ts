import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeoCommentService } from './geo-comment.service';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { QueryGeoCommentDto } from './dto/query-geo-comment.dto';

@Controller('geo-comment')
@ApiTags('geo-comment')
export class GeoCommentController {
  constructor(private readonly geoCommentService: GeoCommentService) {}

  @Post()
  async create(@Body() createGeoCommentDto: CreateGeoCommentDto) {
    return this.geoCommentService.create(createGeoCommentDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoCommentService.findOne(id)
  }

  @Get()
  @ApiQuery({ type: QueryGeoCommentDto })
  async findAll(@Query() query: QueryGeoCommentDto) {
    return this.geoCommentService.findAll(query)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.geoCommentService.delete(id)
  }
}
  