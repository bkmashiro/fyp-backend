import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZkService } from './zk.service';
import { ZkController } from './zk.controller';
import { ConsensusModule } from '../consensus/consensus.module';
import { MessageMetaService } from '../consensus/message-meta/message-meta.service';
import { MessageMeta } from '../consensus/message-meta/entities/message-meta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageMeta]),
    ConsensusModule
  ],
  controllers: [ZkController],
  providers: [ZkService, MessageMetaService],
  exports: [ZkService]
})
export class ZkModule {}
