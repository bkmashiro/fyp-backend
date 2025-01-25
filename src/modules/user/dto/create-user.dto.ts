import { IsString, Length } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @Length(1, 20)
  username: string

  @IsString()
  @Length(1, 32)
  password: string
}
