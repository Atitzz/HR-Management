# HR Management System

ระบบบริหารจัดการทรัพยากรบุคคล (HR Management) แบบ Subscription Model

## Tech Stack

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: React + Vite + TailwindCSS + TypeScript
- **Database**: PostgreSQL with Prisma ORM

## Architecture

```
HR-Management/
├── backend/                    # NestJS Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Seed data
│   ├── src/
│   │   ├── config/             # Central configuration
│   │   │   ├── app.config.ts
│   │   │   ├── database.config.ts
│   │   │   ├── jwt.config.ts
│   │   │   ├── throttle.config.ts
│   │   │   └── index.ts
│   │   ├── common/             # Shared utilities
│   │   │   ├── decorators/     # @Roles, @CurrentUser, @Public
│   │   │   ├── guards/         # RolesGuard, SubscriptionGuard
│   │   │   ├── filters/        # AllExceptionsFilter
│   │   │   ├── interceptors/   # TransformInterceptor
│   │   │   └── dto/            # PaginationDto
│   │   ├── prisma/             # Prisma module (Global)
│   │   ├── modules/
│   │   │   ├── auth/           # Authentication (JWT)
│   │   │   ├── user/           # User management
│   │   │   ├── organization/   # Organization (tenant)
│   │   │   ├── plan/           # Subscription plans (Admin)
│   │   │   ├── subscription/   # Subscription management
│   │   │   ├── department/     # Department management
│   │   │   ├── employee/       # Employee management
│   │   │   ├── leave/          # Leave types & requests
│   │   │   ├── attendance/     # Clock-in/out & records
│   │   │   └── payroll/        # Payroll processing
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── .env
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── api/                # API client & endpoints
│   │   ├── components/
│   │   │   ├── common/         # Reusable UI components
│   │   │   └── layout/         # Layout components
│   │   ├── config/             # App configuration
│   │   ├── lib/                # Utility functions
│   │   ├── pages/
│   │   │   ├── admin/          # Super Admin pages
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── employees/      # Employee management
│   │   │   ├── departments/    # Department management
│   │   │   ├── leave/          # Leave management
│   │   │   ├── attendance/     # Attendance
│   │   │   ├── payroll/        # Payroll
│   │   │   └── subscription/   # Plan selection
│   │   ├── routes/             # Routing
│   │   ├── store/              # Zustand stores
│   │   └── types/              # TypeScript types
│   └── index.html
└── package.json                # Root scripts
```

## Module Structure (Backend)

แต่ละ module ใน `backend/src/modules/` มีโครงสร้างเหมือนกัน:

```
module-name/
├── dto/
│   ├── create-*.dto.ts         # Create DTO with validation
│   ├── update-*.dto.ts         # Update DTO (PartialType)
│   └── index.ts                # Barrel export
├── module-name.controller.ts   # Routes & request handling
├── module-name.service.ts      # Business logic
└── module-name.module.ts       # Module definition
```

## User Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Platform admin - manages plans, organizations, all users |
| `ADMIN` | Organization admin - manages their organization, subscription |
| `HR_MANAGER` | HR Manager - manages employees, leave, attendance, payroll |
| `HR_STAFF` | HR Staff - day-to-day HR operations |
| `EMPLOYEE` | Regular employee - self-service (leave, attendance) |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Database Setup

```bash
# From project root
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed initial data (Super Admin + Plans)
```

### Development

```bash
# Run both backend and frontend
npm run dev

# Or run separately:
npm run dev:backend    # http://localhost:3000
npm run dev:frontend   # http://localhost:5173
```

### API Documentation

Swagger UI available at: `http://localhost:3000/docs`

### Default Credentials (After Seeding)

- **Super Admin**: `superadmin@hrms.com` / `admin123`

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/register/organization` - Register organization
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Plans (Super Admin)
- `GET /api/v1/plans/active` - Get active plans (public)
- `GET /api/v1/plans` - Get all plans
- `POST /api/v1/plans` - Create plan
- `PATCH /api/v1/plans/:id` - Update plan
- `DELETE /api/v1/plans/:id` - Delete/Archive plan

### Subscriptions
- `POST /api/v1/subscriptions` - Subscribe to plan
- `GET /api/v1/subscriptions/current` - Current subscription
- `PATCH /api/v1/subscriptions/change-plan/:planId` - Change plan
- `PATCH /api/v1/subscriptions/cancel` - Cancel subscription

### Organization, Users, Departments, Employees, Leave, Attendance, Payroll
- Standard CRUD endpoints with role-based access control

## Key Features

- Multi-tenant architecture (Organization-based)
- Subscription management with trial periods
- Role-based access control (RBAC)
- JWT authentication with refresh tokens
- Global exception handling & response transformation
- Swagger API documentation
- Rate limiting
- Subscription guard (checks active subscription)
- Pagination, search, and sorting
