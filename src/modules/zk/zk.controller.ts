import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZkService } from './zk.service';
import { CreateArtworkProofDto, VerifyArtworkOwnershipDto } from './dto/zk.dto';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';

@Controller('zk')
@ApiTags('zk')
export class ZkController {
  constructor(private readonly zkService: ZkService) {}

  @Post('generate-keccak256-hash')
  @ApiOperation({ summary: 'Generate keccak256 hash from a file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async generateKeccak256Hash(@UploadedFile() file: Express.Multer.File) {
    return this.zkService.generateKeccak256Hash(file);
  }

  @Post('generate-key-pair')
  @ApiOperation({ summary: 'Generate a new key pair' })
  async generateKeyPair() {
    return this.zkService.generateKeyPair();
  }

  @Post('create-artwork-proof')
  @ApiOperation({ summary: 'Create artwork proof' })
  async createArtworkProof(@Body() dto: CreateArtworkProofDto) {
    return this.zkService.createArtworkProof(dto);
  }

  @Post('verify-artwork-ownership')
  @ApiOperation({ summary: 'Verify artwork ownership' })
  async verifyArtworkOwnership(@Body() dto: VerifyArtworkOwnershipDto) {
    return this.zkService.verifyArtworkOwnership(dto);
  }
} 