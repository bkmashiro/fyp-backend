import { Module } from '@nestjs/common'
import { CloudAnchorService } from './cloud-anchor.service'
import { CloudAnchorController } from './cloud-anchor.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CloudAnchor } from './entities/cloud-anchor.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CloudAnchor])],
  controllers: [CloudAnchorController],
  providers: [CloudAnchorService],
  exports: [CloudAnchorService],
})
export class CloudAnchorModule {}
