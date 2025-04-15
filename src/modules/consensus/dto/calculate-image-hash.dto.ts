import { ApiProperty } from '@nestjs/swagger'

export class CalculateImageHashDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The image file to calculate hash',
  })
  file: Express.Multer.File
} 