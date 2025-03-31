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
import { GeoObjectService } from './geo-object.service'
import { CreateGeoObjectDto } from './dto/create-geo-object.dto'
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto'
import { ApiTags, ApiQuery, ApiOperation } from '@nestjs/swagger'
import { FindObjectsInBoundsDto } from './dto/find-objects-in-bounds.dto'

@Controller('geo-object')
@ApiTags('geo-object')
export class GeoObjectController {
  constructor(private readonly geoObjectService: GeoObjectService) {}

  @Get('bounds')
  @ApiOperation({ summary: 'Find geo objects within specified bounds' })
  @ApiQuery({ type: FindObjectsInBoundsDto })
  async findObjectsInBounds(@Query() query: FindObjectsInBoundsDto) {
    return this.geoObjectService.findObjectsInBounds(
      query.minLat,
      query.maxLat,
      query.minLon,
      query.maxLon,
      query.type,
      query.page,
      query.limit,
    )
  }

  @Get('range/:lat/:lon/:radius')
  findGeoObjectsInArea(
    @Param('lat') lat: string,
    @Param('lon') lon: string,
    @Param('radius') radius: string,
  ) {
    return this.geoObjectService.findObjectsInArea(
      parseFloat(lat),
      parseFloat(lon),
      parseFloat(radius),
    )
  }

  @Get('anchor/:anchorId')
  findGeoObjectsByAnchor(@Param('anchorId') anchorId: string) {
    return this.geoObjectService.findObjectsByAnchor(anchorId)
  }

  @Get(':id')
  findOneGeoObject(@Param('id') id: string) {
    return this.geoObjectService.findOne(id)
  }

  @Post()
  updateGeoObject(@Body() updateGeoObjectDto: UpdateGeoObjectDto) {
    return this.geoObjectService.update(
      updateGeoObjectDto.id,
      updateGeoObjectDto,
    )
  }
}
