import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GeoCommentService } from './geo-comment.service';
import { CreateGeoCommentDto } from './dto/create-geo-comment.dto';
import { UpdateGeoCommentDto } from './dto/update-geo-comment.dto';
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { QueryGeoCommentDto } from './dto/query-geo-comment.dto';

@Controller('geo-comment')
@ApiTags('geo-comment')
export class GeoCommentController {
  constructor(private readonly geoCommentService: GeoCommentService) {}

  @Post()
  @ApiOperation({ summary: '创建地理评论' })
  async createComment(@Body() createGeoCommentDto: CreateGeoCommentDto) {
    return this.geoCommentService.create(createGeoCommentDto)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个评论' })
  findOneComment(@Param('id') id: string) {
    return this.geoCommentService.findOne(id)
  }

  @Get()
  @ApiQuery({ type: QueryGeoCommentDto })
  @ApiOperation({ summary: '分页查询评论列表' })
  async findAllComments(@Query() query: QueryGeoCommentDto) {
    return this.geoCommentService.findAll(query)
  }

  @Get('cloud-anchor/:cloudAnchorId')
  @ApiQuery({ type: QueryGeoCommentDto })
  @ApiOperation({ summary: '按云锚点ID查询评论' })
  async findCommentsByCloudAnchorId(
    @Param('cloudAnchorId') cloudAnchorId: number,
    @Query() query: QueryGeoCommentDto,
  ) {
    return this.geoCommentService.findByCloudAnchorId(cloudAnchorId, query)
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新评论' })
  async updateComment(
    @Param('id') id: string,
    @Body() updateGeoCommentDto: UpdateGeoCommentDto,
  ) {
    return this.geoCommentService.update(id, updateGeoCommentDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Param('id') id: string) {
    return this.geoCommentService.delete(id)
  }

  @Get('cloud-anchor/:cloudAnchorId/statistics')
  @ApiOperation({ summary: '获取评论统计信息' })
  async getStatisticsByCloudAnchorId(@Param('cloudAnchorId') cloudAnchorId: number) {
    return this.geoCommentService.getStatistics(cloudAnchorId)
  }
}
  