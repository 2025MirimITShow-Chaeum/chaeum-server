import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ColorService } from './color/color.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chaeum API')
    .setDescription('The Chaeum API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const colorService = app.get(ColorService); // 색상 저장때문에 추가
  await colorService.seedColors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
