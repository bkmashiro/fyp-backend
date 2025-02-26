import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { MessageMetaService } from './message-meta.service'
import { CreateMessageMetaDto } from './dto/create-message-meta.dto'
import { UpdateMessageMetaDto } from './dto/update-message-meta.dto'

@Controller('message-meta')
export class MessageMetaController {
  constructor(private readonly messageMetaService: MessageMetaService) {}
}
