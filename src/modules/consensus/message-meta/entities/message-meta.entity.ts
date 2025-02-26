import { Column, Entity, Index, PrimaryColumn } from 'typeorm'

@Entity()
export class MessageMeta {
  @PrimaryColumn()
  @Index()
  id: string

  @Column()
  topicId: string

  @Column()
  createdAt: Date

  @Column({ nullable: true })
  author: string
}
