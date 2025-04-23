import { Injectable, Logger } from '@nestjs/common';
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
  watermark_bits?: number[];
  extracted_watermark?: number[];
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

  private stringToBinaryArray(str: string, length: number): number[] {
    // Convert string to binary array
    const binaryStr = str.split('').map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
    
    // Convert binary string to array of numbers
    const binaryArray = binaryStr.split('').map(bit => parseInt(bit, 10));
    
    // Pad or truncate to desired length
    if (binaryArray.length < length) {
      // Pad with zeros
      return [...binaryArray, ...Array(length - binaryArray.length).fill(0)];
    } else if (binaryArray.length > length) {
      // Truncate
      return binaryArray.slice(0, length);
    }
    return binaryArray;
  }

  private binaryArrayToString(bits: number[]): string {
    // Convert array of bits to binary string
    const binaryStr = bits.join('');
    console.log('Binary string:', binaryStr);
    
    // Split into 8-bit chunks
    const chunks = binaryStr.match(/.{1,8}/g) || [];
    console.log('Chunks:', chunks);
    
    // Convert each chunk to character
    const result = chunks.map((chunk, index) => {
      // For the last chunk, pad zeros at the beginning
      const paddedChunk = index === chunks.length - 1 && chunk.length < 8 
        ? chunk.padStart(8, '0') 
        : chunk;
      const charCode = parseInt(paddedChunk, 2);
      console.log(`Chunk: ${chunk}, Padded: ${paddedChunk}, CharCode: ${charCode}, Char: ${String.fromCharCode(charCode)}`);
      return String.fromCharCode(charCode);
    }).join('');
    
    console.log('Final result:', result);
    return result;
  }

  async embedWatermark(
    inputPath: string,
    outputPath: string,
    watermark: string,
    length: number = 63,
    options: WatermarkOptions = {}
  ): Promise<{ length: number; bits: number[] }> {
    return new Promise((resolve, reject) => {
      const binaryArray = this.stringToBinaryArray(watermark, length);
      const watermarkStr = binaryArray.join(',');

      const args = [
        'embed',
        '--input', inputPath,
        '--output', outputPath,
        '--watermark', watermarkStr,
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      Logger.debug(`Embedding watermark to ${inputPath} with args: ${args.join(' ')}`);

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
            if (response.status === 'success' && response.watermark_bits) {
              resolve({
                length: response.watermark_length!,
                bits: response.watermark_bits
              });
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
    length: number = 63,
    options: WatermarkOptions = {}
  ): Promise<{ bits: number[]; text: string }> {
    return new Promise((resolve, reject) => {
      const args = [
        'extract',
        '--input', inputPath,
        '--length', String(length),
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      Logger.debug(`Extracting watermark from ${inputPath} with args: ${args.join(' ')}`);

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
              const bits = response.extracted_watermark;
              const text = this.binaryArrayToString(bits);
              resolve({ bits, text });
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
    const { fileKey, watermark, length = 63 } = body;
    const file = await this.fileService.getFile(fileKey);
    if (!file) {
      throw new Error('File not found');
    }
    const inputPath = this.fileService.accessFilePath(fileKey);
    const outputPath = `${inputPath}_embed.png`;
    const result = await this.embedWatermark(inputPath, outputPath, watermark, length, {
      passwordImg: 1,
      passwordWm: 1
    });
    return {
      originalFile: file,
      watermarkFile: path.basename(outputPath),
      watermarkLength: result.length,
      watermarkBits: result.bits
    }
  }
}
