import { InventoryClient } from '@/components/InventoryClient';

export default function InventoryPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <InventoryClient inventory={[]} initialQuery={searchParams?.q ?? ''} />;
}
