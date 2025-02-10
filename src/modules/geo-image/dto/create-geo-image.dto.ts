import { Point } from "typeorm";

export class CreateGeoImageDto {
  position: Point
  orientation: number[]
  scale?: number[]

  metadata?: string
}
