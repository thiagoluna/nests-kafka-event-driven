import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PayloadExecuteSlipMessageDto } from './dtos/slip.dto';

@Injectable()
export class SlipsService {
    constructor(
        @Inject('SPLITS_PUBLISHER')
        private readonly kafkaClient: ClientKafka
    ) {}

    async executeSlip(payload: PayloadExecuteSlipMessageDto) {
        
        // Send request generate slip to Kobana
        console.log('Message Payload: ', payload);
        console.log('Sending Request to Kobana...');
        console.log('Generating slip...');
        console.log('Sending slip status to Kafka topic (bankslip-status)...');

        // After generate slip from Kobana, send response to Kafka topic (bankslip-status)
        this.kafkaClient.emit('bankslip-status', {
            external_id: payload.external_id,
            status: 'CLOSED',
        });
    }
}
