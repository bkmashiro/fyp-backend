import { File } from '@/modules/file/entities/file.entity'
import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'

@Entity()
export class GeoImage {
  @OneToOne(() => GeoObject, { cascade: true })
  @JoinColumn({ name: 'id' })
  geoObject: GeoObject

  @OneToOne(() => File, { cascade: ['soft-remove'], eager: true })
  @JoinColumn({ name: 'oss_file_id' })
  ossFile!: File
}
