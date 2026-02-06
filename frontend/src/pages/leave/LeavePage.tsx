import React from 'react';
import { Card, CardHeader, Button } from '@/components/common';
import { Plus } from 'lucide-react';

export const LeavePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Leave Requests"
          description="View and manage leave requests"
          action={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Request
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">From</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  No leave requests
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
