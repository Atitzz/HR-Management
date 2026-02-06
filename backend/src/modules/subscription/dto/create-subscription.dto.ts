import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Plan ID to subscribe to' })
  @IsString()
  @IsNotEmpty()
  planId: string;

  @ApiProperty({ enum: BillingCycle, default: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
