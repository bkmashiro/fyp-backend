import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}

  async create(createLabelDto: CreateLabelDto) {
    const label = this.labelRepository.create(createLabelDto);
    return this.labelRepository.save(label);
  }

  findAll() {
    return this.labelRepository.find();
  }

  async findOne(id: string) {
    const label = await this.labelRepository.findOne({ where: { id } });
    if (!label) {
      throw new NotFoundException(`Label with ID ${id} not found`);
    }
    return label;
  }

  async update(id: string, updateLabelDto: UpdateLabelDto) {
    const label = await this.findOne(id);
    Object.assign(label, updateLabelDto);
    return this.labelRepository.save(label);
  }

  async remove(id: string) {
    const label = await this.findOne(id);
    return this.labelRepository.remove(label);
  }
}
