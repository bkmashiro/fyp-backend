import { Role } from '@/modules/role/entities/role.entity'
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  username: string

  @Column()
  password: string

  @OneToMany(() => Role, (role) => role.user, { cascade: true, eager: true })
  roles: Role[]
}
