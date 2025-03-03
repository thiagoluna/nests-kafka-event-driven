import { Module } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { SlipsController } from './slips.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SPLITS_PUBLISHER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'splits',
            brokers: ['kafka:9092'], // internal docker port
          },
        },
      },
    ]),
  ],
  controllers: [SlipsController],
  providers: [SlipsService],
  exports: [SlipsService],
})
export class SlipsModule {}
