'use client';

import { useEffect, useState } from 'react';
import { Activity, CheckCircle2, Clock3, Gauge, RefreshCw, Route, ShieldAlert } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { applyRoutePriorities, getMonitoringData, getRoutePriorities } from '@/app/services/apiService';
import type { MonitoringSnapshot } from '@/types';

export function MonitoringClient() {
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | null>(null);
  const [routes, setRoutes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [canApplyRoutes, setCanApplyRoutes] = useState(false);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [monitoring, priorities] = await Promise.all([getMonitoringData(), getRoutePriorities()]);
      setSnapshot(monitoring);
      setRoutes(priorities);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load monitoring information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem('scms_user');
      const role = stored ? JSON.parse(stored).role : '';
      setCanApplyRoutes(role === 'ADMIN' || role === 'LOGISTICS_COORDINATOR');
    } catch {
      setCanApplyRoutes(false);
    }
    void load();
  }, []);

  const applyRoutes = async () => {
    try {
      const result = await applyRoutePriorities();
      await load();
      showToast(`${result.updated} shipment route priorities updated.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to apply route priorities.');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="EJB operations"
        title="Monitoring"
        description="Review timer services, interceptor performance metrics, audit activity, alerts, and route optimization results."
        action={<div style={{ display: 'flex', gap: 8 }}><button className="secondary-btn" type="button" onClick={() => void load()}><RefreshCw size={15} /> Refresh</button>{canApplyRoutes && <button className="primary-btn" type="button" onClick={() => void applyRoutes()}><Route size={15} /> Apply Route Priorities</button>}</div>}
      />

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><Gauge size={20} /></div><div><span>Average method time</span><strong>{snapshot ? `${snapshot.averageMethodDurationMs.toFixed(2)} ms` : '—'}</strong></div></div>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><Activity size={20} /></div><div><span>Performance records</span><strong>{snapshot?.metrics.length ?? 0}</strong></div></div>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><ShieldAlert size={20} /></div><div><span>Supply alerts</span><strong>{snapshot?.alerts.length ?? 0}</strong></div></div>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><Clock3 size={20} /></div><div><span>EJB timers</span><strong>{snapshot?.timers.length ?? 0}</strong></div></div>
      </div>

      <section className="glass-panel" style={{ marginBottom: 18 }}>
        <div className="settings-section-head"><div><h3>EJB Timer Service</h3><p>Persistent logistics schedules reported by the application server.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Timer</th><th>Next Timeout</th><th>Persistent</th></tr></thead><tbody>{loading ? <tr><td colSpan={3}>Loading timers...</td></tr> : (snapshot?.timers.length ? snapshot.timers.map((timer, index) => <tr key={`${timer.info}-${index}`}><td>{timer.info}</td><td>{timer.nextTimeout ? new Date(timer.nextTimeout).toLocaleString() : '—'}</td><td>{timer.persistent ? 'Yes' : 'No'}</td></tr>) : <tr><td colSpan={3}>No active timers reported.</td></tr>)}</tbody></table></div>
      </section>

      <section className="glass-panel" style={{ marginBottom: 18 }}>
        <div className="settings-section-head"><div><h3>Interceptor Performance</h3><p>Recent measured business-method executions.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Type</th><th>Operation</th><th>Duration</th><th>Result</th><th>Recorded</th></tr></thead><tbody>{snapshot?.metrics.length ? snapshot.metrics.slice(0, 20).map((metric) => <tr key={metric.id}><td>{metric.type}</td><td>{metric.operation}</td><td>{metric.durationMs} ms</td><td>{metric.success ? 'Success' : 'Failed'}</td><td>{metric.recordedAt ? new Date(metric.recordedAt).toLocaleString() : '—'}</td></tr>) : <tr><td colSpan={5}>No performance measurements recorded yet.</td></tr>}</tbody></table></div>
      </section>

      <section className="glass-panel" style={{ marginBottom: 18 }}>
        <div className="settings-section-head"><div><h3>Audit Trail</h3><p>Cross-cutting logistics actions captured by the audit interceptor.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Action</th><th>Component</th><th>User</th><th>Result</th><th>Time</th></tr></thead><tbody>{snapshot?.audit.length ? snapshot.audit.slice(0, 30).map((entry) => <tr key={entry.id}><td>{entry.action}</td><td>{entry.component}.{entry.method}</td><td>{entry.performedBy || 'SYSTEM'}</td><td>{entry.success ? 'Success' : 'Failed'}</td><td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '—'}</td></tr>) : <tr><td colSpan={5}>No audit activity recorded yet.</td></tr>}</tbody></table></div>
      </section>

      <section className="glass-panel">
        <div className="settings-section-head"><div><h3>Route Optimization</h3><p>Calculated priorities for active shipment routes.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Shipment Database ID</th><th>Priority Score</th></tr></thead><tbody>{Object.keys(routes).length ? Object.entries(routes).map(([shipmentId, priority]) => <tr key={shipmentId}><td>{shipmentId}</td><td>{priority}</td></tr>) : <tr><td colSpan={2}>No route priorities available.</td></tr>}</tbody></table></div>
      </section>

      {toast && <div className="toast"><CheckCircle2 size={16} /><div><strong>Monitoring</strong><span>{toast}</span></div></div>}
    </div>
  );
}
