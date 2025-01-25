/*
 * File: column-shortcut.ts                                                    *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Sat Aug 31 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { applyDecorators } from '@nestjs/common'
import { Column } from 'typeorm'

export function $Polygon() {
  return applyDecorators(
    Column({ name: 'border', type: 'polygon', spatialFeatureType: 'Polygon' }),
  )
}

export function $Line() {
  return applyDecorators(
    Column({ name: 'line', type: 'line', spatialFeatureType: 'Line' }),
  )
}

export function $Point() {
  return applyDecorators(
    Column({ name: 'point', type: 'point', spatialFeatureType: 'Point' }),
  )
}