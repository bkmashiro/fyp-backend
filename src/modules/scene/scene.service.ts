import { Injectable } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
  ) {}

  async create(createSceneDto: CreateSceneDto) {
    const scene = this.sceneRepository.create(createSceneDto);
    return this.sceneRepository.save(scene);
  }

  findAll() {
    return this.sceneRepository.find({
      relations: ['children'],
    });
  }

  findOne(id: string) {
    return this.sceneRepository.findOne({
      where: { id },
      relations: ['children'],
    });
  }

  async update(id: string, updateSceneDto: UpdateSceneDto) {
    await this.sceneRepository.update(id, updateSceneDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const scene = await this.findOne(id);
    if (scene) {
      await this.sceneRepository.remove(scene);
    }
    return scene;
  }
}
