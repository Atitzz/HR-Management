import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePayrollDto {
  @ApiProperty({ example: 3, description: 'Month (1-12)' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2024 })
  @Type(() => Number)
  @IsNumber()
  @Min(2020)
  year: number;
}
