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
    default: () => 'ST_GeomFromText(\'POINT(0 0)\', 4326)',
  })
  anchor: Point

  @Column('float', { default: 0 })
  anchor_latitude: number

  @Column('text', { nullable: true })
  metadata: string | null

  @Column('text', { nullable: true })
  cloudAnchorId: string | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => Scene, (scene) => scene.children)
  scene: Scene
}
