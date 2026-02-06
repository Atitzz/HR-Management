import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLeaveTypeDto, CreateLeaveRequestDto, UpdateLeaveStatusDto } from './dto';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}

  // === Leave Types ===

  async createLeaveType(organizationId: string, dto: CreateLeaveTypeDto) {
    const existing = await this.prisma.leaveType.findUnique({
      where: { organizationId_name: { organizationId, name: dto.name } },
    });

    if (existing) {
      throw new ConflictException('Leave type already exists');
    }

    return this.prisma.leaveType.create({
      data: { ...dto, organizationId },
    });
  }

  async findAllLeaveTypes(organizationId: string) {
    return this.prisma.leaveType.findMany({
      where: { organizationId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async updateLeaveType(id: string, organizationId: string, dto: Partial<CreateLeaveTypeDto>) {
    const leaveType = await this.prisma.leaveType.findFirst({
      where: { id, organizationId },
    });

    if (!leaveType) {
      throw new NotFoundException('Leave type not found');
    }

    return this.prisma.leaveType.update({
      where: { id },
      data: dto,
    });
  }

  // === Leave Requests ===

  async createRequest(employeeId: string, dto: CreateLeaveRequestDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate < startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return this.prisma.leaveRequest.create({
      data: {
        employeeId,
        leaveTypeId: dto.leaveTypeId,
        startDate,
        endDate,
        totalDays,
        reason: dto.reason,
      },
      include: {
        leaveType: { select: { id: true, name: true } },
      },
    });
  }

  async findAllRequests(organizationId: string, query: PaginationDto) {
    const where: any = {
      employee: { organizationId },
    };

    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          employee: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
          leaveType: { select: { id: true, name: true } },
        },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findMyRequests(employeeId: string, query: PaginationDto) {
    const where: any = { employeeId };

    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          leaveType: { select: { id: true, name: true } },
        },
      }),
      this.prisma.leaveRequest.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async updateRequestStatus(
    id: string,
    approverId: string,
    dto: UpdateLeaveStatusDto,
  ) {
    const request = await this.prisma.leaveRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Can only update pending requests');
    }

    const data: any = {
      status: dto.status,
      comment: dto.comment,
    };

    if (dto.status === LeaveStatus.APPROVED) {
      data.approvedBy = approverId;
      data.approvedAt = new Date();
    } else if (dto.status === LeaveStatus.REJECTED) {
      data.rejectedBy = approverId;
      data.rejectedAt = new Date();
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data,
      include: {
        leaveType: { select: { id: true, name: true } },
      },
    });
  }

  async cancelRequest(id: string, employeeId: string) {
    const request = await this.prisma.leaveRequest.findFirst({
      where: { id, employeeId },
    });

    if (!request) {
      throw new NotFoundException('Leave request not found');
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Can only cancel pending requests');
    }

    return this.prisma.leaveRequest.update({
      where: { id },
      data: { status: LeaveStatus.CANCELLED },
    });
  }
}
