import data from '@/data/analytics.json';
import { AnalyticsClient } from '@/components/AnalyticsClient';
export default function AnalyticsPage() { return <AnalyticsClient data={data} />; }
