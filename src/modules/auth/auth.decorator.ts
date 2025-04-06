import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Role } from '@/utils/role'

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export function GetUser() {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    if (!request.user) {
      throw new UnauthorizedException('User not found in request')
    }
    return request.user
  })()
}

export function RequireAuth() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth())
}
