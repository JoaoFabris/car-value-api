import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // 1. Gera um salt aleatório (8 bytes -> 16 chars em hex)
    const salt = randomBytes(8).toString('hex');

    // 2. Deriva o hash a partir da senha + salt
    //    scrypt retorna um Buffer, então convertemos pra hex
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 3. Guarda salt e hash juntos, separados por ponto, por o hash estar como Buffer(codigo binário bruto:
    //  <Buffer 9f 3a 88 c1 ... > (32 bytes binários, ilegível como texto))
    // ele precisa se formatado para toString('hex') e salvo no banco
    const result = `${salt}.${hash.toString('hex')}`;

    // 4. Salva no banco (não a senha, o "result")
    const user = await this.usersService.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // Recupera o salt que foi guardado junto com o hash
    const [salt, storedHash] = user.password.split('.');

    // Refaz o hash usando a MESMA senha informada + o MESMO salt salvo
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Compara o hash recém-calculado com o que está no banco
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
