import React from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth.store';
import { UserRole } from '@/types';
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Calendar,
  Clock,
  Wallet,
  Settings,
  Shield,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building2 },
  { label: 'Leave', path: '/leave', icon: Calendar },
  { label: 'Attendance', path: '/attendance', icon: Clock },
  {
    label: 'Payroll',
    path: '/payroll',
    icon: Wallet,
    roles: [UserRole.ADMIN, UserRole.HR_MANAGER],
  },
  {
    label: 'Subscription',
    path: '/subscription',
    icon: CreditCard,
    roles: [UserRole.ADMIN],
  },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Organizations', path: '/admin/organizations', icon: Building2 },
  { label: 'Plans', path: '/admin/plans', icon: CreditCard },
  { label: 'Subscriptions', path: '/admin/subscriptions', icon: Wallet },
  { label: 'Users', path: '/admin/users', icon: Users },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const items = isSuperAdmin ? adminNavItems : navItems;

  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="font-bold text-gray-900">HR Management</h1>
            <p className="text-xs text-gray-500">
              {isSuperAdmin ? 'Super Admin' : 'Organization'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
