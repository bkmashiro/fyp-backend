import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common'
import { GeoImageService } from './geo-image.service'
import { FileService } from '../file/file.service'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'

@Controller('geo-image')
export class GeoImageController {
  constructor(
    private readonly geoImageService: GeoImageService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  async create(@Body() createGeoImageDto: CreateGeoImageDto) {
    return await this.geoImageService.create(createGeoImageDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoImageService.findOne(parseInt(id))
  }
}
