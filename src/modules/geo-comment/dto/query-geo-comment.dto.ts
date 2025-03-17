import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryGeoCommentDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10
} 