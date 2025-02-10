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
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from '../file/file.service'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'

@Controller('geo-image')
export class GeoImageController {
  constructor(
    private readonly geoImageService: GeoImageService,
    private readonly fileService: FileService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST)
    }

    const { file: ossFile } = await this.fileService.saveFile(file)

    return this.geoImageService.create(ossFile, JSON.parse(body.body)) //TODO Add error handling
  }
}
