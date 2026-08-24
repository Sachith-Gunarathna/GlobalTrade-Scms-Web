import shipments from '@/data/shipments.json';
import { ShipmentsClient } from '@/components/ShipmentsClient';
import type { Shipment } from '@/types';

export default function ShipmentsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return <ShipmentsClient shipments={shipments as Shipment[]} initialQuery={searchParams?.q ?? ''} />;
}
