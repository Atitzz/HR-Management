import React from 'react';
import { Card } from '@/components/common';
import { Building2, CreditCard, Users, Wallet } from 'lucide-react';

const stats = [
  { label: 'Organizations', value: '—', icon: Building2, color: 'bg-blue-500' },
  { label: 'Active Plans', value: '—', icon: CreditCard, color: 'bg-green-500' },
  { label: 'Subscriptions', value: '—', icon: Wallet, color: 'bg-purple-500' },
  { label: 'Total Users', value: '—', icon: Users, color: 'bg-orange-500' },
];

export const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of all organizations and subscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
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
            Recent Organizations
          </h3>
          <p className="text-sm text-gray-500">No organizations yet</p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Subscriptions
          </h3>
          <p className="text-sm text-gray-500">No subscriptions yet</p>
        </Card>
      </div>
    </div>
  );
};
