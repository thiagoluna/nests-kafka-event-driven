import { Controller } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { winstonLogger } from '../config/logger.config'; // Import direto
import { BankSlipMessageDto } from './dtos/slip.dto';

@Controller('slips')
export class SlipsController {
  private readonly logger = winstonLogger; // Usa a instância diretamente

  constructor(private readonly slipsService: SlipsService) {}

  @MessagePattern('bankslip')
  async executeTransactionConsumer(@Payload() message: BankSlipMessageDto) {
    try {
      this.logger.info(`Received message from bankslip topic: ${message.payload.external_id}`);
      await this.slipsService.executeSlip(message.payload);
    } catch (error) {
      // Logar o erro com detalhes
      this.logger.error(`Failed to process message: ${error.message}`, error.stack);

      // Publicar status de erro no bankslip-status
      const externalId = message?.payload?.external_id || 'unknown';
      await this.slipsService.publishSlipStatus({
        externalId,
        status: 'ERROR',
        reason: 'Invalid payload', // Adicionamos uma razão
      });
    }
  }
}