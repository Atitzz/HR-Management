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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard, SubscriptionGuard } from '@/common/guards';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
@UseGuards(RolesGuard, SubscriptionGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Create a new department' })
  create(
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.departmentService.create(organizationId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  findAll(
    @CurrentUser('organizationId') organizationId: string,
    @Query() query: PaginationDto,
  ) {
    return this.departmentService.findAll(organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  findOne(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.departmentService.findOne(id, organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Update department' })
  update(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, organizationId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Delete department' })
  remove(
    @Param('id') id: string,
    @CurrentUser('organizationId') organizationId: string,
  ) {
    return this.departmentService.remove(id, organizationId);
  }
}
