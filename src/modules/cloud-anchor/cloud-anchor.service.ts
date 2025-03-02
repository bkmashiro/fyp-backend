import { Injectable } from '@nestjs/common'
import { CreateCloudAnchorDto } from './dto/create-cloud-anchor.dto'
import { UpdateCloudAnchorDto } from './dto/update-cloud-anchor.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Raw, Repository } from 'typeorm'
import { CloudAnchor } from './entities/cloud-anchor.entity'

@Injectable()
export class CloudAnchorService {

  constructor(
    @InjectRepository(CloudAnchor)
    private readonly cloudAnchorRepository: Repository<CloudAnchor>,
  ) { }

  create(createCloudAnchorDto: CreateCloudAnchorDto) {
    console.log('createCloudAnchorDto', createCloudAnchorDto) 
    return CloudAnchor.create({
      ...createCloudAnchorDto,
      anchor: {
        type: 'Point',
        coordinates: createCloudAnchorDto.anchorPosition,
      },
    }).save()
  }

  async findAnchorsInArea(lat: number, lon: number, radius: number) {
    return this.cloudAnchorRepository.find({
      where: {
        anchor: Raw(
          (alias) =>
            `ST_DWithin(${alias}, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radius)`,
          { lat, lon, radius },
        ),
      },
    })
  }

  findOne(cloudAnchorId: string) {
    return this.cloudAnchorRepository.findOne({
      where: {
        cloudAnchorId,
      },
    })
  }
}
