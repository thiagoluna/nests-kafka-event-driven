import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { winstonLogger } from '../config/logger.config'; 
import { BankSlipPayloadDto, SlipStatusDto } from './dtos/slip.dto';
import { SlipGeneratedEvent } from './events/slip-generated.event';

@Injectable()
export class SlipsService {
  private readonly logger = winstonLogger;

  constructor(
    @Inject('SLIPS_PUBLISHER') private readonly kafkaClient: ClientKafka,
  ) {
    this.logger.info('SlipsService initialized');
  }

  async executeSlip(payload: BankSlipPayloadDto): Promise<void> {
    this.logger.info(`Starting to process slip: ${payload?.external_id || 'undefined'}`);

    try {
      this.logger.info(`Processing slip for external_id: ${payload?.external_id || 'undefined'}`);
      
      const slipResult = await this.generateSlipFromKobana(payload);
      const event = new SlipGeneratedEvent(payload?.external_id || 'undefined', slipResult ? 'GENERATED' : 'ERROR');
      
      await this.publishSlipStatus(event);
    } catch (error) {
      this.logger.error(`Failed to process slip ${payload?.external_id || 'undefined'}: ${error.message}`, error.stack);
      await this.publishSlipStatus(new SlipGeneratedEvent(payload?.external_id || 'undefined', 'ERROR'));
      throw error;
    }
  }

  private async generateSlipFromKobana(payload: BankSlipPayloadDto): Promise<boolean> {
    this.logger.info('Sending request to Kobana...');
    return true; // Mock
  }

  async publishSlipStatus(event: SlipGeneratedEvent): Promise<void> {
    const statusDto: SlipStatusDto = {
      external_id: event.externalId,
      status: event.status,
      ...(event.reason && { reason: event.reason }),
    };
    this.logger.info(`Publishing to bankslip-status: ${event.externalId} - ${event.status}`);
    this.kafkaClient.emit('bankslip-status', statusDto);
  }
}