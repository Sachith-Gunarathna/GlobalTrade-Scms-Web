import inventory from '@/data/inventory.json';
import { InventoryClient } from '@/components/InventoryClient';
import type { InventoryItem } from '@/types';

export default function InventoryPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <InventoryClient inventory={inventory as InventoryItem[]} initialQuery={searchParams?.q ?? ''} />;
}
