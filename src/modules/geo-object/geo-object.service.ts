import { Injectable } from '@nestjs/common'
import { CreateGeoObjectDto } from './dto/create-geo-object.dto'
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto'
import { GeoObject } from './entities/geo-object.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GeoObjectService {
  constructor() {}

  create(createGeoObjectDto: CreateGeoObjectDto) {
    return 'This action adds a new geoObject'
  }

  findAll() {
    return `This action returns all geoObject`
  }

  findOne(id: number) {
    return `This action returns a #${id} geoObject`
  }

  update(id: number, updateGeoObjectDto: UpdateGeoObjectDto) {
    return `This action updates a #${id} geoObject`
  }

  remove(id: number) {
    return `This action removes a #${id} geoObject`
  }

  async findObjectsInArea(
    lat: number,
    lon: number,
    alt: number,
    radius: number,
  ) {
    // const objects = await this.geoObjectRepository
    //   .createQueryBuilder('object')
    //   .where(
    //     `ST_DWithin(
    //       object.location::geography, 
    //       ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, 
    //       :radius
    //     )`,
    //     { lat, lon, alt, radius },
    //   )
    //   .getMany()

    // return objects
  }
}
