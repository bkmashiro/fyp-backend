import { Injectable } from '@nestjs/common'
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto'
import { GeoObject } from './entities/geo-object.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Raw, Repository, Between } from 'typeorm'
import { QueryGeoObjectDto } from './dto/query-geo-object.dto'

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

  async update(id: string, data: UpdateGeoObjectDto['data']) {
    const geoObject = await this.geoObjectRepository.findOne({
      where: { id },
      relations: ['cloudAnchor'],
    });
    
    if (!geoObject) {
      throw new Error('GeoObject not found');
    }

    // 确保GeoJSON格式正确
    if (data.relPosition && !data.relPosition.type) {
      data.relPosition = {
        type: 'Point',
        coordinates: data.relPosition.coordinates
      };
    }

    // 合并更新数据
    Object.assign(geoObject, data);
    
    return this.geoObjectRepository.save(geoObject);
  }

  findObjectsByAnchor(anchorId: string) {
    return this.geoObjectRepository.find({
      where: { cloudAnchor: { cloudAnchorId: anchorId } },
    })
  }

  async findObjectsInBounds(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
    type?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const queryBuilder = this.geoObjectRepository.createQueryBuilder('geoObject')
      .where('ST_Contains(ST_MakeEnvelope(:minLon, :minLat, :maxLon, :maxLat, 4326), geoObject.position)', {
        minLat,
        maxLat,
        minLon,
        maxLon,
      })
    .leftJoinAndSelect('geoObject.cloudAnchor', 'cloudAnchor')

    if (type) {
      queryBuilder.andWhere('geoObject.type = :type', { type })
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      limit,
      page,
      total,
      totalPages,
    }
  }

  async findAll(query: QueryGeoObjectDto) {
    const { page = 1, limit = 10, type } = query

    const queryBuilder = this.geoObjectRepository.createQueryBuilder('geoObject')
      .leftJoinAndSelect('geoObject.cloudAnchor', 'cloudAnchor')

    if (type) {
      queryBuilder.andWhere('geoObject.type = :type', { type })
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      limit,
      page,
      total,
      totalPages,
    }
  }
}
