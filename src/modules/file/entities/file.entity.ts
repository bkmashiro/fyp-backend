/**
 * {
      key: uniqueSuffix,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    }
 */

import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class File {
  @PrimaryColumn()
  key: string
  @Column()
  originalName: string
  @Column()
  size: number
  @Column()
  mimeType: string
}
