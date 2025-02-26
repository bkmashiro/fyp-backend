import { Module } from '@nestjs/common'
import { MessageMetaService } from './message-meta.service'
import { MessageMetaController } from './message-meta.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageMeta } from './entities/message-meta.entity'

@Module({
  imports: [TypeOrmModule.forFeature([MessageMeta])],
  controllers: [MessageMetaController],
  providers: [MessageMetaService],
  exports: [MessageMetaService],
})
export class MessageMetaModule {}
