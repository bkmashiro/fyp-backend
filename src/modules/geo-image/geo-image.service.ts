import { Injectable } from '@nestjs/common'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'
import { UpdateGeoImageDto } from './dto/update-geo-image.dto'
import { File } from '../file/entities/file.entity'
import { GeoImage } from './entities/geo-image.entity'

@Injectable()
export class GeoImageService {
  async create(file: File, createGeoImageDto: CreateGeoImageDto) {
    console.log({
      ossFile: file,
      ...createGeoImageDto,
    })
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
