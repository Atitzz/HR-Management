import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePayrollDto, UpdatePayrollItemDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';
import { PayrollStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreatePayrollDto) {
    const existing = await this.prisma.payroll.findUnique({
      where: {
        organizationId_month_year: {
          organizationId,
          month: dto.month,
          year: dto.year,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Payroll already exists for this period');
    }

    // Get all active employees
    const employees = await this.prisma.employee.findMany({
      where: {
        organizationId,
        employmentStatus: { in: ['ACTIVE', 'PROBATION'] },
      },
    });

    if (employees.length === 0) {
      throw new BadRequestException('No active employees found');
    }

    // Create payroll with items for each employee
    const payroll = await this.prisma.payroll.create({
      data: {
        organizationId,
        month: dto.month,
        year: dto.year,
        items: {
          create: employees.map((emp) => ({
            employeeId: emp.id,
            baseSalary: emp.salary,
            netSalary: emp.salary, // Initial: net = base (adjustments come later)
          })),
        },
      },
      include: {
        items: {
          include: {
            employee: {
              include: {
                user: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    });

    // Calculate total
    const totalAmount = employees.reduce(
      (sum, emp) => sum + Number(emp.salary),
      0,
    );

    await this.prisma.payroll.update({
      where: { id: payroll.id },
      data: { totalAmount },
    });

    return { ...payroll, totalAmount };
  }

  async findAll(organizationId: string, query: PaginationDto) {
    const where: any = { organizationId };

    const [data, total] = await Promise.all([
      this.prisma.payroll.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          _count: { select: { items: true } },
        },
      }),
      this.prisma.payroll.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findOne(id: string, organizationId: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id, organizationId },
      include: {
        items: {
          include: {
            employee: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, email: true },
                },
                department: { select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    return payroll;
  }

  async updateItem(
    itemId: string,
    organizationId: string,
    dto: UpdatePayrollItemDto,
  ) {
    const item = await this.prisma.payrollItem.findFirst({
      where: {
        id: itemId,
        payroll: { organizationId, status: PayrollStatus.DRAFT },
      },
    });

    if (!item) {
      throw new NotFoundException(
        'Payroll item not found or payroll is not in draft status',
      );
    }

    const baseSalary = Number(item.baseSalary);
    const overtime = dto.overtime ?? Number(item.overtime);
    const bonus = dto.bonus ?? Number(item.bonus);
    const deductions = dto.deductions ?? Number(item.deductions);
    const tax = dto.tax ?? Number(item.tax);
    const socialSecurity = dto.socialSecurity ?? Number(item.socialSecurity);
    const netSalary = baseSalary + overtime + bonus - deductions - tax - socialSecurity;

    return this.prisma.payrollItem.update({
      where: { id: itemId },
      data: {
        ...dto,
        netSalary,
      },
    });
  }

  async process(id: string, organizationId: string, processedBy: string) {
    const payroll = await this.prisma.payroll.findFirst({
      where: { id, organizationId },
      include: { items: true },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    if (payroll.status !== PayrollStatus.DRAFT) {
      throw new BadRequestException('Only draft payrolls can be processed');
    }

    const totalAmount = payroll.items.reduce(
      (sum, item) => sum + Number(item.netSalary),
      0,
    );

    return this.prisma.payroll.update({
      where: { id },
      data: {
        status: PayrollStatus.COMPLETED,
        totalAmount,
        processedAt: new Date(),
        processedBy,
      },
    });
  }
}
