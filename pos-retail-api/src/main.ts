import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan validasi input global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Aktifkan CORS agar bisa diakses dari frontend
  app.enableCors({ origin: '*' });

  // Setup Swagger UI di /api
  const config = new DocumentBuilder()
    .setTitle('SimRetail POS API')
    .setDescription('REST API untuk Sistem Informasi Manajemen Retail - Kelompok 4')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
  console.log(`\n🚀 Server berjalan di: http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Dokumentasi API: http://localhost:${process.env.PORT ?? 3000}/api\n`);
}

bootstrap();
