import { SuppliersClient } from '@/components/SuppliersClient';

export default function SuppliersPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <SuppliersClient suppliers={[]} initialQuery={searchParams?.q ?? ''} />;
}
