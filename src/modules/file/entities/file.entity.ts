import { User } from '@/modules/user/entities/user.entity'
import { TimedEntity } from '@/shared/entities/TimedEntity'
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'

@Entity()
export class File extends TimedEntity {
  @PrimaryColumn()
  key: string
  @Column()
  originalName: string
  @Column()
  size: number
  @Column()
  mimeType: string
  @OneToMany(() => User, (user) => user.files)
  user: User
  @DeleteDateColumn()
  deletedAt: Date
}
