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
import { PayrollService } from './payroll.service';
import { CreatePayrollDto, UpdatePayrollItemDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard, SubscriptionGuard } from '@/common/guards';

@ApiTags('Payroll')
@ApiBearerAuth()
@Controller('payroll')
@UseGuards(RolesGuard, SubscriptionGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create monthly payroll' })
  create(
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: CreatePayrollDto,
  ) {
    return this.payrollService.create(organizationId, dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get all payrolls' })
  findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query() query: PaginationDto,
  ) {
    return this.payrollService.findAll(organizationId, query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get payroll details' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.payrollService.findOne(id, organizationId);
  }

  @Patch('items/:itemId')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update payroll item (overtime, bonus, etc.)' })
  updateItem(
    @Param('itemId') itemId: string,
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdatePayrollItemDto,
  ) {
    return this.payrollService.updateItem(itemId, organizationId, dto);
  }

  @Post(':id/process')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Process/Finalize payroll' })
  process(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
    @CurrentUser('id') processedBy: string,
  ) {
    return this.payrollService.process(id, organizationId, processedBy);
  }
}
