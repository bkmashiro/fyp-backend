import { Controller, Post } from '@nestjs/common'
import { HederaService } from './hedera/hedera.service'
import { MessageMetaService } from './message-meta/message-meta.service'
import { ValidateMessageDto } from './dto/validate-message.dto'
import { CreateMessageDto } from './dto/create-message.dto'

@Controller('consensus')
export class ConsensusController {
  constructor(
    private readonly hederaService: HederaService,
    private readonly messageMetaService: MessageMetaService,
  ) {}

  @Post('create-message')
  async createMessage(createMessageDto: CreateMessageDto) {
    this.hederaService.submitHashMessage(
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
      validateMessageDto.message,
      validateMessageDto.author,
      validateMessageDto.from,
      validateMessageDto.to,
    )
  }
}
