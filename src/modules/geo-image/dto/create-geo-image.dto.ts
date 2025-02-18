import { Point } from "typeorm";

export class CreateGeoImageDto {
  ossFileId: string //8ad6afd9-233b-43cd-89b6-56597c3d8ac9.png

  position: Point
  altitude: number
  orientation: number[]
  scale?: number[]

  cloudAnchorId: string

  metadata?: string
}
