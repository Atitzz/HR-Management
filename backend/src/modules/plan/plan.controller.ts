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
import { PlanService } from './plan.service';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, Public } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new plan (Super Admin only)' })
  create(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all plans with pagination (Super Admin)' })
  findAll(@Query() query: PaginationDto) {
    return this.planService.findAll(query);
  }

  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get all active plans (public)' })
  findAllActive() {
    return this.planService.findAllActive();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get plan by ID' })
  findOne(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update plan (Super Admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete/Archive plan (Super Admin only)' })
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }
}
