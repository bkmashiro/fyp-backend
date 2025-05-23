import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Response } from 'express'
import { ApiTags } from '@nestjs/swagger'
import { resolve } from 'path';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST)
    }

    return this.fileService.saveFile(file)
  }

  @Get(':key')
  getFile(@Param('key') key: string, @Res() res: Response) {
    console.log('key', key)
    const filePath = this.fileService.accessFilePath(key)

    console.log('filePath', filePath, resolve(filePath))

    return res.sendFile(resolve(filePath))
  }
}
