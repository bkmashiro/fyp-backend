import { Column, Entity, Point, PrimaryGeneratedColumn } from 'typeorm'
import { TimedEntity } from './TimedEntity'

export abstract class GeoEntity extends TimedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  position: Point

  @Column('float', { default: 0 })
  latitude: number

  @Column('float', { array: true, default: [0, 0, 0, 1] })
  orientation: number[]

  @Column('float', { array: true, default: [1, 1, 1] })
  scale: number[]
}
