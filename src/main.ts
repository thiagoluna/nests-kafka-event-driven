import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConsumerConfig } from './config/kafka.config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Logger já configurado no módulo

  // Habilitar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma o payload em DTO
      whitelist: true, // Remove campos extras não definidos no DTO
      forbidNonWhitelisted: true, // Rejeita payloads com campos desconhecidos
      validationError: { target: false }, // Simplifica a mensagem de erro
      exceptionFactory: (errors) => {
        const messages = errors.map((err) => {
          const constraints = err.constraints || {}; // Garante que constraints não seja undefined
          return `${err.property} - ${Object.values(constraints).join(', ')}`;
        });
        return new BadRequestException(`Validation failed: ${messages.join('; ')}`);
      },
    }),
  );

  app.connectMicroservice(kafkaConsumerConfig);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
