import { Point } from "typeorm"

export class CreateGeoCommentDto {
  position: Point
  altitude: number
  orientation: number[]
  scale?: number[]

  cloudAnchorId: string

  metadata?: string
}
