import { SearchX } from 'lucide-react';
export function EmptyState({ title = 'No matching records', description = 'Try adjusting your filters or search terms.' }: { title?: string; description?: string }) {
  return <div className="empty-state"><div className="empty-icon"><SearchX size={28} /></div><strong>{title}</strong><p>{description}</p></div>;
}
