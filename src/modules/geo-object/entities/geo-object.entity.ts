import { Scene } from '@/modules/scene/entities/scene.entity'
import { GeoEntity } from '@/shared/entities/ARObject'
import {
  Entity,
  Column,
  Point,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  TableInheritance,
} from 'typeorm'

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class GeoObject extends GeoEntity {
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  anchor: Point

  @Column('text', { nullable: true })
  metadata: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Scene, (scene) => scene.children)
  scene: Scene
}
