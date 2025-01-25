import { Injectable } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ where: { username } })
    if (user && user.password === pass) {
      const { password, ...result } = user //TODO add hash password
      return result
    }
    return null
  }

  async login(user: User) {
    const u = await this.userService.findOne({ where: { id: user.id } })

    const payload = {
      username: user.username,
      sub: user.id,
      roles: u.roles.map((r) => r.name),
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
