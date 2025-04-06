import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Scene } from '@/modules/scene/entities/scene.entity'
import { GeoImage } from '@/modules/geo-image/entities/geo-image.entity'
import { GeoComment } from '@/modules/geo-comment/entities/geo-comment.entity'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    @InjectRepository(GeoImage)
    private geoImageRepository: Repository<GeoImage>,
    @InjectRepository(GeoComment)
    private geoCommentRepository: Repository<GeoComment>,
  ) {}

  async getStatistics() {
    const [cloudAnchorsCount, geoImagesCount, geoCommentsCount] = await Promise.all([
      this.sceneRepository.count(),
      this.geoImageRepository.count(),
      this.geoCommentRepository.count(),
    ])

    return {
      cloudAnchorsCount,
      geoImagesCount,
      geoCommentsCount,
    }
  }
} 