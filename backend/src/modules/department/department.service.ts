import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({
      where: {
        organizationId_code: { organizationId, code: dto.code },
      },
    });

    if (existing) {
      throw new ConflictException('Department code already exists in this organization');
    }

    return this.prisma.department.create({
      data: {
        ...dto,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string, query: PaginationDto) {
    const where: any = { organizationId };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.department.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy || 'name']: query.sortOrder || 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findOne(id: string, organizationId: string) {
    const department = await this.prisma.department.findFirst({
      where: { id, organizationId },
      include: {
        _count: { select: { employees: true } },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: string, organizationId: string, dto: UpdateDepartmentDto) {
    await this.findOne(id, organizationId);

    if (dto.code) {
      const existing = await this.prisma.department.findFirst({
        where: {
          organizationId,
          code: dto.code,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Department code already exists');
      }
    }

    return this.prisma.department.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, organizationId: string) {
    const dept = await this.prisma.department.findFirst({
      where: { id, organizationId },
      include: { _count: { select: { employees: true } } },
    });

    if (!dept) {
      throw new NotFoundException('Department not found');
    }

    if (dept._count.employees > 0) {
      throw new ConflictException(
        'Cannot delete department with active employees. Reassign employees first.',
      );
    }

    await this.prisma.department.delete({ where: { id } });
    return { message: 'Department deleted successfully' };
  }
}
