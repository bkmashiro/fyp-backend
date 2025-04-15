import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { CreateWatermarkDto } from './dto/CreateWatermark.dto';
import { FileService } from '../file/file.service';
import * as path from 'path';

interface WatermarkOptions {
  passwordImg?: number;
  passwordWm?: number;
}

interface WatermarkResponse {
  status: string;
  message: string;
  watermark_length?: number;
  extracted_watermark?: string;
}

@Injectable()
export class WatermarkService {
  private executablePath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService
  ) {
    this.executablePath = this.configService.get('WATERMARK_EXECUTABLE_PATH');

    // setTimeout(async () => {
    //   // const result = await this.embedWatermark('/home/yz/fyp/fyp-backend/uploads/test/5638f7bf-b320-4aee-aa7d-f5bf6ff27cb8.png', 
    //   //   '/home/yz/fyp/fyp-backend/uploads/test/5638f7bf-b320-4aee-aa7d-f5bf6ff27cb8_embed.png', 'abcdefgh', {
    //   //   passwordImg: 1,
    //   //   passwordWm: 1
    //   // });

    //   const result = await this.embedWatermark('/home/yz/fyp/fyp-backend/uploads/test/03a33b30-0f2f-451e-a589-856f6f172095.png',
    //     '/home/yz/fyp/fyp-backend/uploads/test/03a33b30-0f2f-451e-a589-856f6f172095_embed.png', 'abcdefgh', {
    //     passwordImg: 1,
    //     passwordWm: 1
    //   });
    //   console.log('result', result);
    // }, 1000);


  }

  async embedWatermark(
    inputPath: string,
    outputPath: string,
    watermark: string,
    options: WatermarkOptions = {}
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const args = [
        'embed',
        '--input', inputPath,
        '--output', outputPath,
        '--watermark', watermark,
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      const watermarkProcess = spawn(this.executablePath, args);
      let outputData = '';

      watermarkProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      watermarkProcess.stderr.on('data', (data) => {
        console.error(`Watermark process error: ${data}`);
      });

      watermarkProcess.on('error', (error) => {
        reject(new Error(`Failed to start watermark process: ${error.message}`));
      });

      watermarkProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const response: WatermarkResponse = JSON.parse(outputData);
            if (response.status === 'success' && response.watermark_length !== undefined) {
              resolve(response.watermark_length);
            } else {
              reject(new Error(`Watermark process failed: ${response.message}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse watermark process output: ${error.message}`));
          }
        } else {
          reject(new Error(`Watermark process failed with code ${code}`));
        }
      });
    });
  }

  async extractWatermark(
    inputPath: string,
    wmLength: number = 63,
    options: WatermarkOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const args = [
        'extract',
        '--input', inputPath,
        '--length', String(wmLength),
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      const watermarkProcess = spawn(this.executablePath, args);
      let outputData = '';

      watermarkProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      watermarkProcess.stderr.on('data', (data) => {
        console.error(`Watermark process error: ${data}`);
      });

      watermarkProcess.on('error', (error) => {
        reject(new Error(`Failed to start watermark process: ${error.message}`));
      });

      watermarkProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const response: WatermarkResponse = JSON.parse(outputData);
            if (response.status === 'success' && response.extracted_watermark) {
              resolve(response.extracted_watermark);
            } else {
              reject(new Error(`Watermark extraction failed: ${response.message}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse watermark process output: ${error.message}`));
          }
        } else {
          reject(new Error(`Watermark process failed with code ${code}`));
        }
      });
    });
  }

  async createWatermark(body: CreateWatermarkDto) {
    const { fileKey, watermark } = body;
    const file = await this.fileService.getFile(fileKey);
    if (!file) {
      throw new Error('File not found');
    }
    const inputPath = this.fileService.accessFilePath(fileKey);
    const outputPath = `${inputPath}_embed.png`;
    const result = await this.embedWatermark(inputPath, outputPath, watermark, {
      passwordImg: 1,
      passwordWm: 1
    });
    return {
      originalFile: file,
      watermarkFile: path.basename(outputPath),
      watermarkLength: result
    }
  }
}
