'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clock3,
  Gauge,
  RadioTower,
  RefreshCw,
  Route,
  Search,
  ShieldAlert,
  TrendingUp,
  XCircle,
  Zap
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { applyRoutePriorities, getMonitoringData, getRoutePriorities, synchronizeCarrierIntegration } from '@/app/services/apiService';
import { canAccess } from '@/app/services/roleAccess';
import { useCurrentUser } from '@/context/AuthContext';
import type { MonitoringSnapshot } from '@/types';



function fmtDate(val: string | null | undefined) {
  if (!val) return '—';
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? val : d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="mon-search-wrap">
      <button
        type="button"
        className={`mon-search-icon-btn ${value ? 'mon-search-icon-active' : ''}`}
        onClick={() => value && onChange('')}
        aria-label={value ? 'Clear search' : 'Search'}
        tabIndex={value ? 0 : -1}
      >
        <Search size={13} className="mon-icon-search" />
        <XCircle size={13} className="mon-icon-clear" />
      </button>
      <input
        className="mon-search-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}



export function MonitoringClient() {
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | null>(null);
  const [routes, setRoutes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [syncingCarrier, setSyncingCarrier] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const user = useCurrentUser();
  const canApplyRoutes = canAccess(user?.role, 'monitoring.routes');
  const canSyncCarrier = canAccess(user?.role, 'monitoring.integrations');

  
  const [timerQ, setTimerQ] = useState('');
  const [metricQ, setMetricQ] = useState('');
  const [auditQ, setAuditQ] = useState('');
  const [routeQ, setRouteQ] = useState('');

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    window.setTimeout(() => setToast(null), 3400);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [monitoring, priorities] = await Promise.all([getMonitoringData(), getRoutePriorities()]);
      setSnapshot(monitoring);
      setRoutes(priorities);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load monitoring information.', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const applyRoutes = async () => {
    setApplying(true);
    try {
      const result = await applyRoutePriorities();
      await load();
      showToast(`${result.updated} shipment route priorities updated.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to apply route priorities.', false);
    } finally {
      setApplying(false);
    }
  };

  const syncCarrier = async () => {
    setSyncingCarrier(true);
    try {
      const result = await synchronizeCarrierIntegration();
      await load();
      showToast(`Carrier sync checked ${result.checked} shipments, updated ${result.updated}, failures ${result.failures}.`, result.failures === 0);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to synchronize carrier data.', false);
    } finally {
      setSyncingCarrier(false);
    }
  };

  
  const filteredTimers = useMemo(() => {
    const q = timerQ.toLowerCase();
    return (snapshot?.timers ?? []).filter(t => !q || t.info.toLowerCase().includes(q));
  }, [snapshot, timerQ]);

  const filteredMetrics = useMemo(() => {
    const q = metricQ.toLowerCase();
    return (snapshot?.metrics ?? []).filter(m =>
      !q || m.type.toLowerCase().includes(q) || m.operation.toLowerCase().includes(q)
    );
  }, [snapshot, metricQ]);

  const filteredAudit = useMemo(() => {
    const q = auditQ.toLowerCase();
    return (snapshot?.audit ?? []).filter(a =>
      !q || a.action.toLowerCase().includes(q) || a.component.toLowerCase().includes(q) || a.method.toLowerCase().includes(q) || (a.performedBy ?? '').toLowerCase().includes(q)
    );
  }, [snapshot, auditQ]);

  const filteredRoutes = useMemo(() => {
    const q = routeQ.toLowerCase();
    return Object.entries(routes).filter(([id]) => !q || id.toLowerCase().includes(q));
  }, [routes, routeQ]);

  
  const successRate = snapshot?.metrics.length
    ? Math.round((snapshot.metrics.filter(m => m.success).length / snapshot.metrics.length) * 100)
    : null;

  
  const kpis = [
    {
      label: 'Avg Method Time',
      value: snapshot ? `${snapshot.averageMethodDurationMs.toFixed(1)} ms` : '—',
      icon: Gauge,
      color: 'blue',
      sub: 'Interceptor average'
    },
    {
      label: 'Performance Records',
      value: snapshot?.metrics.length ?? '—',
      icon: Activity,
      color: 'emerald',
      sub: 'Total measurements'
    },
    {
      label: 'Supply Alerts',
      value: snapshot?.alerts.length ?? '—',
      icon: ShieldAlert,
      color: 'amber',
      sub: 'Active notifications'
    },
    {
      label: 'EJB Timers',
      value: snapshot?.timers.length ?? '—',
      icon: Clock3,
      color: 'violet',
      sub: 'Persistent schedules'
    },
    {
      label: 'Success Rate',
      value: successRate !== null ? `${successRate}%` : '—',
      icon: TrendingUp,
      color: 'cyan',
      sub: 'Method executions'
    },
    {
      label: 'Route Priorities',
      value: Object.keys(routes).length,
      icon: Route,
      color: 'rose',
      sub: 'Shipments optimised'
    },
    {
      label: 'Carrier Gateway',
      value: snapshot?.integrations?.healthy ? 'Healthy' : 'Degraded',
      icon: RadioTower,
      color: 'emerald',
      sub: snapshot?.integrations?.outageSimulation ? 'Outage simulation active' : 'Retry adapter online'
    }
  ];

  return (
    <div className="mon-root">
      <PageHeader
        eyebrow="EJB operations"
        title="Monitoring"
        description="Review timer services, carrier integration health, interceptor performance metrics, audit activity, alerts, and route optimisation results."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary-btn" type="button" onClick={() => void load()} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            {canSyncCarrier && (
              <button className="secondary-btn" type="button" onClick={() => void syncCarrier()} disabled={syncingCarrier}>
                <RadioTower size={14} />
                {syncingCarrier ? 'Syncing…' : 'Sync Carriers'}
              </button>
            )}
            {canApplyRoutes && (
              <button className="primary-btn" type="button" onClick={() => void applyRoutes()} disabled={applying}>
                <Zap size={14} />
                {applying ? 'Applying…' : 'Apply Route Priorities'}
              </button>
            )}
          </div>
        }
      />

      
      <div className="mon-kpi-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <article key={kpi.label} className={`mon-kpi glass-panel mon-kpi-${kpi.color}`}>
              <div className="mon-kpi-icon">
                <Icon size={18} />
              </div>
              <div className="mon-kpi-body">
                <span className="mon-kpi-label">{kpi.label}</span>
                <strong className="mon-kpi-value">{loading ? '—' : kpi.value}</strong>
                <small className="mon-kpi-sub">{kpi.sub}</small>
              </div>
            </article>
          );
        })}
      </div>

      
      {!loading && snapshot && snapshot.alerts.length > 0 && (
        <div className="mon-alerts-banner glass-panel">
          <div className="mon-alerts-banner-head">
            <ShieldAlert size={16} />
            <strong>Supply Chain Alerts</strong>
            <span className="mon-alert-count">{snapshot.alerts.length}</span>
          </div>
          <div className="mon-alerts-banner-list">
            {snapshot.alerts.map((alert) => (
              <div key={alert.id} className={`mon-alert-chip mon-alert-${alert.type}`}>
                <span className="mon-alert-chip-dot" />
                <div>
                  <strong>{alert.title}</strong>
                  <p>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      <section className="glass-panel mon-section">
        <div className="mon-section-head">
          <div className="mon-section-head-left">
            <span className="mon-section-icon mon-icon-violet"><Clock3 size={15} /></span>
            <div>
              <h3>EJB Timer Service</h3>
              <p>Persistent logistics schedules reported by the application server.</p>
            </div>
          </div>
          <SearchBox value={timerQ} onChange={setTimerQ} placeholder="Search timers…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timer Info</th>
                <th>Next Timeout</th>
                <th>Persistent</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3}><div className="mon-loading-row"><div className="mon-spinner" /><span>Loading timers…</span></div></td></tr>
              ) : filteredTimers.length ? filteredTimers.map((timer, i) => (
                <tr key={`${timer.info}-${i}`}>
                  <td><span className="mon-timer-info">{timer.info}</span></td>
                  <td>{fmtDate(timer.nextTimeout)}</td>
                  <td>
                    <span className={`mon-bool-badge ${timer.persistent ? 'mon-bool-yes' : 'mon-bool-no'}`}>
                      {timer.persistent ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {timer.persistent ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="mon-empty-cell">{timerQ ? `No timers matching "${timerQ}"` : 'No active timers reported.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      
      <section className="glass-panel mon-section">
        <div className="mon-section-head">
          <div className="mon-section-head-left">
            <span className="mon-section-icon mon-icon-blue"><Activity size={15} /></span>
            <div>
              <h3>Interceptor Performance</h3>
              <p>Recent measured business-method executions.</p>
            </div>
          </div>
          <SearchBox value={metricQ} onChange={setMetricQ} placeholder="Filter by type or operation…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Operation</th>
                <th>Duration</th>
                <th>Result</th>
                <th>Recorded</th>
              </tr>
            </thead>
            <tbody>
              {filteredMetrics.length ? filteredMetrics.slice(0, 30).map((m) => (
                <tr key={m.id}>
                  <td><span className="mon-type-tag">{m.type}</span></td>
                  <td className="mon-operation-cell">{m.operation}</td>
                  <td>
                    <span className={`mon-duration ${m.durationMs > 500 ? 'mon-duration-slow' : m.durationMs > 200 ? 'mon-duration-mid' : 'mon-duration-fast'}`}>
                      {m.durationMs} ms
                    </span>
                  </td>
                  <td>
                    <span className={`mon-bool-badge ${m.success ? 'mon-bool-yes' : 'mon-bool-no'}`}>
                      {m.success ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {m.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="mon-date-cell">{fmtDate(m.recordedAt)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="mon-empty-cell">{metricQ ? `No metrics matching "${metricQ}"` : 'No performance measurements recorded yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredMetrics.length > 30 && (
          <div className="mon-table-footer">Showing first 30 of {filteredMetrics.length} records.</div>
        )}
      </section>

      
      <section className="glass-panel mon-section">
        <div className="mon-section-head">
          <div className="mon-section-head-left">
            <span className="mon-section-icon mon-icon-emerald"><BookOpen size={15} /></span>
            <div>
              <h3>Audit Trail</h3>
              <p>Cross-cutting logistics actions captured by the audit interceptor.</p>
            </div>
          </div>
          <SearchBox value={auditQ} onChange={setAuditQ} placeholder="Search by action, component or user…" />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Component</th>
                <th>User</th>
                <th>Result</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudit.length ? filteredAudit.slice(0, 40).map((e) => (
                <tr key={e.id}>
                  <td><span className="mon-audit-action">{e.action}</span></td>
                  <td className="mon-mono">{e.component}<span className="mon-muted">.{e.method}</span></td>
                  <td>{e.performedBy ?? <span className="mon-system-tag">SYSTEM</span>}</td>
                  <td>
                    <span className={`mon-bool-badge ${e.success ? 'mon-bool-yes' : 'mon-bool-no'}`}>
                      {e.success ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                      {e.success ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td className="mon-date-cell">{fmtDate(e.timestamp)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="mon-empty-cell">{auditQ ? `No entries matching "${auditQ}"` : 'No audit activity recorded yet.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredAudit.length > 40 && (
          <div className="mon-table-footer">Showing first 40 of {filteredAudit.length} records.</div>
        )}
      </section>

      
      <section className="glass-panel mon-section">
        <div className="mon-section-head">
          <div className="mon-section-head-left">
            <span className="mon-section-icon mon-icon-amber"><Route size={15} /></span>
            <div>
              <h3>Route Optimisation</h3>
              <p>Calculated priorities for active shipment routes.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SearchBox value={routeQ} onChange={setRouteQ} placeholder="Search shipment ID…" />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Shipment Database ID</th>
                <th>Priority Score</th>
                <th>Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length ? filteredRoutes.map(([shipmentId, priority]) => {
                const level = priority >= 80 ? 'critical' : priority >= 50 ? 'high' : priority >= 25 ? 'medium' : 'low';
                return (
                  <tr key={shipmentId}>
                    <td><span className="mon-mono">#{shipmentId}</span></td>
                    <td>
                      <div className="mon-priority-bar-wrap">
                        <div className="mon-priority-bar">
                          <div className={`mon-priority-fill mon-priority-${level}`} style={{ width: `${Math.min(priority, 100)}%` }} />
                        </div>
                        <span className="mon-priority-val">{priority}</span>
                      </div>
                    </td>
                    <td><span className={`mon-level-badge mon-level-${level}`}>{level.charAt(0).toUpperCase() + level.slice(1)}</span></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={3} className="mon-empty-cell">{routeQ ? `No routes matching "${routeQ}"` : 'No route priorities available.'}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      
      {toast && (
        <div className={`toast ${toast.ok ? '' : 'toast-error'}`}>
          {toast.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <div>
            <strong>Monitoring</strong>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
