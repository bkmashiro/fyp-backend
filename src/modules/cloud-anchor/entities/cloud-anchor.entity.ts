import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  Point,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class CloudAnchor extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  cloudAnchorId: string

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  anchor: Point

  @Column('float', { default: 0 })
  altitude: number

  @OneToMany(() => GeoObject, (geoObject) => geoObject.cloudAnchor)
  geoObjects: GeoObject[]
}
