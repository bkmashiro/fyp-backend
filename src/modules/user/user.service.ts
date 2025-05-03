import { Injectable, BadRequestException } from '@nestjs/common'
import { FCService } from '../faster-crud'
import { User } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { Role } from '../role/entities/role.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService extends FCService(User) {
  public async register(createUserDto: CreateUserDto) {
    if (
      await this.repo.findOne({ where: { username: createUserDto.username } })
    ) {
      throw new BadRequestException('Username already exists')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
    
    // Create user with hashed password
    const user = this.repo.create({
      ...createUserDto,
      password: hashedPassword
    })
    user.roles = [new Role('user')]

    return this.repo.save(user)
  }
}
