export class PayloadExecuteSlipMessageDto {
    external_id: string;
    status: 'OPEN' | 'CLOSED';
    name: string;
    address: string;
    amout: number;
    due_date: string;
}