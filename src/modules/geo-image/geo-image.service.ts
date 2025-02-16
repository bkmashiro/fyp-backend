import { Injectable } from '@nestjs/common'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'
import { UpdateGeoImageDto } from './dto/update-geo-image.dto'
import { File } from '../file/entities/file.entity'
import { GeoImage } from './entities/geo-image.entity'
import { FileService } from '../file/file.service'

@Injectable()
export class GeoImageService {
  constructor(private readonly fileService: FileService) {}

  async create(createGeoImageDto: CreateGeoImageDto) {
    const file = await this.fileService.getFile(createGeoImageDto.ossFileId)

    return await GeoImage.create({
      ossFile: file,
      ...createGeoImageDto,
    }).save()
  }

  findAll() {
    return `This action returns all geoImage`
  }

  findOne(id: number) {
    return `This action returns a #${id} geoImage`
  }

  update(id: number, updateGeoImageDto: UpdateGeoImageDto) {
    return `This action updates a #${id} geoImage`
  }

  remove(id: number) {
    return `This action removes a #${id} geoImage`
  }
}
