import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HederaTopic } from '../entities/hedera-topic.entity'
import { HederaService } from '../hedera/hedera.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { TopicType } from '../types/topic-type.enum'

@Injectable()
export class HederaTopicService implements OnModuleInit {
  private topicIds: Map<TopicType, string> = new Map()

  constructor(
    @InjectRepository(HederaTopic)
    private readonly topicRepository: Repository<HederaTopic>,
    private readonly hederaService: HederaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 系统启动时恢复或创建 topics
    await this.initializeTopics()
  }

  private async initializeTopics() {
    // 为每种类型初始化 topic
    for (const type of Object.values(TopicType)) {
      await this.initializeTopic(type)
    }
  }

  private async initializeTopic(type: TopicType) {
    // 尝试从数据库获取活跃的 topic
    const activeTopic = await this.topicRepository.findOne({
      where: { isActive: true, type },
      order: { createdAt: 'DESC' },
    })

    if (activeTopic) {
      // 验证 topic 是否仍然有效
      const isValid = await this.hederaService.checkTopicExists(
        activeTopic.topicId,
      )
      if (isValid) {
        this.hederaService.setTopicId(type, activeTopic.topicId)
        Logger.debug(`恢复使用现有 ${type} topic: ${activeTopic.topicId}`)
        return
      } else {
        // 如果 topic 无效，标记为非活跃
        await this.topicRepository.update(activeTopic.id, { isActive: false })
      }
    }

    // 创建新的 topic
    const newTopicId = await this.hederaService.createTopic()
    const topicInfo = await this.hederaService.getTopicInfo(newTopicId)

    // 保存新 topic 信息到数据库
    const newTopic = this.topicRepository.create({
      topicId: newTopicId,
      type,
      memo: topicInfo.memo,
      expirationTime: topicInfo.expirationTime,
      autoRenewPeriod: Number(topicInfo.autoRenewPeriod),
      isActive: true,
    })

    await this.topicRepository.save(newTopic)
    this.hederaService.setTopicId(type, newTopicId)
    Logger.debug(`创建并使用新 ${type} topic: ${newTopicId}`)
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkAndRenewTopics() {
    const topics = await this.topicRepository.find({
      where: { isActive: true },
    })

    for (const topic of topics) {
      try {
        const topicInfo = await this.hederaService.getTopicInfo(topic.topicId)
        const now = new Date()
        const thirtyDaysFromNow = new Date(
          now.getTime() + 30 * 24 * 60 * 60 * 1000,
        )

        if (topicInfo.expirationTime < thirtyDaysFromNow) {
          // 如果 topic 即将过期，尝试续期
          await this.hederaService.renewTopic(topic.topicId)
          const updatedInfo = await this.hederaService.getTopicInfo(
            topic.topicId,
          )

          // 更新数据库中的过期时间
          await this.topicRepository.update(topic.id, {
            expirationTime: updatedInfo.expirationTime,
          })

          Logger.debug(`Topic ${topic.topicId} (${topic.type}) 已续期`)
        }
      } catch (error) {
        Logger.error(`处理 topic ${topic.topicId} (${topic.type}) 时出错:`, error)
        // 如果 topic 已失效，标记为非活跃
        if (error.toString().includes('INVALID_TOPIC_ID')) {
          await this.topicRepository.update(topic.id, { isActive: false })
          // 创建新的 topic
          await this.initializeTopic(topic.type)
        }
      }
    }
  }

  getTopicId(type: TopicType): string {
    const topicId = this.topicIds.get(type)
    if (!topicId) {
      throw new Error(`Topic ID for type ${type} is not set`)
    }
    return topicId
  }

  async getTopicHistory() {
    return this.topicRepository.find({
      order: { createdAt: 'DESC' },
    })
  }
}