import { PartialType } from '@nestjs/swagger'
import { CreateGeoObjectDto } from './create-geo-object.dto'

export class UpdateGeoObjectDto {
  id: string
  data: any
}
