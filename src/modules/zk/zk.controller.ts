import { Controller, Post, Body } from '@nestjs/common';
import { ZkService } from './zk.service';
import { CreateArtworkProofDto, VerifyArtworkOwnershipDto } from './dto/zk.dto';

@Controller('zk')
export class ZkController {
  constructor(private readonly zkService: ZkService) {}

  @Post('create-proof')
  async createArtworkProof(@Body() dto: CreateArtworkProofDto) {
    return this.zkService.createArtworkProof(dto);
  }

  @Post('verify-ownership')
  async verifyArtworkOwnership(@Body() dto: VerifyArtworkOwnershipDto) {
    return this.zkService.verifyArtworkOwnership(dto);
  }
} 