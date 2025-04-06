import { Module } from '@nestjs/common';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scene } from './entities/scene.entity';
import { LabelModule } from '@/modules/label/label.module';
import { Label } from '@/modules/label/entities/label.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scene, Label]),
    LabelModule,
  ],
  controllers: [SceneController],
  providers: [SceneService],
  exports: [SceneService],
})
export class SceneModule {}
