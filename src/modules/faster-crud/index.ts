/*
 * File: index.ts                                                              *
 * Project: sanpu-backend                                                      *
 * Created Date: Fr Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Tue Sep 03 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { InjectRepository } from '@nestjs/typeorm'
import { AutoEntitiesModule } from '../auto-entities/auto-entities.module'
import { Inject, applyDecorators, Controller, Get } from '@nestjs/common'
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm'
import {
  CrudController,
  CrudRequest,
  CrudService,
  Override,
  ParsedRequest,
} from '@nestjsx/crud'
import { Crud } from '@nestjsx/crud'
import { ApiTags } from '@nestjs/swagger'
import { Repository } from 'typeorm'
import { FasterCrudService } from './faster-crud.service'

/**
 * only for inheritance
 * automatically register entity
 * @param entity
 * @returns
 */
export function FCService<T extends Constructor<any>>(
  entity: T,
): typeof TypeOrmCrudService<InstanceType<T>> & {
  __entity: T
} {
  AutoEntitiesModule.registerEntity(entity)

  class FCServiceImpl extends TypeOrmCrudService<T> {
    constructor(
      @InjectRepository(entity)
      public repository: any,
    ) {
      super(repository)
    }
  }

  return FCServiceImpl as any
}

type Merge<F, S> = {
  [K in keyof F | keyof S]: K extends keyof S
    ? S[K]
    : K extends keyof F
      ? F[K]
      : never
}

export function FCController<T extends ReturnType<typeof FCService>> (
  service: T,
): {
  new (...args: any[]): Merge<CrudController<InstanceType<T['__entity']>>, { service: InstanceType<T> }>
} {
  class FCControllerImpl implements CrudController<InstanceType<T['__entity']>> {
    constructor(
      @Inject(service)
      public service: CrudService<any> & { repository: Repository<any> },
    ) {}
  }

  return FCControllerImpl as any
}

type Constructor<T> = new (...args: any[]) => T

export function FC(entity: Constructor<any>, cfg?: Parameters<typeof Crud>[0]) {
  if (!cfg) {
    cfg = {
      model: {
        type: entity,
      },
    }
  }
  FasterCrudService.entities.push(entity)
  return applyDecorators(
    ApiTags(cfg.model.type.name),
    Controller(cfg.model.type.name.toLowerCase()),
    Crud(cfg),
  )
}
