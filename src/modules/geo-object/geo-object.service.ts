import { Injectable } from '@nestjs/common'
import { CreateGeoObjectDto } from './dto/create-geo-object.dto'
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto'
import { GeoObject } from './entities/geo-object.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Raw, Repository } from 'typeorm'

@Injectable()
export class GeoObjectService {
  constructor(
    @InjectRepository(GeoObject)
    private geoObjectRepository: Repository<GeoObject>,
  ) {}

  create(createGeoObjectDto: CreateGeoObjectDto) {
    return 'This action adds a new geoObject'
  }

  findAll() {
    return `This action returns all geoObject`
  }

  findOne(id: string) {
    return this.geoObjectRepository.findOne({
      where: { id },
    })
  }

  update(id: number, updateGeoObjectDto: UpdateGeoObjectDto) {
    return `This action updates a #${id} geoObject`
  }

  remove(id: number) {
    return `This action removes a #${id} geoObject`
  }

  async findObjectsInArea(lat: number, lon: number, radius: number) {
    console.log('lat', lat)
    console.log('lon', lon)
    console.log('radius', radius)
    return this.geoObjectRepository.find({
      where: {
        position: Raw(
          (alias) =>
            `ST_DWithin(${alias}, ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), ${radius})`,
        ),
      },
    })
  }
}
