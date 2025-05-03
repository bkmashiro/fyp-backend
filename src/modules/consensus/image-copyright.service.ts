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
    // 将16进制字符串转换为bit(64)
    const bitHash = this.hexToBit(imageHash);
    return this.imageCopyrightRepository.save({
      geoImage,
      userId,
      imageHash: bitHash,
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
    const bitHash = this.hexToBit(imageHash);
    const maxDistance = Math.floor(64 * (1 - 0.6)); // 固定使用0.6的相似度阈值

    const results = await this.imageCopyrightRepository
      .createQueryBuilder('imageCopyright')
      .select("*")
      .addSelect([
        `(1 - (bit_count(imageCopyright.imageHash # B'${bitHash}')::float / 64)) as similarity`
      ])
      .where(`bit_count(imageCopyright.imageHash # B'${bitHash}') <= :maxDistance`, {
        maxDistance,
      })
      .getRawAndEntities();

    return results.entities.map((entity, index) => ({
      ...entity,
      similarity: parseFloat(results.raw[index].similarity)
    }));
  }

  async findByUserId(userId: string) {
    return this.imageCopyrightRepository.find({
      where: { userId },
      relations: ['geoImage'],
    })
  }

  async findRegisteredByImageHash(imageHash: string) {
    const bitHash = this.hexToBit(imageHash);
    // console.log('Querying with bit hash:', bitHash);
    const threshold = Math.floor(64 * (1 - 0.6)); // 固定使用0.6的相似度阈值

    const queryResults = await this.imageCopyrightRepository
      .createQueryBuilder("imageCopyright")
      .leftJoinAndSelect("imageCopyright.geoImage", "geoImage")
      .addSelect("bit_count(imageCopyright.imageHash # B'" + bitHash + "')", "hamming_distance")
      .addSelect("1 - (bit_count(imageCopyright.imageHash # B'" + bitHash + "')::float / 64)", "similarity")
      .where("bit_count(imageCopyright.imageHash # B'" + bitHash + "') <= :threshold", { threshold })
      .orderBy("similarity", "DESC")
      .getRawAndEntities();

    // console.log('Query results:', queryResults.entities.length);
    return queryResults.entities.map((entity, index) => ({
      ...entity,
      similarity: parseFloat(queryResults.raw[index].similarity)
    }));
  }

  // async findSimilarRegisteredImages(imageHash: string, threshold: number = 0.95) {
  //   const bitHash = this.hexToBit(imageHash);
  //   const maxDistance = Math.floor(64 * (1 - threshold)); // 计算最大允许的汉明距离

  //   return this.imageCopyrightRepository
  //     .createQueryBuilder('copyright')
  //     .where('copyright.status = :status', { status: CopyrightStatus.REGISTERED })
  //     .andWhere(`bit_count(copyright.imageHash # :bitHash) <= :maxDistance`, {
  //       bitHash,
  //       maxDistance,
  //     })
  //     .leftJoinAndSelect('copyright.geoImage', 'geoImage')
  //     .getMany();
  // }

  private hexToBit(hex: string): string {
    // 将16进制字符串转换为bit(64)
    const binary = parseInt(hex, 16).toString(2).padStart(64, '0');
    return binary;
  }

  private bitToHex(bit: string): string {
    // 将bit(64)转换为16进制字符串
    return parseInt(bit, 2).toString(16).padStart(16, '0');
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

  async findGeoImagesByMessagePrefix(prefix: string) {
    if (prefix.length > 7) {
      prefix = prefix.substring(0, 7);
    }
    return this.imageCopyrightRepository
      .createQueryBuilder('copyright')
      .leftJoinAndSelect('copyright.geoImage', 'geoImage')
      .where('copyright.messagePrefix LIKE :prefix', { prefix: `${prefix}%` })
      .getMany()
      .then(records => records.map(record => record.geoImage));
  }

  async updateMessage(id: string, message: string, messagePrefix: string) {
    return this.imageCopyrightRepository.update(id, {
      message,
      messagePrefix,
    });
  }
} 