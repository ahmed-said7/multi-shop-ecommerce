import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe(
    {
      transform:true,
      transformOptions:{
        enableImplicitConversion:true
      }
    }
  ));
  // app.use(passport.initialize());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
