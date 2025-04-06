import { Controller, Get } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  @ApiOperation({ summary: '获取系统统计数据' })
  @ApiResponse({ 
    status: 200, 
    description: '返回系统统计数据',
    schema: {
      type: 'object',
      properties: {
        cloudAnchorsCount: { type: 'number', description: 'Cloud Anchors 总数' },
        geoImagesCount: { type: 'number', description: 'Geo Images 总数' },
        geoCommentsCount: { type: 'number', description: 'Geo Comments 总数' },
      }
    }
  })
  getStatistics() {
    return this.statisticsService.getStatistics()
  }
} 