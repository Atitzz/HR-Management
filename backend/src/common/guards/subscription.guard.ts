import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.organizationId) {
      throw new ForbiddenException('User is not associated with any organization');
    }

    const subscription = await this.prisma.subscription.findUnique({
      where: { organizationId: user.organizationId },
    });

    if (!subscription) {
      throw new ForbiddenException('Organization does not have an active subscription');
    }

    const activeStatuses: SubscriptionStatus[] = [
      SubscriptionStatus.ACTIVE,
      SubscriptionStatus.TRIAL,
    ];

    if (!activeStatuses.includes(subscription.status)) {
      throw new ForbiddenException(
        'Organization subscription is not active. Please renew your subscription.',
      );
    }

    // Check trial expiration
    if (
      subscription.status === SubscriptionStatus.TRIAL &&
      subscription.trialEndsAt &&
      new Date() > subscription.trialEndsAt
    ) {
      throw new ForbiddenException(
        'Trial period has expired. Please subscribe to continue.',
      );
    }

    // Attach subscription to request for downstream use
    request.subscription = subscription;

    return true;
  }
}
