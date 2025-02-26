import { PartialType } from '@nestjs/swagger';
import { CreateMessageMetaDto } from './create-message-meta.dto';

export class UpdateMessageMetaDto extends PartialType(CreateMessageMetaDto) {}
