import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AttendanceService } from './attendance.service';
import { ClockInDto, ClockOutDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard, SubscriptionGuard } from '@/common/guards';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(RolesGuard, SubscriptionGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @ApiOperation({ summary: 'Clock in for today' })
  clockIn(
    @CurrentUser('id') userId: string,
    @Body() dto: ClockInDto,
  ) {
    // In production, resolve employeeId from userId
    return this.attendanceService.clockIn(userId, dto.note);
  }

  @Post('clock-out')
  @ApiOperation({ summary: 'Clock out for today' })
  clockOut(
    @CurrentUser('id') userId: string,
    @Body() dto: ClockOutDto,
  ) {
    return this.attendanceService.clockOut(userId, dto.note);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter by date (YYYY-MM-DD)' })
  findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query() query: PaginationDto,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.findAll(organizationId, query, date);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my attendance records' })
  findMyAttendance(
    @CurrentUser('id') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.attendanceService.findMyAttendance(userId, query);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get my today attendance status' })
  getTodayStatus(@CurrentUser('id') userId: string) {
    return this.attendanceService.getTodayStatus(userId);
  }
}
