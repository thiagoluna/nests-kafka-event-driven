import { Module } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { SlipsController } from './slips.controller';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaProducerConfig } from '../config/kafka.config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SLIPS_PUBLISHER', // Nome do cliente Kafka
        ...kafkaProducerConfig,  // Spread das opções do Kafka
      },
    ]),
  ],
  controllers: [SlipsController],
  providers: [SlipsService],
  exports: [SlipsService],
})
export class SlipsModule {}