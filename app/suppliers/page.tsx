import suppliers from '@/data/suppliers.json';
import { SuppliersClient } from '@/components/SuppliersClient';
import type { Supplier } from '@/types';

export default function SuppliersPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <SuppliersClient suppliers={suppliers as Supplier[]} initialQuery={searchParams?.q ?? ''} />;
}
