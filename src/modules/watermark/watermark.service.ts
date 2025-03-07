import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';

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
  constructor(private readonly configService: ConfigService) {}

  async embedWatermark(
    inputPath: string,
    outputPath: string,
    watermark: string,
    options: WatermarkOptions = {}
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      const executablePath = this.configService.get('WATERMARK_EXECUTABLE_PATH');
      const args = [
        'embed',
        '--input', inputPath,
        '--output', outputPath,
        '--watermark', watermark,
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      const watermarkProcess = spawn(executablePath, args);
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
    wmLength: number,
    options: WatermarkOptions = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const executablePath = this.configService.get('WATERMARK_EXECUTABLE_PATH');
      const args = [
        'extract',
        '--input', inputPath,
        '--length', String(wmLength),
        '--password_img', String(options.passwordImg || 1),
        '--password_wm', String(options.passwordWm || 1)
      ];

      const watermarkProcess = spawn(executablePath, args);
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
}
