import { Transport, KafkaOptions } from '@nestjs/microservices';

// Configuração para o consumidor (usada no main.ts)
export const kafkaConsumerConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'bankslip-consumer',
      brokers: ['kafka:9092'],
      logLevel: 4,
    },
    consumer: {
      groupId: 'slip-consumer',
      heartbeatInterval: 3000,
      sessionTimeout: 30000,
      rebalanceTimeout: 60000,
    },
  },
};

// Configuração para o produtor (usada no slips.module.ts)
export const kafkaProducerConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'slips-producer',
      brokers: ['kafka:9092'],
    },
    producer: {
      retry: {
        retries: 3,
      },
    },
  },
};