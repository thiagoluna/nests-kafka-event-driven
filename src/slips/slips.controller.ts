import { Controller } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

type ExecuteTransactionMessage = {
  external_id: string;
  name: string;
  status: 'OPEN' | 'CLOSED';
  address: string;
  amount: number;
  due_date: string;
};

@Controller('slips')
export class SlipsController {
  constructor(private readonly slipsService: SlipsService) {}

  @MessagePattern('bankslip') // Kafka topic with slips to generate
  async executeTransactionConsumer(
    @Payload() message: ExecuteTransactionMessage,
  ) {
    await this.slipsService.executeSlip({
        external_id: message.external_id,
        name: message.name,
        status: message.status,
        address: message.address,
        amout: message.amount,
        due_date: message.due_date,
    });
  }

}
