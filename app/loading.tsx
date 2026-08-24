export default function Loading() {
  return (
    <div className="dashboard-loading" aria-label="Loading dashboard">
      <div className="skeleton skeleton-page-head" />
      <div className="loading-kpis">
        {Array.from({ length: 4 }).map((_, index) => <div className="skeleton skeleton-kpi" key={index} />)}
      </div>
      <div className="loading-dashboard-grid">
        <div className="skeleton skeleton-chart" />
        <div className="skeleton skeleton-side-panel" />
      </div>
    </div>
  );
}
