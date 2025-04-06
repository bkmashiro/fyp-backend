import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Scene } from '@/modules/scene/entities/scene.entity';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Scene, (scene) => scene.labels)
  scenes: Scene[];
}
