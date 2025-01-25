/*
 * File: role.ts                                                               *
 * Project: sanpu-backend                                                      *
 * Created Date: Mo Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Wed Aug 21 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard'
import {
  applyDecorators,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ACGuard, UseRoles } from 'nest-access-control'

export function Role(...roles: Parameters<typeof UseRoles>) {
  return applyDecorators(UseGuards(JwtAuthGuard, ACGuard), UseRoles(...roles))
}

export function DefaultAccess(resName: string) {
  return applyDecorators(
    Role({
      action: 'create',
      possession: 'own',
      resource: resName,
    }),
  )
}

export function checkOwning(uid: number, resId: number) {
  if (uid !== resId) {
    throw new UnauthorizedException('not owning this resource')
  }
}
