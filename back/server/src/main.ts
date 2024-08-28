import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './http-exeception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 전역 exeception filter 설정
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Forest API')
    .setDescription('Authentication API documentation')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
