import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Input, Card } from '@/components/common';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import type { RegisterOrganizationRequest } from '@/types';
import { Shield } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterOrganizationRequest>();

  const onSubmit = async (data: RegisterOrganizationRequest) => {
    try {
      setLoading(true);
      const response = await authApi.registerOrganization(data);
      const { user, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken, refreshToken);
      toast.success('Organization registered successfully!');
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Register Organization</h1>
          <p className="text-sm text-gray-500 mt-1">Create your HR Management workspace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Organization Name"
            placeholder="Acme Corp"
            error={errors.organizationName?.message}
            {...register('organizationName', { required: 'Organization name is required' })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName', { required: 'Required' })}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Required' })}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="admin@company.com"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Min 6 characters' },
            })}
          />

          <Button type="submit" className="w-full" loading={loading}>
            Create Organization
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign In
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};
