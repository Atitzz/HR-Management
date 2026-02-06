import React from 'react';
import { Card, CardHeader, Button } from '@/components/common';
import { Clock } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Clock In/Out Card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Attendance
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('th-TH', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary">
              <Clock className="h-4 w-4 mr-1" />
              Clock In
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-1" />
              Clock Out
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Records */}
      <Card>
        <CardHeader
          title="Attendance Records"
          description="View attendance history"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Clock In</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Clock Out</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Work Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  No attendance records
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
