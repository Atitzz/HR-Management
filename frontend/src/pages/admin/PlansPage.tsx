import React from 'react';
import { Card, CardHeader, Badge, Button } from '@/components/common';
import { Plus } from 'lucide-react';

export const PlansPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardHeader
          title="Subscription Plans"
          description="Manage subscription plans for organizations"
          action={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Plan
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Monthly</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Yearly</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Max Employees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Subscribers</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Connect to API to load plans
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
