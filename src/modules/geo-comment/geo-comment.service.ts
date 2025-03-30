import { Injectable } from '@nestjs/common';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeoComment } from './entities/geo-comment.entity';
import { CloudAnchorService } from '../cloud-anchor/cloud-anchor.service';
import { QueryGeoCommentDto } from './dto/query-geo-comment.dto';

@Injectable()
export class GeoCommentService {
  constructor(
    @InjectRepository(GeoComment)
    private readonly geoCommentRepository: Repository<GeoComment>,
    private readonly cloudAnchorService: CloudAnchorService,
  ) { }

  async create(createGeoCommentDto: CreateGeoCommentDto) {
    const geoComment = await GeoComment.create({
      ...createGeoCommentDto,
      cloudAnchor: await this.cloudAnchorService.findOne(createGeoCommentDto.cloudAnchorId),
    }).save()

    return geoComment
  }

  async findAll(query: QueryGeoCommentDto) {
    const { page, limit } = query
    const [result, total] = await this.geoCommentRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
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
    return await this.geoCommentRepository.findOne({ where: { id } })
  }

  async delete(id: string) {
    const geoComment = await this.geoCommentRepository.findOne({ where: { id } })
    if (!geoComment) {
      throw new Error('GeoComment not found')
    }
    await this.geoCommentRepository.delete(id)
    return geoComment
  }

  async findByCloudAnchorId(cloudAnchorId: number, query: QueryGeoCommentDto) {
    const { page, limit } = query
    const [result, total] = await this.geoCommentRepository.findAndCount({
      where: { cloudAnchor: { id: cloudAnchorId } },
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
      relations: ['cloudAnchor'],
    })

    return {
      data: result,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async update(id: string, updateGeoCommentDto: UpdateGeoCommentDto) {
    const geoComment = await this.geoCommentRepository.findOne({ where: { id } })
    if (!geoComment) {
      throw new Error('GeoComment not found')
    }

    Object.assign(geoComment, updateGeoCommentDto)
    return await this.geoCommentRepository.save(geoComment)
  }

  async getStatistics(cloudAnchorId: number) {
    const total = await this.geoCommentRepository.count({
      where: { cloudAnchor: { id: cloudAnchorId } }
    })

    const recentComments = await this.geoCommentRepository.find({
      where: { cloudAnchor: { id: cloudAnchorId } },
      order: { createdAt: 'DESC' },
      take: 5,
      relations: ['cloudAnchor'],
    })

    return {
      total,
      recentComments,
    }
  }
}