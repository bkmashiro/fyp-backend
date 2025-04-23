import { Controller, Post, Body, Get, Param, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { HederaService } from './hedera/hedera.service'
import { MessageMetaService } from './message-meta/message-meta.service'
import { ValidateMessageDto } from './dto/validate-message.dto'
import { CreateMessageDto } from './dto/create-message.dto'
import { ConsensusService } from './consensus.service'
import { RegisterImageCopyrightDto } from './dto/register-image-copyright.dto'
import { VerifyImageCopyrightDto } from './dto/verify-image-copyright.dto'
import { ApiTags, ApiOperation, ApiParam, ApiConsumes } from '@nestjs/swagger'
import { ImageCopyrightService } from './image-copyright.service'
import { TopicType } from './types/topic-type.enum'

@Controller('consensus')
@ApiTags('consensus')
export class ConsensusController {
  constructor(
    private readonly hederaService: HederaService,
    private readonly messageMetaService: MessageMetaService,
    private readonly consensusService: ConsensusService,
    private readonly imageCopyrightService: ImageCopyrightService,
  ) {}

  @Post('create-message')
  async createMessage(createMessageDto: CreateMessageDto) {
    this.hederaService.submitHashMessage(
      TopicType.MESSAGE,
      createMessageDto.message,
      createMessageDto.author,
    )
  }

  /**
   * Is author has a valid message in the time range in the blockchain
   *
   * hashed message is stored in the blockchain
   *
   *  == hash(message + author) in blockchain?
   *
   * @param message
   * @param author
   * @param begin
   * @param end
   * @returns
   */
  @Post('validate-message')
  async validateMessage(validateMessageDto: ValidateMessageDto) {
    return await this.hederaService.validateHashMessage(
      TopicType.MESSAGE,
      validateMessageDto.message,
      validateMessageDto.author,
      validateMessageDto.from,
      validateMessageDto.to,
    )
  }

  @Post('register-image-copyright')
  @ApiOperation({ summary: 'Register image copyright on blockchain' })
  async registerImageCopyright(@Body() dto: RegisterImageCopyrightDto) {
    return this.consensusService.registerImageCopyright(dto)
  }

  @Post('verify-image-copyright')
  @ApiOperation({ summary: 'Verify if an image belongs to a specific user' })
  async verifyImageCopyright(@Body() dto: VerifyImageCopyrightDto) {
    return this.consensusService.verifyImageCopyright(dto)
  }

  @Get('copyright/:geoImageId')
  @ApiOperation({ summary: 'Get copyright information for a specific image' })
  @ApiParam({ name: 'geoImageId', description: 'GeoImage ID' })
  async getCopyrightInfo(@Param('geoImageId') geoImageId: string) {
    const info = await this.imageCopyrightService.getCopyrightInfo(geoImageId)
    if (!info) {
      return {
        message: 'No copyright information found for this image',
        status: 'NOT_FOUND',
      }
    }

    return {
      message: 'Copyright information retrieved successfully',
      details: info,
      status: 'SUCCESS',
    }
  }

  @Post('calculate-image-hash')
  @ApiOperation({ summary: 'Calculate hash for an uploaded image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async calculateImageHash(@UploadedFile() file: Express.Multer.File) {
    return this.consensusService.getImageHash(file)
  }

  @Get('geo-images/message-prefix/:prefix')
  @ApiOperation({ summary: 'Find geo-images by message prefix' })
  @ApiParam({ name: 'prefix', description: 'Message prefix to search for' })
  async findGeoImagesByMessagePrefix(@Param('prefix') prefix: string) {
    const geoImages = await this.imageCopyrightService.findGeoImagesByMessagePrefix(prefix);
    return {
      message: 'Geo-images retrieved successfully',
      data: geoImages,
      status: 'SUCCESS',
    };
  }
}
