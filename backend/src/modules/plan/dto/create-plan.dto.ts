import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PlanStatus } from '@prisma/client';

export class CreatePlanDto {
  @ApiProperty({ example: 'Professional' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'professional' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Best for growing companies' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: PlanStatus, default: PlanStatus.ACTIVE })
  @IsOptional()
  @IsEnum(PlanStatus)
  status?: PlanStatus;

  @ApiProperty({ example: 50, description: 'Max number of employees' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxEmployees: number;

  @ApiProperty({ example: 10, description: 'Max number of departments' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxDepartments: number;

  @ApiProperty({ example: 3, description: 'Max number of HR staff' })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  maxHrStaff: number;

  @ApiPropertyOptional({
    example: ['leave_management', 'attendance', 'payroll'],
    description: 'List of feature keys enabled for this plan',
  })
  @IsOptional()
  @IsArray()
  features?: string[];

  @ApiProperty({ example: 990.0, description: 'Monthly price (THB)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyPrice: number;

  @ApiProperty({ example: 9900.0, description: 'Yearly price (THB)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  yearlyPrice: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional({ example: 14, description: 'Free trial days' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  trialDays?: number;
}
