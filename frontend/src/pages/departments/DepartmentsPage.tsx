import React from 'react';
import { Card, CardHeader, Button } from '@/components/common';
import { Plus } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  return (
    <div>
      <Card>
        <CardHeader
          title="Departments"
          description="Manage your organization's departments"
          action={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Department
            </Button>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Code</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No departments yet. Create your first department.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
