import { Injectable } from '@nestjs/common';
import { CreateGeoImageDto } from './dto/create-geo-image.dto';
import { UpdateGeoImageDto } from './dto/update-geo-image.dto';

@Injectable()
export class GeoImageService {
  create(createGeoImageDto: CreateGeoImageDto) {
    return 'This action adds a new geoImage';
  }

  findAll() {
    return `This action returns all geoImage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} geoImage`;
  }

  update(id: number, updateGeoImageDto: UpdateGeoImageDto) {
    return `This action updates a #${id} geoImage`;
  }

  remove(id: number) {
    return `This action removes a #${id} geoImage`;
  }
}
