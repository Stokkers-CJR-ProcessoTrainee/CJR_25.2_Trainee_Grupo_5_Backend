import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { decodeId } from '../hashid';
 

@Injectable()
export class HashIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const id = decodeId(value);

    if (id === undefined) {
      throw new BadRequestException('ID inválido');
    }

    return id;
  }
}