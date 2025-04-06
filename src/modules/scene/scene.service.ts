import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';
import { Label } from '@/modules/label/entities/label.entity';

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  async create(createSceneDto: CreateSceneDto) {
    const scene = this.sceneRepository.create({
      ...createSceneDto,
      position: {
        type: 'Point',
        coordinates: createSceneDto.position,
      },
    });
    return this.sceneRepository.save(scene);
  }

  findAll() {
    return this.sceneRepository.find({
      relations: ['children', 'labels'],
    });
  }

  findOne(id: string) {
    return this.sceneRepository.findOne({
      where: { id },
      relations: ['children', 'labels'],
    });
  }

  async update(id: string, updateSceneDto: UpdateSceneDto) {
    await this.sceneRepository.update(id, {
      ...updateSceneDto,
      position: {
        type: 'Point',
        coordinates: updateSceneDto.position,
      },
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const scene = await this.findOne(id);
    if (scene) {
      await this.sceneRepository.remove(scene);
    }
    return scene;
  }

  async addLabel(sceneId: string, labelId: string) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    const label = await this.labelRepository.findOne({ where: { id: labelId } });
    if (!label) {
      throw new NotFoundException(`Label with ID ${labelId} not found`);
    }

    if (!scene.labels) {
      scene.labels = [];
    }

    if (!scene.labels.some(l => l.id === label.id)) {
      scene.labels.push(label);
      await this.sceneRepository.save(scene);
    }

    return scene;
  }

  async removeLabel(sceneId: string, labelId: string) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    if (scene.labels) {
      scene.labels = scene.labels.filter(label => label.id !== labelId);
      await this.sceneRepository.save(scene);
    }

    return scene;
  }

  async findByLabel(labelId: string) {
    return this.sceneRepository
      .createQueryBuilder('scene')
      .innerJoinAndSelect('scene.labels', 'label')
      .where('label.id = :labelId', { labelId })
      .leftJoinAndSelect('scene.children', 'children')
      .getMany();
  }
}
