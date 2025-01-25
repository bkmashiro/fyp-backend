import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoCommentService } from './geo-comment.service';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';

@Controller('geo-comment')
export class GeoCommentController {
  constructor(private readonly geoCommentService: GeoCommentService) {}

  @Post()
  create(@Body() createGeoCommentDto: CreateGeoCommentDto) {
    return this.geoCommentService.create(createGeoCommentDto);
  }

  @Get()
  findAll() {
    return this.geoCommentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoCommentDto: UpdateGeoCommentDto) {
    return this.geoCommentService.update(+id, updateGeoCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoCommentService.remove(+id);
  }
}
