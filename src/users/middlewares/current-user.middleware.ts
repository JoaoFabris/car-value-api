import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../users.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User | null;
      // Adiciona o tipo do session à interface do Request do Express
      session?: {
        userId?: number;
      } | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      try {
        // Garante a conversão para number caso o valor venha como string
        const parsedId =
          typeof userId === 'string' ? parseInt(userId, 10) : userId;
        const user = await this.usersService.findOne(parsedId);

        req.currentUser = user;
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Erro ao buscar usuário atual:', error.message);
        req.currentUser = null;
      }
    }

    next();
  }
}
