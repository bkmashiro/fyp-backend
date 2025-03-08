import { Controller, Get, Post, Body, Param, Query, Delete } from '@nestjs/common'
import { GeoImageService } from './geo-image.service'
import { FileService } from '../file/file.service'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'
import { QueryGeoImageDto } from './dto/query-geo-image-dto'
import { ApiQuery, ApiTags } from '@nestjs/swagger'

@Controller('geo-image')
@ApiTags('geo-image')
export class GeoImageController {
  constructor(
    private readonly geoImageService: GeoImageService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async createGeoImage(@Body() createGeoImageDto: CreateGeoImageDto) {
    return await this.geoImageService.create(createGeoImageDto)
  }

  @Get(':id')
  findOneGeoImage(@Param('id') id: string) {
    return this.geoImageService.findOne(id)
  }

  @Get()
  @ApiQuery({ type: QueryGeoImageDto })
  async findAllGeoImages(@Query() query: QueryGeoImageDto) {
    // console.log('query', query)
    return this.geoImageService.findAll(query)
  }

  @Delete(':id')
  async deleteGeoImage(@Param('id') id: string) {
    return this.geoImageService.delete(id)
  }
}
