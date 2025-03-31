import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class FindObjectsInBoundsDto {
  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  minLat: number

  @IsNumber()
  @Type(() => Number)
  @Min(-90)
  @Max(90)
  maxLat: number

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  minLon: number

  @IsNumber()
  @Type(() => Number)
  @Min(-180)
  @Max(180)
  maxLon: number

  @IsOptional()
  @IsString()
  type?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number = 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10
} 