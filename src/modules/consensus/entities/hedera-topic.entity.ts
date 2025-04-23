import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TopicType } from '../types/topic-type.enum';

@Entity('hedera_topics')
export class HederaTopic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  topicId: string;

  @Column({
    type: 'enum',
    enum: TopicType,
    default: TopicType.MESSAGE
  })
  type: TopicType;

  @Column({ nullable: true })
  memo: string;

  @Column({ type: 'timestamp' })
  expirationTime: Date;

  @Column({ type: 'int' })
  autoRenewPeriod: number; // in seconds

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 