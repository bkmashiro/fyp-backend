import { Injectable } from '@nestjs/common';
import { RegisterImageCopyrightDto } from './dto/register-image-copyright.dto';
import { VerifyImageCopyrightDto } from './dto/verify-image-copyright.dto';
import { HederaService } from './hedera/hedera.service';
import { GeoImageService } from '../geo-image/geo-image.service';
import { FileService } from '../file/file.service';
import { ImageCopyrightService } from './image-copyright.service';
import { CopyrightStatus, ImageCopyright } from './entities/image-copyright.entity';
import { imageHash } from 'image-hash';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class ConsensusService {
  constructor(
    private readonly hederaService: HederaService,
    private readonly geoImageService: GeoImageService,
    private readonly fileService: FileService,
    private readonly imageCopyrightService: ImageCopyrightService,
  ) {}

  defaultThreshold = 0.84;
  exactThreshold = 0.92;
  featureLength = 8;

  private async calculateImageHash(fileKey: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath = this.fileService.accessFilePath(fileKey);
      imageHash(filePath, this.featureLength, true, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  async calculateImageHashFromFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      // 创建临时文件
      const tempDir = os.tmpdir();
      const tempFilePath = path.join(tempDir, file.originalname);
      
      // 写入临时文件
      fs.writeFile(tempFilePath, file.buffer, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // 计算哈希值
        imageHash(tempFilePath, this.featureLength, true, (error, data) => {
          // 删除临时文件
          fs.unlink(tempFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting temp file:', unlinkErr);
            }
          });

          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    });
  }

  async getImageHash(file: Express.Multer.File) {
    try {
      const hash = await this.calculateImageHashFromFile(file);
      return {
        success: true,
        imageHash: hash,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
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
    console.log('imageHash', imageHash);
    // 创建版权记录
    const copyrightRecord = await this.imageCopyrightService.create(
      geoImage,
      dto.userId,
      imageHash,
    ) as ImageCopyright;

    try {
      // 将消息上链
      const raw_message = `${imageHash}:${dto.userId}`;
      const digest = this.hederaService.createDigest(raw_message, dto.userId)
      const transactionHash = await this.hederaService.submitHashMessage(
        raw_message, 
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
          message: digest,
        }
      );

      return {
        message: digest,
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
    
    // 按相似度分类
    const exactMatches = records.filter(record => record.similarity >= this.exactThreshold);
    const potentialMatches = records.filter(record => record.similarity >= this.defaultThreshold && record.similarity < this.exactThreshold);

    // 检查是否有完全匹配的记录
    const exactMatch = exactMatches.find(record => record.userId === dto.userId);
    const potentialMatch = potentialMatches.find(record => record.userId === dto.userId);

    // 构建返回结果
    const result = {
      isValid: !!exactMatch,
      message: exactMatch 
        ? 'Image copyright verification successful (exact match)'
        : potentialMatch
          ? 'Potential match found, but not exact'
          : records.length > 0
            ? 'Similar images found but no matching user'
            : 'No similar images found',
      details: {
        imageHash: dto.imageHash,
        userId: dto.userId,
        matches: {
          exact: exactMatches,
          potential: potentialMatches
        },
        verificationStatus: exactMatch 
          ? 'EXACT_MATCH'
          : potentialMatch
            ? 'POTENTIAL_MATCH'
            : records.length > 0
              ? 'SIMILAR_FOUND_NO_USER_MATCH'
              : 'NOT_FOUND'
      }
    };

    return result;
  }
}
