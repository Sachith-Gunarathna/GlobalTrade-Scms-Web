'use client';

import { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  Ship,
  SlidersHorizontal,
  Truck,
  Plus,
  CheckCircle2,
  Package,
  DollarSign,
  Scale,
  Calendar,
  Building
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import type { Shipment, ShipmentStatus } from '@/types';

const statuses = ['All', 'In Transit', 'Delayed', 'Delivered', 'Pending'];

export function ShipmentsClient({
  shipments: initialShipments,
  initialQuery = ''
}: {
  shipments: Shipment[];
  initialQuery?: string;
}) {
  const [shipmentsList, setShipmentsList] = useState<Shipment[]>(initialShipments);
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState(initialQuery);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [origin, setOrigin] = useState('All origins');
  const [destination, setDestination] = useState('All destinations');
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Shipment Form State
  const [newShipment, setNewShipment] = useState({
    id: `SHP-${Math.floor(78400 + Math.random() * 900)}`,
    origin: 'Port of Colombo',
    destination: 'Kandy Regional Depot',
    status: 'In Transit' as ShipmentStatus,
    eta: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    carrier: 'Sri Lanka Logistics Lines',
    vessel: 'WP-CAB-8492 (Freight Master)',
    value: 48500,
    weight: '16,200 kg',
    progress: 15,
  });

  const origins = ['All origins', ...Array.from(new Set(shipmentsList.map((s) => s.origin)))];
  const destinations = ['All destinations', ...Array.from(new Set(shipmentsList.map((s) => s.destination)))];

  const filtered = useMemo(() => shipmentsList.filter((s) => {
    const q = query.toLowerCase();
    const matchQuery = !q || `${s.id} ${s.origin} ${s.destination} ${s.carrier}`.toLowerCase().includes(q);
    const matchStatus = status === 'All' || s.status === status;
    const matchOrigin = origin === 'All origins' || s.origin === origin;
    const matchDestination = destination === 'All destinations' || s.destination === destination;
    const matchFrom = !fromDate || s.eta >= fromDate;
    const matchTo = !toDate || s.eta <= toDate;
    return matchQuery && matchStatus && matchOrigin && matchDestination && matchFrom && matchTo;
  }), [shipmentsList, status, query, origin, destination, fromDate, toDate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Shipment = {
      ...newShipment,
      value: Number(newShipment.value),
      progress: Number(newShipment.progress),
      updated: 'Just now'
    };

    setShipmentsList([created, ...shipmentsList]);
    setIsCreateOpen(false);
    showToast(`Shipment ${created.id} created and dispatched successfully!`);

    // Reset form with new ID
    setNewShipment({
      id: `SHP-${Math.floor(78400 + Math.random() * 900)}`,
      origin: 'Port of Colombo',
      destination: 'Anuradhapura Logistics Hub',
      status: 'In Transit',
      eta: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      carrier: 'Sri Lanka Logistics Lines',
      vessel: 'WP-CAB-9102 (Express)',
      value: 52000,
      weight: '18,500 kg',
      progress: 10,
    });
  };

  return <>
    <PageHeader
      eyebrow="Logistics control"
      title="Shipments"
      description="Track cargo movement, exceptions, carriers, and arrival timelines across every lane."
      action={
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsCreateOpen(true)}
        >
          <Truck size={17} /> Create shipment
        </button>
      }
    />

    <div className="stat-strip glass-panel">
      <div><span>In transit</span><strong>{shipmentsList.filter(s => s.status === 'In Transit').length}</strong><small className="positive-text">+3 today</small></div>
      <div><span>Delayed</span><strong>{shipmentsList.filter(s => s.status === 'Delayed').length}</strong><small className="danger-text">Requires review</small></div>
      <div><span>Delivered</span><strong>{shipmentsList.filter(s => s.status === 'Delivered').length}</strong><small>Across active ports</small></div>
      <div><span>On-time rate</span><strong>95.2%</strong><small className="positive-text">+1.6%</small></div>
    </div>

    <section className="panel glass-panel data-panel">
      <div className="table-toolbar">
        <div className="toolbar-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, route or carrier..." /></div>
        <div className="toolbar-group">
          <div className="select-wrap"><Filter size={15}/><select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></div>
          <div className="select-wrap"><MapPin size={15}/><select aria-label="Filter by origin" value={origin} onChange={(e) => setOrigin(e.target.value)}>{origins.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div className="select-wrap"><MapPin size={15}/><select aria-label="Filter by destination" value={destination} onChange={(e) => setDestination(e.target.value)}>{destinations.map((x) => <option key={x}>{x}</option>)}</select></div>
          <div className="date-filter"><CalendarDays size={15}/><input aria-label="ETA from date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /><span className="date-sep">→</span><input aria-label="ETA to date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          {(query || status !== 'All' || origin !== 'All origins' || destination !== 'All destinations' || fromDate || toDate) && <button className="ghost-btn" onClick={() => { setQuery(''); setStatus('All'); setOrigin('All origins'); setDestination('All destinations'); setFromDate(''); setToDate(''); }}>Clear</button>}
        </div>
      </div>
      <div className="result-summary"><span>{filtered.length} of {shipmentsList.length} shipments</span><button><SlidersHorizontal size={14}/> Columns</button></div>
      <div className="table-wrap">
        <table><thead><tr><th>Shipment ID</th><th>Origin</th><th>Destination</th><th>Status</th><th>ETA</th><th>Carrier</th><th>Progress</th><th /></tr></thead>
        <tbody>{filtered.map((s) => <tr key={s.id} className="clickable-row" onClick={() => setSelected(s)}>
          <td><strong className="mono">{s.id}</strong></td>
          <td><span className="location-cell"><MapPin size={14}/>{s.origin}</span></td>
          <td><span className="location-cell"><MapPin size={14}/>{s.destination}</span></td>
          <td><StatusBadge status={s.status}/></td>
          <td>{new Date(s.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
          <td>{s.carrier}</td>
          <td><div className="mini-progress"><span><i style={{width:`${s.progress}%`}}/></span><small>{s.progress}%</small></div></td>
          <td><ChevronRight size={16} className="row-arrow"/></td>
        </tr>)}</tbody></table>
        {!filtered.length && <EmptyState title="No shipments found"/>}
      </div>
    </section>

    {/* Detail Modal */}
    {selected && <Modal title={selected.id} subtitle={`${selected.origin} → ${selected.destination}`} onClose={() => setSelected(null)}>
      <div className="detail-hero">
        <span className="detail-icon"><Ship size={26}/></span>
        <div><StatusBadge status={selected.status}/><h3>{selected.carrier}</h3><p>{selected.vessel}</p></div>
        <div className="detail-value"><span>Cargo value</span><strong>${selected.value.toLocaleString()}</strong></div>
      </div>
      <div className="detail-grid">
        <div><span><CalendarDays size={14}/> Estimated arrival</span><strong>{new Date(selected.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
        <div><span><Scale size={14}/> Gross weight</span><strong>{selected.weight}</strong></div>
        <div><span><MapPin size={14}/> Origin port</span><strong>{selected.origin}</strong></div>
        <div><span><MapPin size={14}/> Destination</span><strong>{selected.destination}</strong></div>
      </div>
      <div className="shipment-progress">
        <div className="progress-label"><span>Transit progress</span><strong>{selected.progress}% completed</strong></div>
        <div className="progress-track"><i style={{width: `${selected.progress}%`}}/></div>
        <div className="route-points"><span className="done"><i/> Departed ({selected.origin})</span><span>Customs cleared</span><span><i/> Final ETA ({selected.destination})</span></div>
      </div>
    </Modal>}

    {/* Create Shipment Modal Form */}
    {isCreateOpen && (
      <Modal
        title="Create New Shipment"
        subtitle="Initiate cargo movement across Sri Lanka domestic and international shipping corridors"
        onClose={() => setIsCreateOpen(false)}
      >
        <form onSubmit={handleCreateShipment} className="modal-form-wrap">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Shipment Reference ID</label>
              <input
                type="text"
                value={newShipment.id}
                onChange={(e) => setNewShipment({ ...newShipment, id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Initial Status</label>
              <select
                value={newShipment.status}
                onChange={(e) => setNewShipment({ ...newShipment, status: e.target.value as ShipmentStatus })}
              >
                <option value="In Transit">In Transit (Active)</option>
                <option value="Pending">Pending Dispatch</option>
                <option value="Delayed">Delayed / Port Hold</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><MapPin size={13} /> Origin Terminal / Port</label>
              <input
                type="text"
                value={newShipment.origin}
                onChange={(e) => setNewShipment({ ...newShipment, origin: e.target.value })}
                placeholder="e.g. Port of Colombo, Sri Lanka"
                required
              />
            </div>
            <div className="form-group">
              <label><MapPin size={13} /> Destination Hub / Depot</label>
              <input
                type="text"
                value={newShipment.destination}
                onChange={(e) => setNewShipment({ ...newShipment, destination: e.target.value })}
                placeholder="e.g. Kandy Regional Depot, Galle Port"
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Building size={13} /> Carrier / Logistics Provider</label>
              <input
                type="text"
                value={newShipment.carrier}
                onChange={(e) => setNewShipment({ ...newShipment, carrier: e.target.value })}
                placeholder="e.g. Sri Lanka Logistics Lines"
                required
              />
            </div>
            <div className="form-group">
              <label><Truck size={13} /> Vehicle / Vessel Identification</label>
              <input
                type="text"
                value={newShipment.vessel}
                onChange={(e) => setNewShipment({ ...newShipment, vessel: e.target.value })}
                placeholder="e.g. WP-CAB-8492 (Container Carrier)"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label><Calendar size={13} /> Estimated Arrival (ETA)</label>
              <input
                type="date"
                value={newShipment.eta}
                onChange={(e) => setNewShipment({ ...newShipment, eta: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label><DollarSign size={13} /> Declared Value ($)</label>
              <input
                type="number"
                value={newShipment.value}
                onChange={(e) => setNewShipment({ ...newShipment, value: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label><Scale size={13} /> Cargo Weight</label>
              <input
                type="text"
                value={newShipment.weight}
                onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
                placeholder="e.g. 16,500 kg"
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={15} /> Dispatch Shipment
            </button>
          </div>
        </form>
      </Modal>
    )}

    {/* Toast notification */}
    {toastMessage && (
      <div className="toast">
        <CheckCircle2 size={16} />
        <div>
          <strong>Shipment Created</strong>
          <span>{toastMessage}</span>
        </div>
      </div>
    )}
  </>;
}
