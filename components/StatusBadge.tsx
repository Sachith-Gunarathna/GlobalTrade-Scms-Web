export function StatusBadge({ status }: { status: string }) {
  const cls = status.toLowerCase().replaceAll(' ', '-');
  return <span className={`status-badge ${cls}`}><i />{status}</span>;
}
