import React from 'react';
import { Card, CardHeader, Button } from '@/components/common';
import { Plus } from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardHeader
          title="Employees"
          description="Manage your organization's employees"
          action={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Employee
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Position</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  No employees yet. Add your first employee.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
