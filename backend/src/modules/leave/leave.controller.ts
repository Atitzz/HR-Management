import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { LeaveService } from './leave.service';
import {
  CreateLeaveTypeDto,
  CreateLeaveRequestDto,
  UpdateLeaveStatusDto,
} from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard, SubscriptionGuard } from '@/common/guards';

@ApiTags('Leave Management')
@ApiBearerAuth()
@Controller('leave')
@UseGuards(RolesGuard, SubscriptionGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  // === Leave Types ===

  @Post('types')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create leave type' })
  createLeaveType(
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: CreateLeaveTypeDto,
  ) {
    return this.leaveService.createLeaveType(organizationId, dto);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get all leave types' })
  findAllLeaveTypes(
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.leaveService.findAllLeaveTypes(organizationId);
  }

  @Patch('types/:id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update leave type' })
  updateLeaveType(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: Partial<CreateLeaveTypeDto>,
  ) {
    return this.leaveService.updateLeaveType(id, organizationId, dto);
  }

  // === Leave Requests ===

  @Post('requests')
  @ApiOperation({ summary: 'Create leave request (employee)' })
  createRequest(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateLeaveRequestDto,
  ) {
    // In production, resolve employeeId from userId
    return this.leaveService.createRequest(userId, dto);
  }

  @Get('requests')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Get all leave requests (HR)' })
  findAllRequests(
    @CurrentUser('organizationId') organizationId: string,
    @Query() query: PaginationDto,
  ) {
    return this.leaveService.findAllRequests(organizationId, query);
  }

  @Get('requests/my')
  @ApiOperation({ summary: 'Get my leave requests' })
  findMyRequests(
    @CurrentUser('id') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.leaveService.findMyRequests(userId, query);
  }

  @Patch('requests/:id/status')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Approve/Reject leave request' })
  updateRequestStatus(
    @Param('id') id: string,
    @CurrentUser('id') approverId: string,
    @Body() dto: UpdateLeaveStatusDto,
  ) {
    return this.leaveService.updateRequestStatus(id, approverId, dto);
  }

  @Patch('requests/:id/cancel')
  @ApiOperation({ summary: 'Cancel my leave request' })
  cancelRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.leaveService.cancelRequest(id, userId);
  }
}
