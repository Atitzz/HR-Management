import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';
import { BillingCycle, SubscriptionStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async subscribe(organizationId: string, dto: CreateSubscriptionDto) {
    // Check if organization already has an active subscription
    const existing = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (existing && ['ACTIVE', 'TRIAL'].includes(existing.status)) {
      throw new ConflictException(
        'Organization already has an active subscription',
      );
    }

    // Find the plan
    const plan = await this.prisma.plan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const price =
      dto.billingCycle === BillingCycle.YEARLY
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const startDate = new Date();
    const trialEndsAt = plan.trialDays
      ? new Date(startDate.getTime() + plan.trialDays * 24 * 60 * 60 * 1000)
      : null;

    // If existing cancelled subscription, update it
    if (existing) {
      return this.prisma.subscription.update({
        where: { id: existing.id },
        data: {
          planId: dto.planId,
          billingCycle: dto.billingCycle,
          currentPrice: price,
          status: plan.trialDays ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
          startDate,
          trialEndsAt,
          endDate: null,
          cancelledAt: null,
          autoRenew: true,
        },
        include: { plan: true },
      });
    }

    return this.prisma.subscription.create({
      data: {
        organizationId,
        planId: dto.planId,
        billingCycle: dto.billingCycle,
        currentPrice: price,
        status: plan.trialDays
          ? SubscriptionStatus.TRIAL
          : SubscriptionStatus.ACTIVE,
        startDate,
        trialEndsAt,
      },
      include: { plan: true },
    });
  }

  async findAll(query: PaginationDto) {
    const where: any = {};

    if (query.search) {
      where.organization = {
        name: { contains: query.search, mode: 'insensitive' },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder },
        include: {
          plan: { select: { id: true, name: true } },
          organization: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findByOrganization(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
      include: {
        plan: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('No subscription found for this organization');
    }

    return subscription;
  }

  async changePlan(
    organizationId: string,
    planId: string,
    billingCycle?: BillingCycle,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription) {
      throw new NotFoundException('No subscription found');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const cycle = billingCycle || subscription.billingCycle;
    const price =
      cycle === BillingCycle.YEARLY ? plan.yearlyPrice : plan.monthlyPrice;

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        planId,
        billingCycle: cycle,
        currentPrice: price,
      },
      include: { plan: true },
    });
  }

  async cancel(organizationId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!subscription) {
      throw new NotFoundException('No subscription found');
    }

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
        autoRenew: false,
      },
      include: { plan: true },
    });
  }

  async update(id: string, dto: UpdateSubscriptionDto) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.subscription.update({
      where: { id },
      data: dto,
      include: { plan: true },
    });
  }
}
