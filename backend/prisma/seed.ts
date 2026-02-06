import { PrismaClient, UserRole, PlanStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@hrms.com' },
    update: {},
    create: {
      email: 'superadmin@hrms.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  });

  console.log(`Super Admin created: ${superAdmin.email}`);

  // Create Plans
  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      description: 'Perfect for small teams getting started',
      maxEmployees: 10,
      maxDepartments: 3,
      maxHrStaff: 1,
      features: ['employee_management', 'department_management', 'leave_management'],
      monthlyPrice: 490,
      yearlyPrice: 4900,
      sortOrder: 1,
      trialDays: 14,
    },
    {
      name: 'Professional',
      slug: 'professional',
      description: 'Best for growing companies',
      maxEmployees: 50,
      maxDepartments: 10,
      maxHrStaff: 3,
      features: [
        'employee_management',
        'department_management',
        'leave_management',
        'attendance_management',
        'payroll_basic',
      ],
      monthlyPrice: 1490,
      yearlyPrice: 14900,
      sortOrder: 2,
      isPopular: true,
      trialDays: 14,
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      description: 'Full-featured for large organizations',
      maxEmployees: 500,
      maxDepartments: 50,
      maxHrStaff: 10,
      features: [
        'employee_management',
        'department_management',
        'leave_management',
        'attendance_management',
        'payroll_full',
        'reports',
        'api_access',
        'priority_support',
      ],
      monthlyPrice: 4990,
      yearlyPrice: 49900,
      sortOrder: 3,
      trialDays: 30,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
    console.log(`Plan created: ${plan.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
