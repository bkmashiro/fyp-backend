import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeoImageService } from './geo-image.service';
import { CreateGeoImageDto } from './dto/create-geo-image.dto';
import { UpdateGeoImageDto } from './dto/update-geo-image.dto';

@Controller('geo-image')
export class GeoImageController {
  constructor(private readonly geoImageService: GeoImageService) {}

  @Post()
  create(@Body() createGeoImageDto: CreateGeoImageDto) {
    return this.geoImageService.create(createGeoImageDto);
  }

  @Get()
  findAll() {
    return this.geoImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeoImageDto: UpdateGeoImageDto) {
    return this.geoImageService.update(+id, updateGeoImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoImageService.remove(+id);
  }
}
