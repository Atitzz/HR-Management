import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginationDto, PaginatedResult } from '@/common/dto/pagination.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async clockIn(employeeId: string, note?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (existing) {
      throw new BadRequestException('Already clocked in today');
    }

    const now = new Date();
    const workStartHour = 9; // 9 AM
    const isLate = now.getHours() > workStartHour || 
                   (now.getHours() === workStartHour && now.getMinutes() > 0);

    return this.prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        clockIn: now,
        status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
        note,
      },
    });
  }

  async clockOut(employeeId: string, note?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });

    if (!attendance) {
      throw new BadRequestException('No clock-in record found for today');
    }

    if (attendance.clockOut) {
      throw new BadRequestException('Already clocked out today');
    }

    const now = new Date();
    const workHours = attendance.clockIn
      ? (now.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60)
      : 0;

    const standardHours = 8;
    const overtimeHours = Math.max(0, workHours - standardHours);

    return this.prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: now,
        workHours: Math.round(workHours * 100) / 100,
        overtimeHours: Math.round(overtimeHours * 100) / 100,
        note: note || attendance.note,
      },
    });
  }

  async findAll(organizationId: string, query: PaginationDto, date?: string) {
    const where: any = {
      employee: { organizationId },
    };

    if (date) {
      const targetDate = new Date(date);
      targetDate.setHours(0, 0, 0, 0);
      where.date = targetDate;
    }

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { date: 'desc' },
        include: {
          employee: {
            include: {
              user: {
                select: { firstName: true, lastName: true, email: true },
              },
            },
          },
        },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async findMyAttendance(employeeId: string, query: PaginationDto) {
    const where: any = { employeeId };

    const [data, total] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.attendance.count({ where }),
    ]);

    return new PaginatedResult(data, total, query.page, query.limit);
  }

  async getTodayStatus(employeeId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.attendance.findUnique({
      where: { employeeId_date: { employeeId, date: today } },
    });
  }
}
