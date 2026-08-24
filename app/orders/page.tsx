import orders from '@/data/orders.json';
import { OrdersClient } from '@/components/OrdersClient';
import type { Order } from '@/types';

export default function OrdersPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <OrdersClient orders={orders as Order[]} initialQuery={searchParams?.q ?? ''} />;
}
