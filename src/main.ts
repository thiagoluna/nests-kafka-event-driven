import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    name: 'KAFKA_SERVICE',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'bankslip-consumer',
        brokers: ['kafka:9092'],
        logLevel: 4,
      },
      consumer: {
        groupId: 'slip-consumer',
        heartbeatInterval: 3000, // Intervalo de heartbeat em ms (padrão: 3000)
            sessionTimeout: 30000,   // Tempo máximo para considerar o consumidor inativo (padrão: 30000)
            rebalanceTimeout: 60000, // Tempo máximo para completar o rebalanceamento (padrão: 60000)
      },
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
