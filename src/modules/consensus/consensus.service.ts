import { Injectable } from '@nestjs/common';
import { RegisterImageCopyrightDto } from './dto/register-image-copyright.dto';
import { VerifyImageCopyrightDto } from './dto/verify-image-copyright.dto';
import { HederaService } from './hedera/hedera.service';
import { GeoImageService } from '../geo-image/geo-image.service';
import { FileService } from '../file/file.service';
import { ImageCopyrightService } from './image-copyright.service';
import { CopyrightStatus, ImageCopyright } from './entities/image-copyright.entity';
import { imageHash } from 'image-hash';

@Injectable()
export class ConsensusService {
  constructor(
    private readonly hederaService: HederaService,
    private readonly geoImageService: GeoImageService,
    private readonly fileService: FileService,
    private readonly imageCopyrightService: ImageCopyrightService,
  ) {}

  private async calculateImageHash(fileKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = this.fileService.accessFilePath(fileKey);
      imageHash(filePath, 16, true, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  async registerImageCopyright(dto: RegisterImageCopyrightDto) {
    // 获取 geo-image 信息
    const geoImage = await this.geoImageService.findOne(dto.geoImageId);
    if (!geoImage) {
      throw new Error('GeoImage not found');
    }

    // 检查是否已经注册过
    const existingRecord = await this.imageCopyrightService.findByGeoImageId(dto.geoImageId);
    if (existingRecord && existingRecord.status === CopyrightStatus.REGISTERED) {
      return {
        message: 'Image copyright already registered',
        details: {
          geoImageId: dto.geoImageId,
          imageHash: existingRecord.imageHash,
          userId: existingRecord.userId,
          status: existingRecord.status,
        }
      };
    }

    // 计算图片的哈希值
    const imageHash = await this.calculateImageHash(geoImage.ossFile.key);
    
    // 创建版权记录
    const copyrightRecord = await this.imageCopyrightService.create(
      geoImage,
      dto.userId,
      imageHash
    ) as ImageCopyright;

    try {
      // 将消息上链
      const message = `${imageHash}:${dto.userId}`;
      const transactionHash = await this.hederaService.submitHashMessage(
        message,
        dto.userId
      );

      if (!transactionHash) {
        throw new Error('Failed to get transaction hash');
      }

      // 更新版权记录状态
      await this.imageCopyrightService.updateStatus(
        copyrightRecord.id,
        CopyrightStatus.REGISTERED,
        transactionHash,
        {
          topicId: this.hederaService.topicId,
          sequenceNumber: transactionHash.split('@')[1],
          timestamp: new Date().toISOString(),
          message: message,
        }
      );

      return {
        message,
        transactionHash,
        status: 'Image copyright registration successful',
        details: {
          geoImageId: dto.geoImageId,
          imageHash,
          userId: dto.userId,
          status: CopyrightStatus.REGISTERED,
        }
      };
    } catch (error) {
      // 更新版权记录状态为失败
      await this.imageCopyrightService.updateStatus(
        copyrightRecord.id,
        CopyrightStatus.FAILED
      );
      throw error;
    }
  }

  async verifyImageCopyright(dto: VerifyImageCopyrightDto) {
    // 首先从本地数据库查询
    const records = await this.imageCopyrightService.findRegisteredByImageHash(dto.imageHash);
    if (records.length > 0) {
      const matchingRecord = records.find(record => record.userId === dto.userId);
      if (matchingRecord) {
        return {
          isValid: true,
          message: 'Image copyright verification successful (from local database)',
          details: {
            imageHash: dto.imageHash,
            userId: dto.userId,
            geoImageId: matchingRecord.geoImage.id,
            status: matchingRecord.status,
            transactionHash: matchingRecord.transactionHash,
          }
        };
      }
    }

    // 如果在本地数据库中没有找到，则查询区块链
    const message = `${dto.imageHash}:${dto.userId}`;
    const isValid = await this.hederaService.validateHashMessage(
      message,
      dto.userId,
      dto.from,
      dto.to
    );

    return {
      isValid,
      message: isValid 
        ? 'Image copyright verification successful (from blockchain)' 
        : 'Image copyright verification failed',
      details: {
        imageHash: dto.imageHash,
        userId: dto.userId,
        timeRange: {
          from: dto.from,
          to: dto.to,
        }
      }
    };
  }
}
