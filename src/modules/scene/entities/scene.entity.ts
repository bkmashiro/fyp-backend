import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { GeoEntity } from '@/shared/entities/ARObject'
import { Entity, OneToMany } from 'typeorm'

@Entity()
export class Scene extends GeoEntity {
  @OneToMany(() => GeoObject, (geoObject) => geoObject.scene)
  children: GeoObject[]
}
