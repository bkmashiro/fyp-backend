import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { ChildEntity, Column } from 'typeorm'
@ChildEntity()
export class GeoComment extends GeoObject {
  @Column('text', { nullable: true })
  text!: string
}
