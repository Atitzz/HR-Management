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
import { UserRole, BillingCycle } from '@prisma/client';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Roles, CurrentUser } from '@/common/decorators';
import { RolesGuard } from '@/common/guards';

@ApiTags('Subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
@UseGuards(RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Subscribe organization to a plan' })
  subscribe(
    @CurrentUser('organizationId') organizationId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.subscribe(organizationId, dto);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all subscriptions (Super Admin)' })
  findAll(@Query() query: PaginationDto) {
    return this.subscriptionService.findAll(query);
  }

  @Get('current')
  @Roles(UserRole.ADMIN, UserRole.HR_MANAGER)
  @ApiOperation({ summary: 'Get current organization subscription' })
  findCurrent(@CurrentUser('organizationId') organizationId: string) {
    return this.subscriptionService.findByOrganization(organizationId);
  }

  @Patch('change-plan/:planId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Change subscription plan' })
  changePlan(
    @CurrentUser('organizationId') organizationId: string,
    @Param('planId') planId: string,
    @Query('billingCycle') billingCycle?: BillingCycle,
  ) {
    return this.subscriptionService.changePlan(
      organizationId,
      planId,
      billingCycle,
    );
  }

  @Patch('cancel')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@CurrentUser('organizationId') organizationId: string) {
    return this.subscriptionService.cancel(organizationId);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update subscription (Super Admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateSubscriptionDto) {
    return this.subscriptionService.update(id, dto);
  }
}
