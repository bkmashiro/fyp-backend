/*
 * File: fc-metadata.ts                                                        *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Wed Aug 28 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import 'reflect-metadata'
import { getMeta, getMetaKeys, mergeMeta } from './reflect.utils'
import { inspect } from 'util'
import { DataSource } from 'typeorm';






export function Col(cfg: any) {
  return function (target: any, propertyKey: string) {
    mergeMeta(target, 'fc:columns', {
      [propertyKey]: cfg,
    })
  }
}
