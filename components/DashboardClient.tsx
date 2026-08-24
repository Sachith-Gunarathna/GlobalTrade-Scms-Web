'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Boxes, CircleDollarSign, PackageCheck, Truck, UsersRound, ArrowRight, Clock3, TriangleAlert, Info } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from './StatusBadge';
import { TradeMap } from './TradeMap';
import type { Order } from '@/types';

type Kpi = { label: string; value: string; delta: string; trend: string; spark: number[] };
type DashboardData = {
  kpis: Kpi[];
  shipmentTrend: { day: string; delivered: number; inTransit: number }[];
  alerts: { type: string; title: string; message: string; time: string }[];
};

const kpiIcons = [Truck, PackageCheck, CircleDollarSign, UsersRound];

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values), min = Math.min(...values);
  const points = values.map((v, i) => `${(i / (values.length - 1)) * 100},${32 - ((v - min) / Math.max(max - min, 1)) * 26}`).join(' ');
  return <svg className="sparkline" viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points={points} fill="none" vectorEffect="non-scaling-stroke" /></svg>;
}

export function DashboardClient({ data, orders }: { data: DashboardData; orders: Order[] }) {
  return <>
    <div className="page-header dashboard-head">
      <div><span className="eyebrow">Monday · 24 August 2026</span><h1>Supply chain overview</h1><p>Live operational health across your global trade network.</p></div>
      <div className="live-pill"><span /> Live data <small>Updated just now</small></div>
    </div>

    <section className="kpi-grid">
      {data.kpis.map((kpi, i) => {
        const Icon = kpiIcons[i]; const up = kpi.trend === 'up';
        return <article className="kpi-card glass-panel" key={kpi.label}>
          <div className="kpi-top"><span className={`kpi-icon kpi-${i}`}><Icon size={21} /></span><span className={`trend ${up ? 'positive' : 'negative'}`}>{up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {kpi.delta}</span></div>
          <div className="kpi-bottom"><div><p>{kpi.label}</p><strong>{kpi.value}</strong><small>vs. previous 30 days</small></div><Sparkline values={kpi.spark} /></div>
        </article>;
      })}
    </section>

    <section className="dashboard-grid dashboard-primary">
      <article className="panel chart-panel glass-panel span-2">
        <div className="panel-head"><div><span className="section-label">Shipment flow</span><h2>30-day movement</h2></div><div className="chart-legend"><span><i className="blue"/>In transit</span><span><i className="green"/>Delivered</span></div></div>
        <div className="main-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.shipmentTrend} margin={{ top: 12, right: 8, left: -24, bottom: 0 }}>
              <defs><linearGradient id="inTransitFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.33}/><stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient><linearGradient id="deliveredFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="100%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#111a2d', border: '1px solid rgba(148,163,184,.14)', borderRadius: 12, color: '#e5eefc' }} />
              <Area type="monotone" dataKey="inTransit" stroke="#3b82f6" strokeWidth={2.4} fill="url(#inTransitFill)" />
              <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={2.1} fill="url(#deliveredFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel alerts-panel glass-panel">
        <div className="panel-head"><div><span className="section-label">Attention needed</span><h2>Operational alerts</h2></div><span className="count-badge">{data.alerts.length}</span></div>
        <div className="alerts-list">
          {data.alerts.map((alert, i) => <div className="alert-row" key={i}><span className={`alert-icon ${alert.type}`}>{alert.type === 'info' ? <Info size={16}/> : <TriangleAlert size={16}/>}</span><div><strong>{alert.title}</strong><p>{alert.message}</p><small><Clock3 size={12}/>{alert.time} ago</small></div></div>)}
        </div>
        <Link href="/shipments" className="panel-link">Review exceptions <ArrowRight size={15}/></Link>
      </article>
    </section>

    <section className="dashboard-grid dashboard-secondary">
      <article className="panel glass-panel span-2">
        <div className="panel-head"><div><span className="section-label">Order activity</span><h2>Recent orders</h2></div><Link href="/orders" className="text-link">View all <ArrowRight size={14}/></Link></div>
        <div className="table-wrap compact-table"><table><thead><tr><th>Order</th><th>Customer</th><th>Value</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.slice(0, 5).map((o) => <tr key={o.id}><td><strong className="mono">{o.id}</strong></td><td>{o.customer}</td><td className="value-cell">${o.total.toLocaleString()}</td><td><StatusBadge status={o.status}/></td><td>{new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td></tr>)}</tbody></table></div>
      </article>
      <article className="panel glass-panel map-panel">
        <div className="panel-head"><div><span className="section-label">Island network</span><h2>Sri Lanka Trade Routes</h2></div><span className="map-status"><i/> 12 Hubs Active</span></div>
        <TradeMap />
      </article>
    </section>
  </>;
}
