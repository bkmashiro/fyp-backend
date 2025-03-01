import { Injectable } from '@nestjs/common'
import { CreateGeoImageDto } from './dto/create-geo-image.dto'
import { UpdateGeoImageDto } from './dto/update-geo-image.dto'
import { File } from '../file/entities/file.entity'
import { GeoImage } from './entities/geo-image.entity'
import { FileService } from '../file/file.service'
import { QueryGeoImageDto } from './dto/query-geo-image-dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CloudAnchorService } from '../cloud-anchor/cloud-anchor.service'

@Injectable()
export class GeoImageService {
  constructor(
    private readonly fileService: FileService,
    @InjectRepository(GeoImage)
    private readonly geoImageRepository: Repository<GeoImage>,
    private readonly cloudAnchorService: CloudAnchorService,
  ) {}

  async create(createGeoImageDto: CreateGeoImageDto) {
    const file = await this.fileService.getFile(createGeoImageDto.ossFileId)

    const img = await GeoImage.create({
      ossFile: file,
      ...createGeoImageDto,
    }).save()

    console.log('img', img)

    return img
  }

  async findAll(query: QueryGeoImageDto) {
    const { page, limit } = query
    const [result, total] = await this.geoImageRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' }, // 根据需要进行排序
    })

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async findOne(id: string) {
    return await this.geoImageRepository.findOne({ where: { id } })
  }

  update(id: number, updateGeoImageDto: UpdateGeoImageDto) {
    return `This action updates a #${id} geoImage`
  }
}
