import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { GeoEntity } from '@/shared/entities/ARObject'
import { Entity, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn, Column } from 'typeorm'
import { Label } from '@/modules/label/entities/label.entity'
import { User } from '@/modules/user/entities/user.entity'

@Entity()
export class Scene extends GeoEntity {
  @Column({ default: 'untitled' })
  name: string

  @Column({ default: 'No description provided' })
  description: string

  @OneToMany(() => GeoObject, (geoObject) => geoObject.scene)
  children: GeoObject[]

  @ManyToMany(() => Label, (label) => label.scenes)
  @JoinTable()
  labels: Label[]

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  creator: User

  @ManyToMany(() => User)
  @JoinTable()
  managers: User[]
}
