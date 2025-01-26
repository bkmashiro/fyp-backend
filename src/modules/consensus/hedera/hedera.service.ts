import { Injectable } from '@nestjs/common'
import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
} from '@hashgraph/sdk'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HederaService {
  client: Client

  constructor(configService: ConfigService) {
    const operatorId = AccountId.fromString(
      configService.getOrThrow('EVM_ADDRESS'),
    )
    const operatorKey = PrivateKey.fromStringECDSA(
      configService.getOrThrow('HEX_PRIVATE_KEY'),
    )

    this.client = Client.forTestnet() // 或者使用 Client.forMainnet() 连接主网
    this.client.setOperator(operatorId, operatorKey)
  }

  async createTopic(): Promise<string> {
    const transaction = await new TopicCreateTransaction().execute(this.client)
    const receipt = await transaction.getReceipt(this.client)
    const topicId = receipt.topicId
    console.log(`新建主题的ID: ${topicId}`)
    return topicId.toString()
  }

  async submitMessage(topicId: string, message: string) {
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId,
      message,
    }).execute(this.client)
    const getReceipt = await sendResponse.getReceipt(this.client)
    console.log(`消息提交状态: ${getReceipt.status}`)
  }
}
