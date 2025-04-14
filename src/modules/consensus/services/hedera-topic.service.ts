import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HederaTopic } from '../entities/hedera-topic.entity'
import { HederaService } from '../hedera/hedera.service'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class HederaTopicService implements OnModuleInit {
  private currentTopicId: string

  constructor(
    @InjectRepository(HederaTopic)
    private readonly topicRepository: Repository<HederaTopic>,
    private readonly hederaService: HederaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    // 系统启动时恢复或创建 topic
    await this.initializeTopic()
  }

  private async initializeTopic() {
    // 尝试从数据库获取活跃的 topic
    const activeTopic = await this.topicRepository.findOne({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    })

    if (activeTopic) {
      // 验证 topic 是否仍然有效
      const isValid = await this.hederaService.checkTopicExists(
        activeTopic.topicId,
      )
      if (isValid) {
        this.currentTopicId = activeTopic.topicId
        this.hederaService.topicId = activeTopic.topicId
        Logger.debug(`恢复使用现有 topic: ${this.currentTopicId}`)
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
      memo: topicInfo.memo,
      expirationTime: topicInfo.expirationTime,
      autoRenewPeriod: Number(topicInfo.autoRenewPeriod),
      isActive: true,
    })

    await this.topicRepository.save(newTopic)
    this.currentTopicId = newTopicId
    this.hederaService.topicId = newTopicId
    Logger.debug(`创建并使用新 topic: ${this.currentTopicId}`)
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

          Logger.debug(`Topic ${topic.topicId} 已续期`)
        }
      } catch (error) {
        Logger.error(`处理 topic ${topic.topicId} 时出错:`, error)
        // 如果 topic 已失效，标记为非活跃
        if (error.toString().includes('INVALID_TOPIC_ID')) {
          await this.topicRepository.update(topic.id, { isActive: false })
          // 创建新的 topic
          await this.initializeTopic()
        }
      }
    }
  }

  getCurrentTopicId(): string {
    return this.currentTopicId
  }

  async getTopicHistory() {
    return this.topicRepository.find({
      order: { createdAt: 'DESC' },
    })
  }
}
