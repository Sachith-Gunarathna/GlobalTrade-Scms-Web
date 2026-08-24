export function TableSkeleton({ rows = 7 }: { rows?: number }) {
  return <div className="panel table-skeleton glass-panel">
    <div className="skeleton skeleton-title" />
    <div className="skeleton skeleton-toolbar" />
    {Array.from({ length: rows }).map((_, i) => <div className="skeleton-row" key={i}>{Array.from({ length: 6 }).map((__, j) => <div className="skeleton" key={j} />)}</div>)}
  </div>;
}
