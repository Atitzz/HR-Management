import { IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveRequestDto {
  @ApiProperty({ description: 'Leave Type ID' })
  @IsString()
  @IsNotEmpty()
  leaveTypeId: string;

  @ApiProperty({ example: '2024-03-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-03-05' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'Family vacation' })
  @IsOptional()
  @IsString()
  reason?: string;
}
