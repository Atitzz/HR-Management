import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard, SubscriptionGuard } from '@/common/guards';

@ApiTags('Employees')
@ApiBearerAuth()
@Controller('employees')
@UseGuards(RolesGuard, SubscriptionGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Create a new employee' })
  create(
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees' })
  findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query() query: PaginationDto,
  ) {
    return this.employeeService.findAll(organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.employeeService.findOne(id, organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER, UserRole.HR_STAFF)
  @ApiOperation({ summary: 'Update employee' })
  update(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, organizationId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete employee' })
  remove(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.employeeService.remove(id, organizationId);
  }
}
