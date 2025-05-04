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
import { TopicType } from '../types/topic-type.enum'

@Injectable()
export class HederaService {
  client: Client
  hmacPassword: string
  private topicIds: Map<TopicType, string> = new Map()

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
  }

  setTopicId(type: TopicType, value: string) {
    console.log(`set topicId for ${type}:`, value)
    this.topicIds.set(type, value)
  }

  getTopicId(type: TopicType): string {
    const topicId = this.topicIds.get(type)
    if (!topicId) {
      throw new Error(`Topic ID for type ${type} is not set`)
    }
    return topicId
  }

  async createTopic(): Promise<string> {
    const transaction = await new TopicCreateTransaction().execute(this.client)
    const receipt = await transaction.getReceipt(this.client)
    const topicId = receipt.topicId
    console.log(`新建主题的ID: ${topicId}`)
    return topicId.toString()
  }

  async submitMessage(type: TopicType, message: string, author: string = null) {
    const topicId = this.getTopicId(type)
    const sendResponse = await new TopicMessageSubmitTransaction({
      topicId,
      message,
    }).execute(this.client)
    const getReceipt = await sendResponse.getReceipt(this.client)
    console.log(`消息提交状态: ${getReceipt.status}`)

    if (getReceipt.status._code === 22) {
      // SUCCESS
      this.messageMetaService.create({
        topicId,
        createdAt: new Date(),
        id: getReceipt.topicSequenceNumber.toString(),
        author,
      })
      return `${topicId}@${getReceipt.topicSequenceNumber}`
    }

    console.error('消息提交失败:', getReceipt.status)
    return null
  }

  createDigest(message: string, author: string = null) {
    const hmac = createHmac('sha256', `${this.hmacPassword}${author || ''}`)
    hmac.update(message)
    return hmac.digest('hex')
  }

  async submitHashMessage(type: TopicType, message: string, author: string = null) {
    const digest = this.createDigest(message, author)
    return await this.submitMessage(type, digest, author)
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

  async fetchMessages(type: TopicType): Promise<void> {
    const topicId = this.getTopicId(type)
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
    type: TopicType,
    begin?: Date,
    end?: Date,
  ): Promise<{ message: string; seqNo: string }[]> {
    const topicId = this.getTopicId(type)
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
            // console.log(`历史消息：`, text, message.sequenceNumber)
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
    type: TopicType,
    content: string,
    author: string = null,
    begin?: Date,
    end?: Date,
  ) {
    const messages = await this.findMessages(type, begin, end)
    console.log(
      `topicId: ${this.getTopicId(type)}, from: ${begin}, to: ${end}`,
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
      .execute(this.client)

    return {
      memo: topicInfo.topicMemo,
      expirationTime: new Date(topicInfo.expirationTime.toDate()),
      autoRenewPeriod: Number(topicInfo.autoRenewPeriod.seconds),
    }
  }

  async renewTopic(topicId: string) {
    const topicInfo = await this.getTopicInfo(topicId)
    const newExpirationTime = new Date(topicInfo.expirationTime)
    newExpirationTime.setDate(newExpirationTime.getDate() + 90) // 续期90天

    const transaction = await new TopicUpdateTransaction()
      .setTopicId(topicId)
      .setExpirationTime(newExpirationTime)
      .execute(this.client)

    await transaction.getReceipt(this.client)
    return this.getTopicInfo(topicId)
  }

  async submitToChain(type: TopicType, { proof, publicSignals, artworkHash, pubKeyHash, validUntil }) {
    const topicId = this.getTopicId(type)
    await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(
        JSON.stringify({
          artworkHash,
          pubKeyHash,
          proof,
          publicSignals,
          validUntil
        }),
      )
      .execute(this.client)
  }

  async findRecord(
    type: TopicType, 
    params: { 
      artworkHash: string; 
      pubKeyHash?: string 
    }
  ) {
    const topicId = this.getTopicId(type)
    console.log(`在 topic ${topicId} 中查找记录:`, params)
    const messages = await this.findMessages(type)
    
    for (const { message, seqNo } of messages) {
      try {
        console.log(`尝试解析消息 (seqNo: ${seqNo}):`, message)
        const record = JSON.parse(message)
        // 如果提供了 pubKeyHash，则同时匹配 artworkHash 和 pubKeyHash
        // 否则只匹配 artworkHash
        if (params.pubKeyHash) {
          if (record.artworkHash === params.artworkHash && record.pubKeyHash === params.pubKeyHash) {
            console.log('找到完全匹配的记录:', record)
            return record
          }
        } else {
          if (record.artworkHash === params.artworkHash) {
            console.log('找到 artworkHash 匹配的记录:', record)
            return record
          }
        }
      } catch (error) {
        console.error(`解析消息失败 (seqNo: ${seqNo}):`, error)
        continue
      }
    }
    
    console.log('未找到匹配的记录')
    return null
  }
}
