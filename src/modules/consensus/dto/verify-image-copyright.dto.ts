import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator'
import { Type } from 'class-transformer'

export class VerifyImageCopyrightDto {
  @ApiProperty({
    description: 'Image feature vector (hash)',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  @IsString()
  @IsNotEmpty()
  imageHash: string

  @ApiProperty({
    description: 'User ID to verify against',
    example: 'user123456',
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: 'Start time of the verification period',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date

  @ApiProperty({
    description: 'End time of the verification period',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date
} 