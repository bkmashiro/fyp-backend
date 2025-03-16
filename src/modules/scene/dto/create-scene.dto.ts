import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSceneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  position: [number, number];  // [longitude, latitude]

  @IsNumber()
  @IsOptional()
  altitude?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  orientation?: [number, number, number, number];  // quaternion [x, y, z, w]

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  scale?: [number, number, number];  // [x, y, z]
}
