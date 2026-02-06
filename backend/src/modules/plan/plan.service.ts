import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';
import { PlanStatus } from '@prisma/client';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePlanDto) {
    const slug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const existing = await this.prisma.plan.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });

    if (existing) {
      throw new ConflictException('Plan name or slug already exists');
    }

    return this.prisma.plan.create({
      data: {
        ...dto,
        slug,
        features: dto.features || [],
      },
    });
  }

  async findAll(query: PaginationDto) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.plan.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy || 'sortOrder']: query.sortOrder || 'asc' },
        include: {
          _count: { select: { subscriptions: true } },
        },
      }),
      this.prisma.plan.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findAllActive() {
    return this.prisma.plan.findMany({
      where: { status: PlanStatus.ACTIVE },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        _count: { select: { subscriptions: true } },
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findOne(id);

    if (dto.name || dto.slug) {
      const slug =
        dto.slug ||
        dto.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const existing = await this.prisma.plan.findFirst({
        where: {
          OR: [
            ...(dto.name ? [{ name: dto.name }] : []),
            ...(slug ? [{ slug }] : []),
          ],
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Plan name or slug already exists');
      }

      if (slug) dto.slug = slug;
    }

    return this.prisma.plan.update({
      where: { id },
      data: {
        ...dto,
        features: dto.features || undefined,
      },
    });
  }

  async remove(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: { _count: { select: { subscriptions: true } } },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (plan._count.subscriptions > 0) {
      // Archive instead of delete if there are active subscriptions
      return this.prisma.plan.update({
        where: { id },
        data: { status: PlanStatus.ARCHIVED },
      });
    }

    await this.prisma.plan.delete({ where: { id } });
    return { message: 'Plan deleted successfully' };
  }
}
