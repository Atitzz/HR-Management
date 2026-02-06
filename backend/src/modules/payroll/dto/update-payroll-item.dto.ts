import { IsOptional, IsNumber, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePayrollItemDto {
  @ApiPropertyOptional({ example: 5000, description: 'Overtime amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  overtime?: number;

  @ApiPropertyOptional({ example: 3000, description: 'Bonus amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bonus?: number;

  @ApiPropertyOptional({ example: 500, description: 'Deductions amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deductions?: number;

  @ApiPropertyOptional({ example: 2500, description: 'Tax amount' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({ example: 750, description: 'Social security contribution' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  socialSecurity?: number;
}
