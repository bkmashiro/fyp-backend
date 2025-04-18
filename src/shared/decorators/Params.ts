import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  applyDecorators,
  Param,
} from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed')
    }
    return val
  }
}

export function IntParam(paramName: string) {
  return Param(paramName, ParseIntPipe)
}
