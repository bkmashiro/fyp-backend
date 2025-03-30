import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { CloudAnchorService } from './cloud-anchor.service'
import { CreateCloudAnchorDto } from './dto/create-cloud-anchor.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('cloud-anchor')
@Controller('cloud-anchor')
export class CloudAnchorController {
  constructor(private readonly cloudAnchorService: CloudAnchorService) {}

  @Get('range/:lat/:lon/:radius')
  findCloudAnchorObjectsInArea(
    @Param('lat') lat: string,
    @Param('lon') lon: string,
    @Param('radius') radius: string,
  ) {
    return this.cloudAnchorService.findAnchorsInArea(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius),
    )
  }

  @Post()
  createCloudAnchor(@Body() createCloudAnchorDto: CreateCloudAnchorDto) {
    return this.cloudAnchorService.create(createCloudAnchorDto)
  }
  
  @Get()
  async findAllAnchors(
    @Query('pageSize') pageSize?: string,
    @Query('page') page?: string,
  ) {
    return this.cloudAnchorService.findAll(
      pageSize ? parseInt(pageSize) : undefined,
      page ? parseInt(page) : undefined,
    )
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.cloudAnchorService.findOne(id)
  }

  @Get('list')
  async listAnchors(
    @Query('pageSize') pageSize?: string,
    @Query('nextPageToken') nextPageToken?: string,
  ) {
    return this.cloudAnchorService.listAnchors(
      pageSize ? parseInt(pageSize) : undefined,
      nextPageToken,
    )
  }

  @Get(':anchorId')
  async getAnchor(@Param('anchorId') anchorId: string) {
    return this.cloudAnchorService.getAnchor(anchorId)
  }

  @Patch(':anchorId/expire-time')
  async updateAnchorExpireTime(
    @Param('anchorId') anchorId: string,
    @Body('expireTime') expireTime: string,
  ) {
    return this.cloudAnchorService.updateAnchorExpireTime(anchorId, expireTime)
  }

  @Delete(':anchorId')
  async deleteAnchor(@Param('anchorId') anchorId: string) {
    return this.cloudAnchorService.deleteAnchor(anchorId)
  }
}
