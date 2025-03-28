import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class TimedEntity extends BaseEntity {
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
