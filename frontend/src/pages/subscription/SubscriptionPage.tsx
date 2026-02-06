import React from 'react';
import { Card, Badge, Button } from '@/components/common';
import { CreditCard, Check } from 'lucide-react';

export const SubscriptionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Current Subscription
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your organization's subscription plan
            </p>
          </div>
          <Badge variant="info">No Active Plan</Badge>
        </div>

        <p className="text-sm text-gray-500">
          Select a plan below to get started with HR Management.
        </p>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Starter', 'Professional', 'Enterprise'].map((plan) => (
            <Card key={plan} className="relative">
              {plan === 'Professional' && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="info">Most Popular</Badge>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {plan === 'Starter' && 'Perfect for small teams'}
                  {plan === 'Professional' && 'Best for growing companies'}
                  {plan === 'Enterprise' && 'Full-featured solution'}
                </p>
              </div>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-gray-900">--</span>
                <span className="text-gray-500">/month</span>
              </div>
              <Button variant="outline" className="w-full mb-4">
                <CreditCard className="h-4 w-4 mr-1" />
                Subscribe
              </Button>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Employee management
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Department management
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Leave management
                </li>
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
