// ============================================
// Common Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterOrganizationRequest extends RegisterRequest {
  organizationName: string;
  organizationSlug?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  organization?: Organization;
}

// ============================================
// User Types
// ============================================

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  HR_STAFF = 'HR_STAFF',
  EMPLOYEE = 'EMPLOYEE',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  avatar?: string;
  organizationId?: string;
  lastLoginAt?: string;
  createdAt: string;
}

// ============================================
// Organization Types
// ============================================

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
  createdAt: string;
  subscription?: Subscription;
  _count?: {
    users: number;
    employees: number;
    departments: number;
  };
}

// ============================================
// Plan & Subscription Types
// ============================================

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum SubscriptionStatus {
  TRIAL = 'TRIAL',
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: PlanStatus;
  maxEmployees: number;
  maxDepartments: number;
  maxHrStaff: number;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  sortOrder: number;
  isPopular: boolean;
  trialDays: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPrice: number;
  trialEndsAt?: string;
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
  plan: Plan;
}

// ============================================
// Department Types
// ============================================

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  _count?: { employees: number };
  createdAt: string;
}

// ============================================
// Employee Types
// ============================================

export enum EmploymentStatus {
  PROBATION = 'PROBATION',
  ACTIVE = 'ACTIVE',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
}

export interface Employee {
  id: string;
  employeeCode: string;
  position: string;
  employmentStatus: EmploymentStatus;
  hireDate: string;
  salary: number;
  user: User;
  department: Department;
  createdAt: string;
}

// ============================================
// Leave Types
// ============================================

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface LeaveType {
  id: string;
  name: string;
  description?: string;
  defaultDays: number;
  isPaid: boolean;
  isActive: boolean;
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason?: string;
  status: LeaveStatus;
  comment?: string;
  leaveType: LeaveType;
  employee?: Employee;
  createdAt: string;
}

// ============================================
// Attendance Types
// ============================================

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  ON_LEAVE = 'ON_LEAVE',
}

export interface Attendance {
  id: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  workHours?: number;
  overtimeHours?: number;
  note?: string;
  employee?: Employee;
}

// ============================================
// Payroll Types
// ============================================

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Payroll {
  id: string;
  month: number;
  year: number;
  status: PayrollStatus;
  totalAmount: number;
  processedAt?: string;
  items?: PayrollItem[];
  _count?: { items: number };
}

export interface PayrollItem {
  id: string;
  baseSalary: number;
  overtime: number;
  bonus: number;
  deductions: number;
  tax: number;
  socialSecurity: number;
  netSalary: number;
  employee: Employee;
}
