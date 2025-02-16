import { Point } from "typeorm";

export class CreateGeoImageDto {
  ossFileId: string

  position: Point
  orientation: number[]
  scale?: number[]

  cloudAnchorId: string

  metadata?: string
}
