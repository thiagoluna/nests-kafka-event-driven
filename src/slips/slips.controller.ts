import { Controller } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { winstonLogger } from '../config/logger.config';
import { BankSlipMessageDto } from './dtos/slip.dto';
import { validateMessage } from '../shared/utils/validate-message';

@Controller('slips')
export class SlipsController {
  private readonly logger = winstonLogger;

  constructor(private readonly slipsService: SlipsService) {}

  @MessagePattern('bankslip')
  async executeTransactionConsumer(@Payload() message: any) {
    const { dto: messageDto, errorMessage } = await validateMessage(
      message,
      BankSlipMessageDto,
      'SlipsController',
    );

    if (errorMessage) {
      const externalId = message?.payload?.external_id || 'unknown';
      await this.slipsService.publishSlipStatus({
        externalId,
        status: 'ERROR',
        reason: errorMessage,
      });
      return;
    }

    try {
      this.logger.info(`Received message from bankslip topic: ${messageDto.payload.external_id}`);
      await this.slipsService.executeSlip(messageDto.payload);
    } catch (error) {
      this.logger.error(`Failed to process message: ${error.message}`, error.stack);
      const externalId = messageDto?.payload?.external_id || 'unknown';
      await this.slipsService.publishSlipStatus({
        externalId,
        status: 'ERROR',
        reason: error.message,
      });
    }
  }
}