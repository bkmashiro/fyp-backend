import { UserService } from './user.service'
import { FC, FCController } from '../faster-crud'
import { User } from './entities/user.entity'
import { Body, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'

@FC(User)
export class UserController extends FCController(UserService) {
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.service.register(body)
  }
}
