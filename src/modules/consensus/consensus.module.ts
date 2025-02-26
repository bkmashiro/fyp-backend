import { Module } from '@nestjs/common';
import { HederaService } from './hedera/hedera.service';
import { ConsensusService } from './consensus.service';
import { MessageMetaModule } from './message-meta/message-meta.module';
import { ConsensusController } from './consensus.controller';

@Module({
  providers: [HederaService, ConsensusService],
  imports: [MessageMetaModule],
  controllers: [ConsensusController]
})
export class ConsensusModule {}
