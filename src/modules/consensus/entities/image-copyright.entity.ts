import { TimedEntity } from '@/shared/entities/TimedEntity'
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { GeoImage } from '@/modules/geo-image/entities/geo-image.entity'

export enum CopyrightStatus {
  PENDING = 'pending', // 未跟踪
  REGISTERED = 'registered', // 已跟踪
  FAILED = 'failed', // 注册失败
}

@Entity()
export class ImageCopyright extends TimedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'bit', length: 8 * 8 })
  @Index()
  imageHash: string

  @Column()
  userId: string

  @Column({
    type: 'enum',
    enum: CopyrightStatus,
    default: CopyrightStatus.PENDING,
  })
  status: CopyrightStatus

  @Column({ nullable: true })
  transactionHash: string

  @Column({ type: 'json', nullable: true })
  blockchainInfo: {
    topicId: string
    sequenceNumber: string
    timestamp: string
    message: string
  }

  @ManyToOne(() => GeoImage, { eager: true })
  geoImage: GeoImage
}
