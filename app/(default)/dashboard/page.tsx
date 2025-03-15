"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

const queryClient = new QueryClient();

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
} 