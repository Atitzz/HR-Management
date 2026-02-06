import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClockInDto {
  @ApiPropertyOptional({ example: 'Working from office' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class ClockOutDto {
  @ApiPropertyOptional({ example: 'Done for the day' })
  @IsOptional()
  @IsString()
  note?: string;
}
