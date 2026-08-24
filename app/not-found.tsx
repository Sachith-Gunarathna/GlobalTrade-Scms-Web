import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="empty-state not-found-state">
      <span><Compass size={32} /></span>
      <h2>Route not found</h2>
      <p>The requested SCMS workspace does not exist.</p>
      <Link href="/" className="primary-btn"><ArrowLeft size={16} /> Back to dashboard</Link>
    </div>
  );
}
