import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ImageCopyright, CopyrightStatus } from './entities/image-copyright.entity'
import { GeoImage } from '@/modules/geo-image/entities/geo-image.entity'

@Injectable()
export class ImageCopyrightService {
  constructor(
    @InjectRepository(ImageCopyright)
    private readonly imageCopyrightRepository: Repository<ImageCopyright>,
  ) {}

  async create(geoImage: GeoImage, userId: string, imageHash: string) {
    return this.imageCopyrightRepository.save({
      geoImage,
      userId,
      imageHash,
      status: CopyrightStatus.PENDING,
    })
  }

  async updateStatus(
    id: string,
    status: CopyrightStatus,
    transactionHash?: string,
    blockchainInfo?: any,
  ) {
    return this.imageCopyrightRepository.update(id, {
      status,
      transactionHash,
      blockchainInfo,
    })
  }

  async findByGeoImageId(geoImageId: string) {
    return this.imageCopyrightRepository.findOne({
      where: { geoImage: { id: geoImageId } },
      relations: ['geoImage'],
    })
  }

  async findByImageHash(imageHash: string) {
    return this.imageCopyrightRepository.find({
      where: { imageHash },
      relations: ['geoImage'],
    })
  }

  async findByUserId(userId: string) {
    return this.imageCopyrightRepository.find({
      where: { userId },
      relations: ['geoImage'],
    })
  }

  async findRegisteredByImageHash(imageHash: string) {
    return this.imageCopyrightRepository.find({
      where: {
        imageHash,
        status: CopyrightStatus.REGISTERED,
      },
      relations: ['geoImage'],
    })
  }

  async getCopyrightInfo(geoImageId: string) {
    const record = await this.imageCopyrightRepository.findOne({
      where: { geoImage: { id: geoImageId } },
      relations: ['geoImage'],
    })

    if (!record) {
      return null
    }

    return {
      id: record.id,
      imageHash: record.imageHash,
      userId: record.userId,
      status: record.status,
      transactionHash: record.transactionHash,
      blockchainInfo: record.blockchainInfo,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }
  }
} 