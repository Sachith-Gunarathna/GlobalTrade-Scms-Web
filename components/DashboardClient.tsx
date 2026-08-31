'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import {
  ArrowRight,
  Boxes,
  Clock3,
  Info,
  PackageCheck,
  TriangleAlert,
  Truck,
  UsersRound
} from 'lucide-react';

import Link from 'next/link';

import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { getDashboardData } from '@/app/services/apiService';

import type {
  DashboardResponse
} from '@/types';


function formatStatus(status: string) {

  if (!status) {
    return 'Unknown';
  }

  return status
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function formatDateTime(value: string | null) {

  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


export function DashboardClient() {

  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    let active = true;

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError(null);

        const result = await getDashboardData();

        if (!active) {
          return;
        }

        if (!result) {
          setError(
            'Unable to load dashboard data from the backend.'
          );
          return;
        }

        setData(result);

      } catch (err) {

        console.error(err);

        if (active) {
          setError(
            'Unable to load dashboard data from the backend.'
          );
        }

      } finally {

        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };

  }, []);


  if (loading) {

    return (
      <div
        className="dashboard-loading"
        aria-label="Loading dashboard"
      >
        <div className="skeleton skeleton-page-head" />

        <div className="loading-kpis">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="skeleton skeleton-kpi"
              key={index}
            />
          ))}
        </div>

        <div className="loading-dashboard-grid">
          <div className="skeleton skeleton-chart" />
          <div className="skeleton skeleton-side-panel" />
        </div>
      </div>
    );
  }


  if (error || !data) {

    return (
      <>
        <div className="page-header">
          <div>
            <span className="eyebrow">
              GlobalTrade SCMS
            </span>

            <h1>Supply chain overview</h1>

            <p>
              Live operational data from the supply chain system.
            </p>
          </div>
        </div>

        <article className="panel glass-panel">
          <EmptyState
            title="Dashboard unavailable"
            description={
              error ??
              'Dashboard data could not be loaded.'
            }
          />
        </article>
      </>
    );
  }


  const kpis = [
    {
      label: 'Total Shipments',
      value: data.kpis.totalShipments,
      icon: Truck
    },
    {
      label: 'In Transit',
      value: data.kpis.inTransit,
      icon: PackageCheck
    },
    {
      label: 'Low Stock Items',
      value: data.kpis.lowStockItems,
      icon: Boxes
    },
    {
      label: 'Total Suppliers',
      value: data.kpis.totalSuppliers,
      icon: UsersRound
    }
  ];


  const shipmentStatusData = [
    { name: 'Pending',    count: data.shipmentStatus.pending,   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  glow: 'rgba(245,158,11,0.35)' },
    { name: 'In Transit', count: data.shipmentStatus.inTransit, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  glow: 'rgba(56,189,248,0.35)'  },
    { name: 'Delayed',    count: data.shipmentStatus.delayed,   color: '#f87171', bg: 'rgba(239,68,68,0.12)',   glow: 'rgba(239,68,68,0.35)'   },
    { name: 'Delivered',  count: data.shipmentStatus.delivered, color: '#34d399', bg: 'rgba(16,185,129,0.12)', glow: 'rgba(16,185,129,0.35)'  },
  ];

  const totalShipmentCount = shipmentStatusData.reduce((s, d) => s + d.count, 0) || 1;

  const ShipmentBarTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof shipmentStatusData[0]; value: number }[] }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const pct = Math.round((d.count / totalShipmentCount) * 100);
    return (
      <div style={{ background: '#0d1a30', border: `1px solid ${d.color}44`, borderRadius: 12, padding: '10px 14px', minWidth: 130 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}`, display: 'inline-block' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: d.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.name}</span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 730, color: '#f0f7ff', letterSpacing: '-0.6px' }}>{d.count.toLocaleString()}</div>
        <div style={{ fontSize: 9, color: '#5d7998', marginTop: 2 }}>{pct}% of total fleet</div>
      </div>
    );
  };


  const currentDate = new Date().toLocaleDateString(
    'en-GB',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
  );


  return (
    <>

      

      <div className="page-header dashboard-head">

        <div>

          <span className="eyebrow">
            {currentDate}
          </span>

          <h1>Supply chain overview</h1>

          <p>
            Live operational health across your global trade network.
          </p>

        </div>

        <div className="live-pill">
          <span />
          Live data
          <small>Backend connected</small>
        </div>

      </div>


      

      <section className="kpi-grid">

        {kpis.map((kpi, index) => {

          const Icon = kpi.icon;

          return (
            <article
              className="kpi-card glass-panel"
              key={kpi.label}
            >

              <div className="kpi-top">

                <span
                  className={`kpi-icon kpi-${index}`}
                >
                  <Icon size={21} />
                </span>

              </div>

              <div className="kpi-bottom">

                <div>

                  <p>{kpi.label}</p>

                  <strong>
                    {kpi.value.toLocaleString()}
                  </strong>

                  <small>
                    Current database total
                  </small>

                </div>

              </div>

            </article>
          );
        })}

      </section>


      

      <section
        className="dashboard-grid dashboard-primary"
      >

        

        <article className="panel chart-panel glass-panel span-2">

          <div className="panel-head">
            <div>
              <span className="section-label">Shipment monitoring</span>
              <h2>Shipment status overview</h2>
            </div>
            
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {shipmentStatusData.map((d) => (
                <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#7a90aa', fontWeight: 600 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, boxShadow: `0 0 8px ${d.color}`, display: 'inline-block', flexShrink: 0 }} />
                  {d.name}
                  <strong style={{ color: d.color, fontWeight: 730 }}>{d.count}</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="main-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shipmentStatusData}
                margin={{ top: 14, right: 8, left: -20, bottom: 0 }}
                barCategoryGap="32%"
              >
                <defs>
                  {shipmentStatusData.map((d) => (
                    <linearGradient key={d.name} id={`grad-${d.name.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={d.color} stopOpacity={0.35} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid stroke="rgba(148,163,184,.06)" vertical={false} />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#4a5e78' }}
                  width={32}
                />

                <Tooltip content={<ShipmentBarTooltip />} cursor={{ fill: 'rgba(148,163,184,0.05)', radius: 8 }} />

                <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  {shipmentStatusData.map((d) => (
                    <Cell key={d.name} fill={`url(#grad-${d.name.replace(/\s/g, '')})`} />
                  ))}
                </Bar>

              </BarChart>
            </ResponsiveContainer>
          </div>

        </article>


        

        <article
          className="panel alerts-panel glass-panel"
        >

          <div className="panel-head">

            <div>

              <span className="section-label">
                Attention needed
              </span>

              <h2>
                Operational alerts
              </h2>

            </div>

            <span className="count-badge">
              {data.alerts.length}
            </span>

          </div>


          {data.alerts.length === 0 ? (

            <EmptyState
              title="No active alerts"
              description="No shipment, inventory or customs alerts require attention."
            />

          ) : (

            <div className="alerts-list">

              {data.alerts.map((alert, index) => (

                <div
                  className="alert-row"
                  key={`${alert.category}-${alert.referenceId}-${index}`}
                >

                  <span
                    className={`alert-icon ${alert.type}`}
                  >

                    {alert.type === 'danger' ||
                      alert.type === 'warning'
                      ? (
                        <TriangleAlert size={16} />
                      )
                      : (
                        <Info size={16} />
                      )}

                  </span>

                  <div>

                    <strong>
                      {alert.title}
                    </strong>

                    <p>
                      {alert.message}
                    </p>

                    <small>
                      {alert.category}
                    </small>

                  </div>

                </div>

              ))}

            </div>
          )}


          <Link
            href="/shipments"
            className="panel-link"
          >
            Review shipments
            <ArrowRight size={15} />
          </Link>

        </article>

      </section>


      

      <section
        className="dashboard-grid dashboard-secondary"
      >

        

        <article
          className="panel glass-panel span-2"
        >

          <div className="panel-head">

            <div>

              <span className="section-label">
                Shipment activity
              </span>

              <h2>
                Recent shipments
              </h2>

            </div>

            <Link
              href="/shipments"
              className="text-link"
            >
              View all
              <ArrowRight size={14} />
            </Link>

          </div>


          {data.recentShipments.length === 0 ? (

            <EmptyState
              title="No shipments found"
              description="Recent shipments will appear here when shipment records are available."
            />

          ) : (

            <div className="table-wrap compact-table">

              <table>

                <thead>

                  <tr>
                    <th>Tracking</th>
                    <th>Route</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>

                </thead>

                <tbody>

                  {data.recentShipments.map(
                    (shipment) => (

                      <tr key={shipment.id}>

                        <td>

                          <strong className="mono">
                            {shipment.trackingNumber}
                          </strong>

                        </td>

                        <td>
                          {shipment.origin}
                          {' → '}
                          {shipment.destination}
                        </td>

                        <td>
                          {shipment.vendor}
                        </td>

                        <td>

                          <StatusBadge
                            status={formatStatus(
                              shipment.status
                            )}
                          />

                        </td>

                        <td>
                          {formatDateTime(
                            shipment.estimatedDeliveryDate
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </article>


        

        <article
          className="panel alerts-panel glass-panel"
        >

          <div className="panel-head">

            <div>

              <span className="section-label">
                Audit trail
              </span>

              <h2>
                Recent system activity
              </h2>

            </div>

          </div>


          {data.recentActivity.length === 0 ? (

            <EmptyState
              title="No recent activity"
              description="System audit activity will appear here."
            />

          ) : (

            <div className="alerts-list">

              {data.recentActivity.map(
                (activity) => (

                  <div
                    className="alert-row"
                    key={activity.id}
                  >

                    <span className="alert-icon info">
                      <Info size={16} />
                    </span>

                    <div>

                      <strong>
                        {activity.action}
                      </strong>

                      <p>
                        {activity.methodName}
                      </p>

                      <small>

                        <Clock3 size={12} />

                        {formatDateTime(
                          activity.timestamp
                        )}

                        {' · '}

                        {activity.performedBy ??
                          'System'}

                      </small>

                    </div>

                  </div>

                )
              )}

            </div>
          )}

        </article>

      </section>

    </>
  );
}
