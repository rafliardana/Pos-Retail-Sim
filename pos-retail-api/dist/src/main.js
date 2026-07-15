"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: '*' });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('SimRetail POS API')
        .setDescription('REST API untuk Sistem Informasi Manajemen Retail - Kelompok 4')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    swagger_1.SwaggerModule.setup('api', app, swagger_1.SwaggerModule.createDocument(app, config));
    await app.listen(process.env.PORT ?? 3000);
    console.log(`\n🚀 Server berjalan di: http://localhost:${process.env.PORT ?? 3000}`);
    console.log(`📚 Dokumentasi API: http://localhost:${process.env.PORT ?? 3000}/api\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map