import { Point } from 'typeorm'

export class CreateGeoObjectDto {
  anchor: Point

  anchor_latitude: number

  metadata: string | null

  cloudAnchorId: string | null

  relPosition: Point

  relAltitude: number

  relOrientation: number[]

  // scene: Scene
}
