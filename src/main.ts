import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.useGlobalPipes(new ValidationPipe(
  //   {
  //     whitelist:true,
  //     transform:true,
  //     transformOptions:{
  //       enableImplicitConversion:true
  //     }
  //   }
  // ));
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions:{
          enableImplicitConversion:true
      }
    })
  );
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({ detailedErrors: false }),
  );
  // app.use(passport.initialize());
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
