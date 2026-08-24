import dashboard from '@/data/dashboard.json';
import orders from '@/data/orders.json';
import { DashboardClient } from '@/components/DashboardClient';
import type { Order } from '@/types';

export default function DashboardPage() {
  return <DashboardClient data={dashboard} orders={orders as Order[]} />;
}
