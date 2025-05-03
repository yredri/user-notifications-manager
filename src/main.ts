import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error if unknown props passed
      transform: true,           // Automatically transform payloads into DTO instances
    }),
  );

  //app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
