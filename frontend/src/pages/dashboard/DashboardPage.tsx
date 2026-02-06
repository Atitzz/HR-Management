import React from 'react';
import { Card } from '@/components/common';
import { useAuthStore } from '@/store/auth.store';
import { Users, Building2, Calendar, Clock } from 'lucide-react';

const stats = [
  { label: 'Total Employees', value: '—', icon: Users, color: 'bg-blue-500' },
  { label: 'Departments', value: '—', icon: Building2, color: 'bg-green-500' },
  { label: 'Leave Requests', value: '—', icon: Calendar, color: 'bg-yellow-500' },
  { label: 'Present Today', value: '—', icon: Clock, color: 'bg-purple-500' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening in your organization today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div
                  className={`${stat.color} p-3 rounded-lg text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Leave Requests
          </h3>
          <p className="text-sm text-gray-500">No pending requests</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Attendance
          </h3>
          <p className="text-sm text-gray-500">No records yet</p>
        </Card>
      </div>
    </div>
  );
};
