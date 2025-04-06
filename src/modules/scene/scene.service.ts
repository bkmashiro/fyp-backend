import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateSceneDto } from './dto/create-scene.dto';
import { UpdateSceneDto } from './dto/update-scene.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Scene } from './entities/scene.entity';
import { Label } from '@/modules/label/entities/label.entity';
import { User } from '@/modules/user/entities/user.entity';
import { In } from 'typeorm';

@Injectable()
export class SceneService {
  constructor(
    @InjectRepository(Scene)
    private sceneRepository: Repository<Scene>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createSceneDto: CreateSceneDto, creatorId: number) {
    const creator = await this.userRepository.findOne({ where: { id: creatorId } });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const scene = this.sceneRepository.create({
      ...createSceneDto,
      position: {
        type: 'Point',
        coordinates: createSceneDto.position,
      } as any,
      creator,
    });

    if (createSceneDto.managerIds?.length) {
      const managers = await this.userRepository.findBy({ id: In(createSceneDto.managerIds) });
      scene.managers = managers;
    }

    return this.sceneRepository.save(scene);
  }

  findAll() {
    return this.sceneRepository.find({
      relations: ['children', 'labels', 'creator', 'managers'],
    });
  }

  findOne(id: string) {
    return this.sceneRepository.findOne({
      where: { id },
      relations: ['children', 'labels', 'creator', 'managers'],
    });
  }

  async update(id: string, updateSceneDto: UpdateSceneDto, userId: number) {
    const scene = await this.findOne(id);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${id} not found`);
    }

    if (!scene.creator || (scene.creator.id !== userId && !scene.managers.some(m => m.id === userId))) {
      throw new ForbiddenException('You do not have permission to update this scene');
    }

    const updateData = { ...updateSceneDto };
    if (updateSceneDto.position) {
      updateData.position = updateSceneDto.position;
    }

    if (updateSceneDto.managerIds) {
      const managers = await this.userRepository.findBy({ id: In(updateSceneDto.managerIds) });
      scene.managers = managers;
      delete updateData.managerIds;
    }
    
    return await scene.save()
  }

  async remove(id: string, userId: number) {
    const scene = await this.findOne(id);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${id} not found`);
    }

    if (!scene.creator || scene.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can delete this scene');
    }

    await this.sceneRepository.remove(scene);
    return scene;
  }

  async addLabel(sceneId: string, labelId: string, userId: number) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    if (!scene.creator || (scene.creator.id !== userId && !scene.managers.some(m => m.id === userId))) {
      throw new ForbiddenException('You do not have permission to modify this scene');
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

  async removeLabel(sceneId: string, labelId: string, userId: number) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    if (!scene.creator || (scene.creator.id !== userId && !scene.managers.some(m => m.id === userId))) {
      console.log(scene.creator.id, userId, scene.managers)
      throw new ForbiddenException('You do not have permission to modify this scene');
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
      .leftJoinAndSelect('scene.creator', 'creator')
      .leftJoinAndSelect('scene.managers', 'managers')
      .getMany();
  }

  async findUserScenes(userId: number) {
    return this.sceneRepository
      .createQueryBuilder('scene')
      .leftJoinAndSelect('scene.children', 'children')
      .leftJoinAndSelect('scene.labels', 'labels')
      .leftJoinAndSelect('scene.creator', 'creator')
      .leftJoinAndSelect('scene.managers', 'managers')
      .where('creator.id = :userId', { userId })
      .orWhere('managers.id = :userId', { userId })
      .orderBy('scene.createdAt', 'DESC')
      .getMany();
  }

  async addManager(sceneId: string, userId: number, newManagerId: number) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    if (!scene.creator || scene.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can add managers');
    }

    const newManager = await this.userRepository.findOne({ where: { id: newManagerId } });
    if (!newManager) {
      throw new NotFoundException(`User with ID ${newManagerId} not found`);
    }

    if (!scene.managers.some(m => m.id === newManagerId)) {
      scene.managers.push(newManager);
      await this.sceneRepository.save(scene);
    }

    return scene;
  }

  async removeManager(sceneId: string, userId: number, managerId: number) {
    const scene = await this.findOne(sceneId);
    if (!scene) {
      throw new NotFoundException(`Scene with ID ${sceneId} not found`);
    }

    if (!scene.creator || scene.creator.id !== userId) {
      throw new ForbiddenException('Only the creator can remove managers');
    }

    scene.managers = scene.managers.filter(m => m.id !== managerId);
    await this.sceneRepository.save(scene);

    return scene;
  }
}
