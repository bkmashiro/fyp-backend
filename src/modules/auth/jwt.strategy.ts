import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'
import { jwtConstants } from './constants'
import { UserService } from '../user/user.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { User } from '../user/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    })
  }

  async validate(payload: any) {
    const cacheKey = `user:${payload.sub}`
    
    // 尝试从缓存获取用户信息
    let user = await this.cacheManager.get<User>(cacheKey)
    
    if (!user) {
      // 如果缓存中没有，从数据库查询
      user = await this.userService.findOne({ 
        where: { id: payload.sub },
        relations: ['roles']
      })
      
      if (user) {
        // 将用户信息存入缓存，设置 5 分钟过期
        await this.cacheManager.set(cacheKey, user, 300000)
      }
    }
    
    if (!user) {
      return null
    }

    return {
      ...user,
      userId: user.id,
      username: user.username,
      roles: user.roles.map(role => role.name),
    }
  }
}
