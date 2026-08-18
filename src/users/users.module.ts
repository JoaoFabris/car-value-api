import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    { provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }, // ANY REQUEST COMING FROM ANYWHERE FROM OUR APP, IS GOING WILL HAVE THIS INTERCEPTOR APPLY
  ],
})
export class UsersModule {}
