import { File } from '@/modules/file/entities/file.entity'
import { Role } from '@/modules/role/entities/role.entity'
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  username: string

  @Exclude()
  @Column()
  password: string

  @OneToMany(() => Role, (role) => role.user, { cascade: true, eager: true })
  roles: Role[]

  @OneToMany(() => File, (file) => file.user)
  files: File[]
}
