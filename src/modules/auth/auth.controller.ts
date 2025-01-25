import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  UnauthorizedException,
} from '@nestjs/common'
import { LocalAuthGuard } from './local-auth.guard'
import { JwtAuthGuard } from './jwt-auth.guard'
import { PasswordLoginDto } from './dto/password-login.dto'
import { AuthService } from './auth.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserService } from '../user/user.service'
import { Role } from '@/utils/role'
import { UserRoles } from 'nest-access-control'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() _body: PasswordLoginDto) {
    return await this.authService.login(req.user)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
    // if (req.user) {
    //   return this.userService.findOne({ where: { id: req.user.id } })
    // }

    // throw new UnauthorizedException()
  }

  @ApiBearerAuth()
  @Role({
    action: 'read',
    resource: 'default-sanpu-entry-key',
    possession: 'any',
  })
  @Get('test')
  test(@UserRoles() userRoles, @Request() req) {
    return userRoles
  }
}
