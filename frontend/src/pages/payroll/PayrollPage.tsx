import React from 'react';
import { Card, CardHeader, Button } from '@/components/common';
import { Plus } from 'lucide-react';

export const PayrollPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardHeader
          title="Payroll"
          description="Manage monthly payroll for employees"
          action={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Create Payroll
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Period</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Total Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No payroll records
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
