'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Target, TrendingUp } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { EmptyState } from './EmptyState';
import { getAnalyticsData } from '@/app/services/apiService';
import type { AnalyticsResponse } from '@/types';

const pieColors = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#00d2ff', '#f43f5e'];

export function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getAnalyticsData()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load analytics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const totalRevenue = useMemo(() => data?.revenue.reduce((sum, row) => sum + Number(row.revenue), 0) ?? 0, [data]);

  const exportReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'globaltrade-analytics-report.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="app-loading" aria-label="Loading analytics" />;

  if (!data || error) {
    return <article className="panel glass-panel"><EmptyState title="Analytics unavailable" description={error ?? 'Analytics data could not be loaded.'} /></article>;
  }

  const deliveredItem = data.fulfillment.find((item) => item.name.toLowerCase() === 'delivered') ?? data.fulfillment[0];
  const delivered = deliveredItem?.value ?? 0;
  const deliveredLabel = deliveredItem?.name ?? 'Delivered';
  const maxSupplierVolume = Math.max(1, ...data.topSuppliers.map((item) => item.volume));

  return <>
    <PageHeader eyebrow="Decision intelligence" title="Analytics" description="Live revenue, shipment volume, fulfillment quality, and supplier contribution from the SCMS database." action={<button className="secondary-btn" onClick={exportReport}><Download size={16}/> Export report</button>} />
    <div className="analytics-highlight glass-panel"><div className="highlight-icon"><TrendingUp size={24}/></div><div><span>Operational performance</span><h2>{delivered}% of recorded orders are {deliveredLabel.toLowerCase()}</h2><p>Analytics are calculated from current order and supplier records in the backend.</p></div><div className="highlight-value"><small>Six-month revenue</small><strong>${totalRevenue.toLocaleString()}</strong></div></div>

    <section className="analytics-grid">
      <article className="panel glass-panel analytics-wide"><div className="panel-head"><div><span className="section-label">Financial performance</span><h2>Revenue trend</h2></div><span className="metric-chip"><Target size={14}/> Actual vs reference target</span></div><div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.revenue} margin={{top:12,right:10,left:2,bottom:0}}><CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false}/><XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false}/><YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(v)=>`$${v/1000}k`}/><Tooltip formatter={(v)=>`$${Number(v).toLocaleString()}`} contentStyle={{background:'#111a2d',border:'1px solid rgba(148,163,184,.14)',borderRadius:12}}/><Legend/><Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} dot={{r:4,fill:'#3b82f6'}}/><Line type="monotone" dataKey="target" name="Reference Target" stroke="#64748b" strokeWidth={2} strokeDasharray="6 6" dot={false}/></LineChart></ResponsiveContainer></div></article>

      <article className="panel glass-panel"><div className="panel-head"><div><span className="section-label">Fulfillment quality</span><h2>Order fulfillment</h2></div></div><div className="donut-wrap"><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={data.fulfillment} dataKey="value" nameKey="name" innerRadius={68} outerRadius={91} paddingAngle={4} stroke="none">{data.fulfillment.map((_,i)=><Cell key={i} fill={pieColors[i % pieColors.length]}/>)}</Pie><Tooltip formatter={(v, name) => [`${v}%`, name]} contentStyle={{background:'#111a2d',border:'1px solid rgba(148,163,184,.14)',borderRadius:12}}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{delivered}%</strong><span>{deliveredLabel.toLowerCase()}</span></div></div><div className="donut-legend">{data.fulfillment.map((x,i)=><span key={x.name}><i style={{background:pieColors[i % pieColors.length]}}/>{x.name}<strong>{x.value}%</strong></span>)}</div></article>

      <article className="panel glass-panel analytics-wide">
        <div className="panel-head">
          <div>
            <span className="section-label">Regional activity</span>
            <h2>Orders by region</h2>
          </div>
          <span className="metric-chip" style={{ gap: 6 }}>
            {data.regions.reduce((s, r) => s + r.shipments, 0).toLocaleString()} total orders
          </span>
        </div>
        <div className="analytics-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.regions}
              margin={{ top: 14, right: 10, left: -10, bottom: 0 }}
              barCategoryGap="30%"
            >
              <defs>
                {(['#3b82f6','#10b981','#8b5cf6','#f59e0b','#f43f5e'] as const).map((color, i) => (
                  <linearGradient key={i} id={`rg-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid stroke="rgba(148,163,184,.06)" vertical={false} />

              <XAxis
                dataKey="region"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#4a5e78' }}
                width={30}
              />

              <Tooltip
                content={(props: import('recharts').TooltipProps<number, string>) => {
                  const { active, payload } = props;
                  if (!active || !payload?.length) return null;
                  const entry = payload[0];
                  const d = entry.payload as { region: string; shipments: number };
                  if (!d) return null;
                  const regionColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b','#f43f5e'];
                  const idx = data.regions.findIndex(r => r.region === d.region);
                  const color = regionColors[idx % regionColors.length];
                  const total = data.regions.reduce((s, r) => s + r.shipments, 0) || 1;
                  const pct = Math.round((d.shipments / total) * 100);
                  return (
                    <div style={{ background: '#0d1a30', border: `1px solid ${color}44`, borderRadius: 12, padding: '10px 14px', minWidth: 140 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.region}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 730, color: '#f0f7ff', letterSpacing: '-0.6px' }}>{d.shipments.toLocaleString()}</div>
                      <div style={{ fontSize: 9, color: '#5d7998', marginTop: 2 }}>{pct}% of all orders</div>
                    </div>
                  );
                }}
                cursor={{ fill: 'rgba(148,163,184,0.05)', radius: 8 }}
              />

              <Bar dataKey="shipments" name="Orders" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {data.regions.map((_, i) => (
                  <Cell key={i} fill={`url(#rg-${i % 5})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="panel glass-panel"><div className="panel-head"><div><span className="section-label">Sourcing leaders</span><h2>Top suppliers</h2></div></div><div className="rank-list">{data.topSuppliers.length ? data.topSuppliers.map((supplier,index)=><div key={supplier.name} className="rank-row"><span className="rank-num">{String(index+1).padStart(2,'0')}</span><div><strong>{supplier.name}</strong><span><i style={{width:`${Math.round(supplier.volume/maxSupplierVolume*100)}%`}}/></span></div><b>{supplier.volume}</b></div>) : <EmptyState title="No supplier data" />}</div></article>
    </section>
  </>;
}
