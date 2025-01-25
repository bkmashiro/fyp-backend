import { Module } from '@nestjs/common';
import { FasterCrudService } from './faster-crud.service';
import { FasterCrudController } from './faster-crud.controller';

@Module({
  providers: [FasterCrudService],
  controllers: [FasterCrudController]
})
export class FasterCrudModule {}
