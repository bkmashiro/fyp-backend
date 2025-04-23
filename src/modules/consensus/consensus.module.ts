import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HederaService } from './hedera/hedera.service';
import { ConsensusService } from './consensus.service';
import { MessageMetaModule } from './message-meta/message-meta.module';
import { ConsensusController } from './consensus.controller';
import { GeoImageModule } from '../geo-image/geo-image.module';
import { FileModule } from '../file/file.module';
import { ImageCopyright } from './entities/image-copyright.entity';
import { ImageCopyrightService } from './image-copyright.service';
import { HederaTopicService } from './services/hedera-topic.service';
import { HederaTopic } from './entities/hedera-topic.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ImageCopyright, HederaTopic]),
    MessageMetaModule,
    GeoImageModule,
    FileModule,
  ],
  providers: [HederaService, ConsensusService, ImageCopyrightService, HederaTopicService],
  controllers: [ConsensusController],
  exports: [ImageCopyrightService, HederaService],
})
export class ConsensusModule {}
