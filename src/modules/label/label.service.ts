import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateLabelDto } from './dto/create-label.dto'
import { UpdateLabelDto } from './dto/update-label.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Label } from './entities/label.entity'

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  async create(createLabelDto: CreateLabelDto) {
    const label = this.labelRepository.create(createLabelDto)
    return this.labelRepository.save(label)
  }

  async findAll() {
    const labels = await this.labelRepository.find()
    return Promise.all(
      labels.map(async (label) => {
        const result = await this.labelRepository
          .createQueryBuilder('label')
          .leftJoinAndSelect('label.scenes', 'scene')
          .where('label.id = :id', { id: label.id })
          .getOne()
        return { ...label, sceneCount: result?.scenes?.length || 0 }
      }),
    )
  }

  async findOne(id: string) {
    const label = await this.labelRepository.findOne({ 
      where: { id },
      relations: ['scenes']
    })
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`)
    }

    return { ...label, sceneCount: label.scenes?.length || 0 }
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    const label = await this.labelRepository.findOne({ where: { id } })
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`)
    }
    Object.assign(label, updateLabelDto)
    return this.labelRepository.save(label)
  }

  async remove(id: string) {
    const label = await this.labelRepository.findOne({ where: { id } })
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`)
    }
    return this.labelRepository.remove(label)
  }
}
