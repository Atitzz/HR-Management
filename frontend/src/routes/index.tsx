import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import { MainLayout } from '@/components/layout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Organization Pages
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { EmployeesPage } from '@/pages/employees/EmployeesPage';
import { DepartmentsPage } from '@/pages/departments/DepartmentsPage';
import { LeavePage } from '@/pages/leave/LeavePage';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { PayrollPage } from '@/pages/payroll/PayrollPage';
import { SubscriptionPage } from '@/pages/subscription/SubscriptionPage';

// Admin Pages
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { PlansPage } from '@/pages/admin/PlansPage';

const routes: Record<string, React.FC> = {
  '/dashboard': DashboardPage,
  '/employees': EmployeesPage,
  '/departments': DepartmentsPage,
  '/leave': LeavePage,
  '/attendance': AttendancePage,
  '/payroll': PayrollPage,
  '/subscription': SubscriptionPage,
  '/admin': AdminDashboardPage,
  '/admin/plans': PlansPage,
  '/admin/organizations': AdminDashboardPage, // placeholder
  '/admin/subscriptions': AdminDashboardPage, // placeholder
  '/admin/users': AdminDashboardPage, // placeholder
};

export const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Public routes
  if (!isAuthenticated) {
    if (path === '/register') return <RegisterPage />;
    return <LoginPage />;
  }

  // Redirect to appropriate dashboard
  if (path === '/' || path === '/login' || path === '/register') {
    const defaultPath =
      user?.role === UserRole.SUPER_ADMIN ? '/admin' : '/dashboard';
    window.history.replaceState({}, '', defaultPath);
    setPath(defaultPath);
    return null;
  }

  // Resolve page component
  const PageComponent = routes[path];

  return (
    <MainLayout>
      {PageComponent ? (
        <PageComponent />
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Page Not Found
            </h2>
            <p className="text-gray-500">
              The page you're looking for doesn't exist.
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
