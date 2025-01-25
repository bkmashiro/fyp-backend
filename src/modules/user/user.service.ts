import { Injectable, BadRequestException } from '@nestjs/common'
import { FCService } from '../faster-crud'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { Role } from '../role/entities/role.entity'

@Injectable()
export class UserService extends FCService(User) {
  public async register(createUserDto: CreateUserDto) {
    if (
      await this.repo.findOne({ where: { username: createUserDto.username } })
    ) {
      throw new BadRequestException('Username already exists')
    }

    // grant basic user role
    const user = this.repo.create(createUserDto)
    user.roles = [new Role('user')]

    return this.repo.save(user)
  }
}
