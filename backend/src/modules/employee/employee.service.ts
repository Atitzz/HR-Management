import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findUnique({
      where: {
        organizationId_employeeCode: {
          organizationId,
          employeeCode: dto.employeeCode,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Employee code already exists');
    }

    return this.prisma.employee.create({
      data: {
        ...dto,
        organizationId,
        hireDate: new Date(dto.hireDate),
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        department: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async findAll(organizationId: string, query: PaginationDto) {
    const where: any = { organizationId };

    if (query.search) {
      where.OR = [
        { employeeCode: { contains: query.search, mode: 'insensitive' } },
        { position: { contains: query.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy || 'createdAt']: query.sortOrder },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatar: true,
              phone: true,
            },
          },
          department: { select: { id: true, name: true, code: true } },
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findOne(id: string, organizationId: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            role: true,
          },
        },
        department: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: string, organizationId: string, dto: UpdateEmployeeDto) {
    await this.findOne(id, organizationId);

    const data: any = { ...dto };
    if (dto.hireDate) {
      data.hireDate = new Date(dto.hireDate);
    }

    return this.prisma.employee.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        department: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);
    await this.prisma.employee.delete({ where: { id } });
    return { message: 'Employee deleted successfully' };
  }
}
