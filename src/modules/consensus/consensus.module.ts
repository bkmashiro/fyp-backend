import { Module } from '@nestjs/common';
import { HederaService } from './hedera/hedera.service';
import { ConsensusService } from './consensus.service';

@Module({
  providers: [HederaService, ConsensusService]
})
export class ConsensusModule {}
