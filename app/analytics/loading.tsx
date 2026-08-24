export default function Loading() {
  return (
    <div className="loading-grid" aria-label="Loading analytics">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton skeleton-chart" />
      <div className="skeleton skeleton-chart" />
      <div className="skeleton skeleton-chart" />
    </div>
  );
}
