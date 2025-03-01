import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { CloudAnchorService } from './cloud-anchor.service'
import { CreateCloudAnchorDto } from './dto/create-cloud-anchor.dto'

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
}
