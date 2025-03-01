import { Injectable } from '@nestjs/common'
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

  findOne(id: string) {
    return this.geoObjectRepository.findOne({
      where: { id },
    })
  }

  async findObjectsInArea(lat: number, lon: number, radius: number) {
    return this.geoObjectRepository.find({
      where: {
        position: Raw(
          (alias) =>
            `ST_DWithin(${alias}, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radius)`,
          { lat, lon, radius },
        ),
      },
    })
  }

  async update(id: string, updateGeoObjectDto: UpdateGeoObjectDto) {
    return this.geoObjectRepository.update(id, updateGeoObjectDto)
  }
}
