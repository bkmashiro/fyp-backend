import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class RegisterImageCopyrightDto {
  @ApiProperty({
    description: 'GeoImage ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  geoImageId: string

  @ApiProperty({
    description: 'User ID',
    example: 'user123',
  })
  @IsString()
  @IsNotEmpty()
  userId: string
} 