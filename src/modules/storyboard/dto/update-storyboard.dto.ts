import { PartialType } from '@nestjs/swagger';
import { CreateStoryboardDto } from './create-storyboard.dto';

export class UpdateStoryboardDto extends PartialType(CreateStoryboardDto) {}
