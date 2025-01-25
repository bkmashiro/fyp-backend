/*
 * File: decorators.ts                                                         *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
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

import { elementCode } from '@/decls/element-code'
import { User } from '@/modules/user/entities/user.entity'
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  Controller as NestController,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IsIn as CV_IsIn, isIn } from 'class-validator'
import { UseRoles } from 'nest-access-control'
import { mergeMeta } from './reflect.utils'

export function IsIn(values: any[], options?: any) {
  // if (values.length === 1 && Array.isArray(values[0])) {
  //   values = values[0]
  // }
  // return CV_IsIn(values, options)

  return function (target: any, key: string) {
    // console.log('target', target)
    // console.log('key', key)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        isIn: values,
        options,
      },
    })

    CV_IsIn(values, options)(target, key)
  }
}

/**
 * specialized controller decorator
 *
 * a shorthand for applying both the ApiTags and NestController decorators to a controller
 * @param name
 * @returns
 */
export function Controller(name: string) {
  return applyDecorators(ApiTags(name), NestController(name))
}

export function IsInKeys(obj: Record<string, any>) {
  // return IsIn(Object.keys(obj))
  return function (target: any, key: string) {
    mergeMeta(target, 'fc:columns', {
      [key]: {
        isInMap: obj,
      },
    })

    IsIn(Object.keys(obj))(target, key)
  }
}

export function MultipleChoice() {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:multipleChoice', true, target, key)
    // setMeta(target, 'fc:multipleChoice', true)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        multipleChoice: true,
      },
    })
  }
}

export function IsElementCode() {
  return applyDecorators(IsInKeys(elementCode))
}

export function Hint(hint: string) {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:hint', hint, target, key)
    // setMeta(target, 'fc:hint', hint)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        hint,
      },
    })
  }
}

export function UseNameMapper(mapper: Record<string, any>) {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:mapper', mapper, target, key)
    // setMeta(target, 'fc:mapper', mapper)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        mapper,
      },
    })
  }
}

export function Unit(unit: string | string[]) {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:unit', unit, target, key)
    // setMeta(target, 'fc:unit', unit)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        unit,
      },
    })
  }
}

export function HiddenInForm() {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:hiddenInForm', true, target, key)
    // setMeta(target, 'fc:hiddenInForm', true)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        form: {
          show: false,
        },
      },
    })
  }
}

export function HiddenInTable() {
  return function (target: any, key: string) {
    // Reflect.defineMetadata('fc:hiddenInTable', true, target, key)
    // setMeta(target, 'fc:hiddenInTable', true)
    mergeMeta(target, 'fc:columns', {
      [key]: {
        hiddenInTable: true,
      },
    })
  }
}

export type FCColumn = {
  title: string
  type: string
  isIn?: string[]
  isInMap?: Record<string, any>
  multipleChoice?: boolean
  unit?: string | string[]
  mapper?: Record<string, any>
  hint?: string
  // column?: Record<string, any>

  [key: string]: any
}

const admin = ['admin', 'superadmin']
export const IsAdmin = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.user && admin.some((role) => req.user.roles.includes(role))
})

export const UID = createParamDecorator((_data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.user && req.user.id
})

export const CurrentUser = createParamDecorator<
  keyof User | undefined,
  ExecutionContext
>((data, ctx) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user
  return typeof data === 'undefined' ? user[data!] : user
})

export const RolesInfo = createParamDecorator(
  (_data, ctx: ExecutionContext) => {
    const roles = Reflect.getMetadata('roles', ctx.getHandler())
    return roles as Parameters<typeof UseRoles>
  },
)
