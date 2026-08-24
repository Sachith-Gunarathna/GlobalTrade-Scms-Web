'use client';

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, Download, Target, TrendingUp } from 'lucide-react';
import { PageHeader } from './PageHeader';

type Analytics = {
  revenue: { month:string; revenue:number; target:number }[];
  regions: { region:string; shipments:number }[];
  fulfillment: { name:string; value:number }[];
  topSuppliers: { name:string; volume:number }[];
};

const pieColors = ['#10b981','#f59e0b','#3b82f6'];

export function AnalyticsClient({ data }: { data: Analytics }) {
  const exportReport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'globaltrade-analytics-report.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return <>
    <PageHeader eyebrow="Decision intelligence" title="Analytics" description="Measure revenue, shipment volume, fulfillment quality, and partner contribution." action={<button className="secondary-btn" onClick={exportReport}><Download size={16}/> Export report</button>} />
    <div className="analytics-highlight glass-panel"><div className="highlight-icon"><TrendingUp size={24}/></div><div><span>August performance pulse</span><h2>Revenue is 16.1% above plan</h2><p>APAC shipment growth and stronger supplier reliability are improving margin and fulfillment performance.</p></div><div className="highlight-value"><small>YTD revenue</small><strong>$6.11M</strong><span><ArrowUpRight size={14}/> 13.8%</span></div></div>

    <section className="analytics-grid">
      <article className="panel glass-panel analytics-wide"><div className="panel-head"><div><span className="section-label">Financial performance</span><h2>Revenue trend</h2></div><span className="metric-chip"><Target size={14}/> Target vs actual</span></div><div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.revenue} margin={{top:12,right:10,left:2,bottom:0}}><CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false}/><XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false}/><YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(v)=>`$${v/1000}k`}/><Tooltip formatter={(v)=>`$${Number(v).toLocaleString()}`} contentStyle={{background:'#111a2d',border:'1px solid rgba(148,163,184,.14)',borderRadius:12}}/><Legend/><Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} dot={{r:4,fill:'#3b82f6'}}/><Line type="monotone" dataKey="target" name="Target" stroke="#64748b" strokeWidth={2} strokeDasharray="6 6" dot={false}/></LineChart></ResponsiveContainer></div></article>

      <article className="panel glass-panel"><div className="panel-head"><div><span className="section-label">Fulfillment quality</span><h2>Order fulfillment</h2></div></div><div className="donut-wrap"><ResponsiveContainer width="100%" height={230}><PieChart><Pie data={data.fulfillment} dataKey="value" nameKey="name" innerRadius={68} outerRadius={91} paddingAngle={4} stroke="none">{data.fulfillment.map((_,i)=><Cell key={i} fill={pieColors[i]}/>)}</Pie><Tooltip contentStyle={{background:'#111a2d',border:'1px solid rgba(148,163,184,.14)',borderRadius:12}}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>86%</strong><span>on time</span></div></div><div className="donut-legend">{data.fulfillment.map((x,i)=><span key={x.name}><i style={{background:pieColors[i]}}/>{x.name}<strong>{x.value}%</strong></span>)}</div></article>

      <article className="panel glass-panel analytics-wide"><div className="panel-head"><div><span className="section-label">Lane activity</span><h2>Shipment volume by region</h2></div></div><div className="analytics-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.regions} margin={{top:12,right:10,left:-14,bottom:0}}><CartesianGrid stroke="rgba(148,163,184,.08)" vertical={false}/><XAxis dataKey="region" stroke="#64748b" axisLine={false} tickLine={false}/><YAxis stroke="#64748b" axisLine={false} tickLine={false}/><Tooltip contentStyle={{background:'#111a2d',border:'1px solid rgba(148,163,184,.14)',borderRadius:12}}/><Bar dataKey="shipments" fill="#3b82f6" radius={[7,7,0,0]} maxBarSize={54}/></BarChart></ResponsiveContainer></div></article>

      <article className="panel glass-panel"><div className="panel-head"><div><span className="section-label">Sourcing leaders</span><h2>Top suppliers</h2></div></div><div className="rank-list">{data.topSuppliers.map((s,i)=><div key={s.name} className="rank-row"><span className="rank-num">{String(i+1).padStart(2,'0')}</span><div><strong>{s.name}</strong><span><i style={{width:`${Math.round(s.volume/data.topSuppliers[0].volume*100)}%`}}/></span></div><b>{s.volume}</b></div>)}</div></article>
    </section>
  </>;
}
