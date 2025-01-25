/*
 * File: faster-crud.controller.ts                                             *
 * Project: sanpu-backend                                                      *
 * Created Date: We Aug 2024                                                   *
 * Author: Yuzhe Shi                                                           *
 * -----                                                                       *
 * Last Modified: Fri Aug 30 2024                                              *
 * Modified By: Yuzhe Shi                                                      *
 * -----                                                                       *
 * Copyright (c) 2024 Nanjing University of Information Science & Technology   *
 * -----                                                                       *
 * HISTORY:                                                                    *
 * Date      	By	Comments                                                     *
 * ----------	---	---------------------------------------------------------    *
 */

import { BadRequestException, Controller, Param } from '@nestjs/common'
import { FasterCrudService } from './faster-crud.service'
import { Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('fce')
@Controller('faster-crud')
export class FasterCrudController {
  constructor(private readonly fasterCrudService: FasterCrudService) {}

  @Get('dict/:entity')
  getDict(@Param('entity') entity: string) {
    const res = this.fasterCrudService.getDict(entity.toLowerCase())
    if (res) {
      return res
    }
    throw new BadRequestException('No such entity')
  }

  @Get('all')
  getAll() {
    return Array.from(this.fasterCrudService.dictMap.keys())
  }
}
