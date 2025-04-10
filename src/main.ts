import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Adiciona globalmente os pipes de validação
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Votação')
    .setDescription('Documentação da API de votação interna e pública')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: 'GET, POST', // pensar sobre acrescentar a limitacao de headers, exemplo: allowedHeaders: 'Content-Type, Authorization'
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
