import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { File } from './entities/file.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { resolve } from 'path'

@Injectable()
export class FileService {
  private readonly uploadPath: string

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {
    const _path = configService.getOrThrow('UPLOAD_PATH')
    // 创建上传文件夹
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path)
    }

    this.uploadPath = _path

    this.checkAndCleanupFiles()
  }

  async saveFile(file: Express.Multer.File) {
    // console.log('file', file)
    const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`
    const filePath = path.join(this.uploadPath, uniqueSuffix)

    // 存储文件到指定路径
    try {
      const fs = require('fs')
      fs.writeFileSync(filePath, file.buffer)
    } catch (error) {
      throw new HttpException(
        'File upload failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    // 存储文件信息到数据库
    const fileEntity = await this.fileRepository.save({
      key: uniqueSuffix,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    })

    return {
      url: `/files/${uniqueSuffix}`,
      key: uniqueSuffix,
      file: fileEntity,
    }
  }

  async getFile(key: string) {
    return await this.fileRepository.findOne({ where: { key } })
  }

  accessFilePath(key: string): string {
    const filePath = resolve(path.join(this.uploadPath, key))
    // console.log('filePath', filePath)
    if (!fs.existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND)
    }
    return filePath
  }

  async checkAndCleanupFiles() {
    const files = await this.fileRepository.find()
    const cleanupPromises = files.map(async (file) => {
      const filePath = resolve(path.join(this.uploadPath, file.key))
      if (!fs.existsSync(filePath)) {
        // 如果文件不存在，从数据库中删除记录
        await this.fileRepository.remove(file)
        return file
      }
      return null
    })

    const removedFiles = (await Promise.all(cleanupPromises)).filter(Boolean)

    Logger.debug(`Checked ${files.length} files, removed ${removedFiles.length} files`)
    return {
      totalChecked: files.length,
      removedCount: removedFiles.length,
      removedFiles
    }
  }

}
