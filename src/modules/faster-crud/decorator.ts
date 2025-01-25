/*
 * File: decorator.ts                                                          *
 * Project: sanpu-backend                                                      *
 * Created Date: Fr Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Thu Aug 29 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { setMeta } from '@/utils/reflect.utils'
import { Inject } from '@nestjs/common'
import { EntitySchema } from 'typeorm'
import { FasterCrudService } from './faster-crud.service'

export interface CRUDProvider {
  create: (data: any) => any
  findAll: () => any
  find: (id: string) => any
  update: (id: string, data: any) => any
  remove: (id: string) => any
}

/**
 * Inject `create`, `findAll`, `find`, `update`, `remove` methods to the target class
 * @returns
 */
export function CollectDataDict<
  TFunction extends { new (...args: any[]): InstanceType<TFunction> },
>() {
  return function (target: TFunction) {
    FasterCrudService.entities.push(target)
  }
}
