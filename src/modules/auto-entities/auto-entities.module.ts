import { DynamicModule, Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EntitySchema } from 'typeorm'

@Global()
@Module({})
export class AutoEntitiesModule {
  constructor() {}

  private static entities: (Function | EntitySchema)[] = []

  static registerEntity(entity: Function | EntitySchema) {
    this.entities.push(entity)
  }

  static async forRootAsync(): Promise<DynamicModule> {
    return {
      module: AutoEntitiesModule,
      imports: [TypeOrmModule.forFeature(this.entities)],
      exports: [TypeOrmModule],
    }
  }
}
