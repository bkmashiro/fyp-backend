import { PartialType } from '@nestjs/swagger';
import { CreateCloudAnchorDto } from './create-cloud-anchor.dto';

export class UpdateCloudAnchorDto extends PartialType(CreateCloudAnchorDto) {}
