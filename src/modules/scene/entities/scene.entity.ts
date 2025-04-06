import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { GeoEntity } from '@/shared/entities/ARObject'
import { Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { Label } from '@/modules/label/entities/label.entity'

@Entity()
export class Scene extends GeoEntity {
  @OneToMany(() => GeoObject, (geoObject) => geoObject.scene)
  children: GeoObject[]

  @ManyToMany(() => Label, (label) => label.scenes)
  @JoinTable()
  labels: Label[]
}
