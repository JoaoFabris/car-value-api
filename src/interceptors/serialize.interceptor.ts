import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // map é um operador do RxJS usado para transformar
// o valor emitido por um Observable.
import { plainToClass } from 'class-transformer'; // plainToClass transforma um objeto JavaScript comum (plain object)
// em uma instância de uma classe específica.

interface ClassConstructor {
  new (...arg: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  // With "implements", TypeScript checks that this class
  // follows the contract defined by the NestInterceptor interface.
  // It is mainly a compile-time contract check.7
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Run something before the request is handled.

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out.

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, //ignore qualquer propriedade que não esteja explicitamente marcada para ser exposta
        });
      }),
    );
  }
}
