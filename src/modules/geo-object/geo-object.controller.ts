import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { GeoObjectService } from './geo-object.service'
import { CreateGeoObjectDto } from './dto/create-geo-object.dto'
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto'
import { ApiTags } from '@nestjs/swagger'

@Controller('geo-object')
@ApiTags('geo-object')
export class GeoObjectController {
  constructor(private readonly geoObjectService: GeoObjectService) {}

  @Get(':id')
  findOneGeoObject(@Param('id') id: string) {
    return this.geoObjectService.findOne(id)
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

  @Post()
  updateGeoObject(@Body() updateGeoObjectDto: UpdateGeoObjectDto) {
    return this.geoObjectService.update(
      updateGeoObjectDto.id,
      updateGeoObjectDto,
    )
  }

  @Get('anchor/:anchorId')
  findGeoObjectsByAnchor(@Param('anchorId') anchorId: string) {
    return this.geoObjectService.findObjectsByAnchor(anchorId)
  }
}
