import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../user/entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ where: { username } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password, ...result } = user
    return result
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
