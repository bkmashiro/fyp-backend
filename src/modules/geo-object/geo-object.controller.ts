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

@Controller('geo-object')
export class GeoObjectController {
  constructor(private readonly geoObjectService: GeoObjectService) {}

  @Post()
  create(@Body() createGeoObjectDto: CreateGeoObjectDto) {
    return this.geoObjectService.create(createGeoObjectDto)
  }

  @Get()
  findAll() {
    return this.geoObjectService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.geoObjectService.findOne(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGeoObjectDto: UpdateGeoObjectDto,
  ) {
    return this.geoObjectService.update(+id, updateGeoObjectDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.geoObjectService.remove(+id)
  }

  @Get('range/:lat/:lon/:radius')
  findObjectsInArea(
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
}
