import { IsString, IsEnum, IsNumber, IsDateString, IsObject, IsNotEmpty, IsOptional } from 'class-validator';

export class BankSlipPayloadDto {
  @IsString()
  @IsNotEmpty()
  external_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['OPEN', 'CLOSED'])
  @IsNotEmpty()
  status: 'OPEN' | 'CLOSED';

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  due_date: string;
}

export class BankSlipMessageDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  payload: BankSlipPayloadDto;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}

export class SlipStatusDto {
  @IsString()
  @IsNotEmpty()
  external_id: string;

  @IsEnum(['GENERATED', 'ERROR', 'PENDING'])
  @IsNotEmpty()
  status: 'GENERATED' | 'ERROR' | 'PENDING';

  @IsString()
  @IsOptional()
  reason?: string;
}