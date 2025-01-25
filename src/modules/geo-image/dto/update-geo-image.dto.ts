import { PartialType } from '@nestjs/swagger';
import { CreateGeoImageDto } from './create-geo-image.dto';

export class UpdateGeoImageDto extends PartialType(CreateGeoImageDto) {}
