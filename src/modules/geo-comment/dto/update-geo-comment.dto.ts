import { PartialType } from '@nestjs/swagger';
import { CreateGeoCommentDto } from './create-geo-comment.dto';

export class UpdateGeoCommentDto extends PartialType(CreateGeoCommentDto) {}
