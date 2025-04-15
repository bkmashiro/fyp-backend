import { Injectable } from '@nestjs/common'
import {
  Client,
  AccountId,
  PrivateKey,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicInfoQuery,
  TopicMessageQuery,
  TopicUpdateTransaction,
} from '@hashgraph/sdk'
import { ConfigService } from '@nestjs/config'
import { createHmac } from 'crypto'
import { MessageMetaService } from '../message-meta/message-meta.service'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Injectable()
export class HederaService {
  client: Client
  hmacPassword: string
  private _topicId: string

  constructor(
    private readonly configService: ConfigService,
    private readonly messageMetaService: MessageMetaService,
  ) {
    const operatorId = AccountId.fromString(
      configService.getOrThrow('ACCOUNT_ID'),
    )
    const operatorKey = PrivateKey.fromStringECDSA(
      configService.getOrThrow('HEX_PRIVATE_KEY'),
    )
    this.hmacPassword = configService.getOrThrow('HMAC_PASSWORD')

    this.client = Client.forTestnet() // 或者使用 Client.forMainnet() 连接主网
    this.client.setOperator(operatorId, operatorKey)

    // setTimeout(() => {
    // this.submitHashMessage('hello snapsphere', 'yuzhe')
    // this.validateHashMessage('hello snapsphere', 'yuzhe')
    // this.fetchMessages(this.topicId)
    // this.findMessages(this.topicId)
    // }, 1000)
  }

  set topicId(value: string) {
    this._topicId = value
  }

  get topicId(): string {
    return this._topicId
  }

  async createTopic(): Promise<string> {
    const isOldTopicExists = await this.checkTopicExists(this.topicId)

    if (isOldTopicExists) {
      return this.topicId
    }

    const transaction = await new TopicCreateTransaction().execute(this.client)
    const receipt = await transaction.getReceipt(this.client)
    const topicId = receipt.topicId
    console.log(`新建主题的ID: ${topicId}`)
    return topicId.toString()
  }

  async submitMessage(message: string, author: string = null) {
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId: this.topicId,
      message,
    }).execute(this.client)
    const getReceipt = await sendResponse.getReceipt(this.client)
    console.log(`消息提交状态: ${getReceipt.status}`)

    if (getReceipt.status._code === 22) {
      // SUCCESS
      this.messageMetaService.create({
        topicId: this.topicId,
        createdAt: new Date(),
        id: getReceipt.topicSequenceNumber.toString(),
        author,
      })
      return `${this.topicId}@${getReceipt.topicSequenceNumber}`
    }

    console.error('消息提交失败:', getReceipt.status)
    return null
  }

  createDigest(message: string, author: string = null) {
    const hmac = createHmac('sha256', `${this.hmacPassword}${author || ''}`)
    hmac.update(message)
    return hmac.digest('hex')
  }

  async submitHashMessage(message: string, author: string = null) {
    const digest = this.createDigest(message, author)
    return await this.submitMessage(digest, author)
  }

  async checkTopicExists(topicId: string): Promise<boolean> {
    if (!topicId) {
      return false
    }

    try {
      const topicInfo = await new TopicInfoQuery()
        .setTopicId(topicId)
        .execute(this.client)
      // console.log(`主题存在: ${topicId}`, topicInfo)
      return true
    } catch (error) {
      if (error.toString().includes('INVALID_TOPIC_ID')) {
        console.log(`主题不存在: ${topicId}`)
        return false
      }
      console.error('检查主题时发生错误:', error)
      throw error
    }
  }

  async fetchMessages(topicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0) // 查询所有历史消息
        .setEndTime(Date.now()) // 只查询过去的数据，避免持续订阅
        .subscribe(
          this.client,
          (error) => {
            console.error('查询失败：', error)
            reject(error)
          },
          (message) => {
            console.log(
              `历史消息：`,
              Buffer.from(message.contents).toString(),
              message.sequenceNumber,
            )
          },
        )

      resolve()
    })
  }

  async findMessages(
    topicId: string,
    begin?: Date,
    end?: Date,
  ): Promise<{ message: string; seqNo: string }[]> {
    const messages: Array<{ message: string; seqNo: string }> = []
    return new Promise((resolve, reject) => {
      // 用 Subject 来触发消息到达事件
      const messageSubject = new Subject<any>()

      const subscription = new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(begin ? begin.getTime() : 0)
        .setEndTime(end ? end.getTime() : Date.now())
        .subscribe(
          this.client,
          (error) => {
            console.error('查询失败：', error)
            subscription.unsubscribe()
            // 通知 subject 出现错误
            messageSubject.error(error)
            reject(error)
          },
          (message) => {
            const text = Buffer.from(message.contents).toString()
            console.log(`历史消息：`, text, message.sequenceNumber)
            messages.push({
              message: text,
              seqNo: message.sequenceNumber.toString(),
            })
            // 每次有消息时，都通知 subject
            messageSubject.next(message)
          },
        )

      // 使用 debounceTime，当一定时间内（比如 5 秒）没有新的消息时触发
      messageSubject.pipe(debounceTime(5000)).subscribe({
        next: () => {
          console.log('5 秒内没有新消息，resolve')
          subscription.unsubscribe()
          resolve(messages)
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }

  async compareMessage(message: string, hash: string, author: string = null) {
    const hmac = createHmac('sha256', `${this.hmacPassword}${author || ''}`)
    hmac.update(message)
    const digest = hmac.digest('hex')
    return digest === hash
  }

  async validateHashMessage(
    content: string,
    author: string = null,
    begin?: Date,
    end?: Date,
  ) {
    const messages = await this.findMessages(this.topicId, begin, end)
    console.log(
      `topicId: ${this.topicId}, from: ${begin}, to: ${end}`,
      messages,
    )
    if (messages) {
      for (const { message: msgHash, seqNo } of messages) {
        if (await this.compareMessage(content, msgHash, author)) {
          console.log(`消息验证成功: ${seqNo}`)

          console.log(`${msgHash} === hash(${content}, INTERNAL_KEY:${author})`)
          return true
        }
      }
    }

    return false
  }

  async getTopicInfo(topicId: string) {
    const topicInfo = await new TopicInfoQuery()
      .setTopicId(topicId)
      .execute(this.client);
    
    return {
      memo: topicInfo.topicMemo,
      expirationTime: new Date(topicInfo.expirationTime.toDate()),
      autoRenewPeriod: Number(topicInfo.autoRenewPeriod.seconds),
    };
  }

  async renewTopic(topicId: string) {
    const topicInfo = await this.getTopicInfo(topicId);
    const newExpirationTime = new Date(topicInfo.expirationTime);
    newExpirationTime.setDate(newExpirationTime.getDate() + 90); // 续期90天
    
    const transaction = await new TopicUpdateTransaction()
      .setTopicId(topicId)
      .setExpirationTime(newExpirationTime)
      .execute(this.client);
    
    await transaction.getReceipt(this.client);
    return this.getTopicInfo(topicId);
  }
}
