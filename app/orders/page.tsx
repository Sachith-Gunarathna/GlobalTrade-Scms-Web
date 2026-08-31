import { OrdersClient } from '@/components/OrdersClient';

export default function OrdersPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <OrdersClient orders={[]} initialQuery={searchParams?.q ?? ''} />;
}
