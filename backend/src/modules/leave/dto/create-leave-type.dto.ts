import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLeaveTypeDto {
  @ApiProperty({ example: 'Annual Leave' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Yearly paid leave entitlement' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 15, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  defaultDays?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;
}
