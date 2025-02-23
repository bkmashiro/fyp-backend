import { IsInt, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class QueryGeoImageDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1 // 默认页码为 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10 // 默认每页 10 条
}
