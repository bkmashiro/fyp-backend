import { Injectable } from '@nestjs/common';
import { CreateGeoObjectDto } from './dto/create-geo-object.dto';
import { UpdateGeoObjectDto } from './dto/update-geo-object.dto';

@Injectable()
export class GeoObjectService {
  create(createGeoObjectDto: CreateGeoObjectDto) {
    return 'This action adds a new geoObject';
  }

  findAll() {
    return `This action returns all geoObject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoObject`;
  }

  update(id: number, updateGeoObjectDto: UpdateGeoObjectDto) {
    return `This action updates a #${id} geoObject`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoObject`;
  }
}
