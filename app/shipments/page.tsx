import { ShipmentsClient } from '@/components/ShipmentsClient';

export default function ShipmentsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <ShipmentsClient shipments={[]} initialQuery={searchParams?.q ?? ''} />;
}
