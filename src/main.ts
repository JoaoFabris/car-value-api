import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  // validation pipe and cookie session is define in app.module, so it can run in others env, like so test env
}
bootstrap();
// our main is like this, cause this solution is more 'nest approach'. so in module 13 , class 115, he sad we can choose from this our the 'easy way'
