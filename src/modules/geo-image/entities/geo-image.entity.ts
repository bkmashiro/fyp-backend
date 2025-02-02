import { File } from '@/modules/file/entities/file.entity'
import { GeoObject } from '@/modules/geo-object/entities/geo-object.entity'
import { ChildEntity, JoinColumn, OneToOne } from 'typeorm'

@ChildEntity()
export class GeoImage extends GeoObject {
  @OneToOne(() => File, { cascade: ['soft-remove'], eager: true })
  @JoinColumn({ name: 'oss_file_id' })
  ossFile!: File
}
