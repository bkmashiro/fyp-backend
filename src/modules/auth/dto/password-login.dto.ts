/*
 * File: password-login.dto.ts                                                 *
 * Project: sanpu-backend                                                      *
 * Created Date: Mo Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Mon Aug 19 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { IsString, Length } from 'class-validator'

export class PasswordLoginDto {
  @IsString()
  @Length(1, 20)
  username: string

  @IsString()
  @Length(1, 32)
  password: string
}
