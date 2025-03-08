import { Body, Controller, Post } from '@nestjs/common';
import { WatermarkService } from './watermark.service';
import { CreateWatermarkDto } from './dto/CreateWatermark.dto';
import { ExtractWatermarkDto } from './dto/ExtractWatermark.dto';
import { FileService } from '../file/file.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Watermark')
@Controller('watermark')
export class WatermarkController {
  constructor(private readonly watermarkService: WatermarkService, private readonly fileService: FileService) { }

  @Post('create')
  async createWatermark(@Body() body: CreateWatermarkDto) {
    return this.watermarkService.createWatermark(body);
  }

  @Post('extract')
  async extractWatermark(@Body() body: ExtractWatermarkDto) {
    return this.watermarkService.extractWatermark(
      this.fileService.accessFilePath(body.fileKey),
      body.watermarkLength,
      {
        passwordImg: body.passwordImg,
        passwordWm: body.passwordWm
      }
    );
  }
}
