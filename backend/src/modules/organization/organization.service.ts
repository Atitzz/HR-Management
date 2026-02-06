import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto) {
    const slug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const existing = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException('Organization slug already exists');
    }

    return this.prisma.organization.create({
      data: { ...dto, slug },
    });
  }

  async findAll(query: PaginationDto) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder },
        include: {
          subscription: {
            include: { plan: { select: { id: true, name: true } } },
          },
          _count: { select: { users: true, employees: true, departments: true } },
        },
      }),
      this.prisma.organization.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findOne(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        subscription: {
          include: { plan: true },
        },
        _count: {
          select: { users: true, employees: true, departments: true },
        },
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }

    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await this.prisma.organization.findFirst({
        where: { slug: dto.slug, NOT: { id } },
      });

      if (existing) {
        throw new ConflictException('Organization slug already exists');
      }
    }

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.organization.delete({ where: { id } });
    return { message: 'Organization deleted successfully' };
  }

  async toggleActive(id: string) {
    const org = await this.findOne(id);
    return this.prisma.organization.update({
      where: { id },
      data: { isActive: !org.isActive },
      select: { id: true, isActive: true },
    });
  }
}
