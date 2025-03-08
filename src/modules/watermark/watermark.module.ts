import { Module } from '@nestjs/common';
import { WatermarkService } from './watermark.service';
import { WatermarkController } from './watermark.controller';
import { FileModule } from '../file/file.module';

@Module({
  imports: [FileModule],
  providers: [WatermarkService],
  controllers: [WatermarkController]
})
export class WatermarkModule {}
