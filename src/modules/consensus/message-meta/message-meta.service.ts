import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageMeta } from './entities/message-meta.entity';
import { Repository } from 'typeorm';
import { CreateMessageMetaDto } from './dto/create-message-meta.dto';

@Injectable()
export class MessageMetaService {
  constructor(
    @InjectRepository(MessageMeta)
    private readonly messageMetaRepository: Repository<MessageMeta>,
  ) {}

  async create(createMessageMetaDto: CreateMessageMetaDto) {
    return await this.messageMetaRepository.save(createMessageMetaDto);
  }
}
