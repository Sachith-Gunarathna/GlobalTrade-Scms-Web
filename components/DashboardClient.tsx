'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
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
    {
      name: 'Pending',
      count: data.shipmentStatus.pending
    },
    {
      name: 'In Transit',
      count: data.shipmentStatus.inTransit
    },
    {
      name: 'Delayed',
      count: data.shipmentStatus.delayed
    },
    {
      name: 'Delivered',
      count: data.shipmentStatus.delivered
    }
  ];


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

        

        <article
          className="panel chart-panel glass-panel span-2"
        >

          <div className="panel-head">

            <div>

              <span className="section-label">
                Shipment monitoring
              </span>

              <h2>
                Shipment status overview
              </h2>

            </div>

          </div>


          <div className="main-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={shipmentStatusData}
                margin={{
                  top: 12,
                  right: 8,
                  left: -24,
                  bottom: 0
                }}
              >

                <CartesianGrid
                  stroke="rgba(148,163,184,.08)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  contentStyle={{
                    background: '#111a2d',
                    border:
                      '1px solid rgba(148,163,184,.14)',
                    borderRadius: 12,
                    color: '#e5eefc'
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />

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
