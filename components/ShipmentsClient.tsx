'use client';

import { useEffect, useMemo, useState } from 'react';
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
  PackageCheck,
  Scale,
  Calendar,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Gauge,
  ArrowRight,
  Anchor,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import { CustomSelect } from './CustomSelect';
import type { Shipment, ShipmentStatus } from '@/types';
import { createShipment, getAllShipments } from '@/app/services/apiService';

const statuses = ['All', 'In Transit', 'Delayed', 'Delivered', 'Pending'];

const flags: Record<string, string> = {
  CN: '🇨🇳',
  NL: '🇳🇱',
  SG: '🇸🇬',
  US: '🇺🇸',
  DE: '🇩🇪',
  AE: '🇦🇪',
  LK: '🇱🇰',
  AU: '🇦🇺',
  KR: '🇰🇷',
  CA: '🇨🇦',
  JP: '🇯🇵',
  BE: '🇧🇪',
  IN: '🇮🇳',
  UK: '🇬🇧',
  GB: '🇬🇧',
};

function getFlag(place: string) {
  const parts = place.split(',');
  if (parts.length > 1) {
    const code = parts[1].trim();
    return flags[code] || '🌐';
  }
  const low = place.toLowerCase();
  if (low.includes('sri lanka') || low.includes('colombo') || low.includes('kandy') || low.includes('galle') || low.includes('anuradhapura')) {
    return '🇱🇰';
  }
  return '🌐';
}

function getCarrierClass(carrier: string) {
  const c = carrier.toLowerCase().replace(/[^a-z0-9]/g, '-');
  if (c.includes('maersk')) return 'maersk';
  if (c.includes('msc')) return 'msc';
  if (c.includes('cma')) return 'cma-cgm';
  if (c.includes('evergreen')) return 'evergreen';
  if (c.includes('hapag')) return 'hapag-lloyd';
  if (c.includes('one')) return 'one';
  if (c.includes('cosco')) return 'cosco';
  return 'default';
}

function getEtaBadge(etaString: string, status: string) {
  if (status === 'Delivered') return { text: 'Delivered', color: 'positive-text' };
  const target = new Date(etaString).getTime();
  const diffDays = Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'danger-text' };
  if (diffDays === 0) return { text: 'Arriving today', color: 'positive-text' };
  if (diffDays === 1) return { text: 'Tomorrow', color: 'positive-text' };
  return { text: `In ${diffDays} days`, color: '' };
}

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

  useEffect(() => {
    const loadData = async () => {
      try {

        const data = await getAllShipments();

        if (data && DataTransfer.length > 0) {
          setShipmentsList(data);
        }

      } catch (error) {
        console.error("Failed to fetch shipments from backend:", error);
      }
    };
    loadData();
  }, []);


  const [newShipment, setNewShipment] = useState({
    id: `SHP-${Math.floor(78400 + Math.random() * 900)}`,
    origin: 'Colombo, LK',
    destination: 'Rotterdam, NL',
    status: 'In Transit' as ShipmentStatus,
    eta: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    carrier: 'Maersk',
    vessel: 'Maersk Colombo Express',
    value: 195000,
    weight: '16.5 t',
    progress: 25,
  });

  const origins = ['All origins', ...Array.from(new Set(shipmentsList.map((s) => s.origin)))];
  const destinations = ['All destinations', ...Array.from(new Set(shipmentsList.map((s) => s.destination)))];

  const filtered = useMemo(() => shipmentsList.filter((s) => {
    const q = query.toLowerCase();
    const matchQuery = !q || `${s.id} ${s.origin} ${s.destination} ${s.carrier} ${s.vessel}`.toLowerCase().includes(q);
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

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const payload = {
        trackingNumber: newShipment.id,
        origin: newShipment.origin,
        destination: newShipment.destination,
        status: newShipment.status.toUpperCase(),
        expectedDeliveryDate: newShipment.eta + "T00:00:00",

        vendor: { id: 1 }
      };

      const createdShipment: any = await createShipment(payload);

      if (createdShipment) {

        setShipmentsList([createdShipment, ...shipmentsList]);

        setIsCreateOpen(false);
        showToast(`Shipment ${createdShipment.trackingNumber} created and dispatched successfully!`)

        setNewShipment({
          ...newShipment,
          id: `SHP-${Math.floor(78400 + Math.random() * 900)}`
        });
      }

    } catch (error) {

      console.error(error);
      alert("Failed to dispatch shipment. Please check the backend connection.");
    }

  };

  return <>
    <PageHeader
      eyebrow="Global Freight Operations"
      title="Shipments & Freight Lanes"
      description="Real-time multi-modal logistics tracking, port clearance status, carrier performance, and lane timelines."
      action={
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={16} /> Create shipment
        </button>
      }
    />

    <section className="kpi-grid">
      <article className="kpi-card glass-panel">
        <div className="kpi-top">
          <span className="kpi-icon kpi-0"><Ship size={20} /></span>
          <span className="trend positive"><ArrowUpRight size={13} /> Active</span>
        </div>
        <div className="kpi-bottom">
          <div>
            <p>Active In-Transit</p>
            <strong>{shipmentsList.filter(s => s.status === 'In Transit').length}</strong>
            <small className="positive-text">+3 departures today</small>
          </div>
        </div>
      </article>

      <article className="kpi-card glass-panel">
        <div className="kpi-top">
          <span className="kpi-icon kpi-3"><AlertTriangle size={20} /></span>
          <span className="trend negative"><ArrowDownRight size={13} /> Attention</span>
        </div>
        <div className="kpi-bottom">
          <div>
            <p>Delayed / Holds</p>
            <strong>{shipmentsList.filter(s => s.status === 'Delayed').length}</strong>
            <small className="danger-text">Port congestion alerts</small>
          </div>
        </div>
      </article>

      <article className="kpi-card glass-panel">
        <div className="kpi-top">
          <span className="kpi-icon kpi-1"><PackageCheck size={20} /></span>
          <span className="trend positive"><CheckCircle2 size={13} /> On Schedule</span>
        </div>
        <div className="kpi-bottom">
          <div>
            <p>Delivered Completed</p>
            <strong>{shipmentsList.filter(s => s.status === 'Delivered').length}</strong>
            <small>100% customs cleared</small>
          </div>
        </div>
      </article>

      <article className="kpi-card glass-panel">
        <div className="kpi-top">
          <span className="kpi-icon kpi-2"><Gauge size={20} /></span>
          <span className="trend positive"><ArrowUpRight size={13} /> +1.6% SLA</span>
        </div>
        <div className="kpi-bottom">
          <div>
            <p>Fleet On-Time Rate</p>
            <strong>95.2%</strong>
            <small className="positive-text">Top tier benchmark</small>
          </div>
        </div>
      </article>
    </section>

    <section className="panel glass-panel data-panel">
      <div className="table-toolbar">
        <div className="toolbar-search">
          <Search size={16} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shipment ID, route, vessel or carrier..." />
        </div>
        <CustomSelect
          options={statuses.map((s) => ({ value: s, label: s === 'All' ? 'All Statuses' : s }))}
          value={status}
          onChange={(val) => setStatus(val)}
          icon={<Filter size={14} />}
          ariaLabel="Filter by status"
        />
        <CustomSelect
          options={origins}
          value={origin}
          onChange={(val) => setOrigin(val)}
          icon={<MapPin size={14} />}
          ariaLabel="Filter by origin"
        />
        <CustomSelect
          options={destinations}
          value={destination}
          onChange={(val) => setDestination(val)}
          icon={<MapPin size={14} />}
          ariaLabel="Filter by destination"
        />
        <div className="date-filter">
          <CalendarDays size={15} />
          <input aria-label="ETA from date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span className="date-sep">→</span>
          <input aria-label="ETA to date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        {(query || status !== 'All' || origin !== 'All origins' || destination !== 'All destinations' || fromDate || toDate) && (
          <button
            className="ghost-btn"
            onClick={() => {
              setQuery('');
              setStatus('All');
              setOrigin('All origins');
              setDestination('All destinations');
              setFromDate('');
              setToDate('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="result-summary">
        <span>
          Showing <strong>{filtered.length}</strong> of <strong>{shipmentsList.length}</strong> tracked shipments
        </span>
        <button><SlidersHorizontal size={13} /> Customize Columns</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Shipment & Vessel</th>
              <th>Freight Corridor</th>
              <th>Status</th>
              <th>Carrier</th>
              <th>ETA & Timeline</th>
              <th>Cargo Value</th>
              <th>Transit Progress</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const etaInfo = getEtaBadge(s.eta, s.status);
              return (
                <tr key={s.id} className="clickable-row" onClick={() => setSelected(s)}>
                  <td>
                    <div className="shipment-id-wrap">
                      <span className="shipment-id-badge">
                        <Anchor size={12} className="text-cyan" /> {s.id}
                      </span>
                      <span className="shipment-vessel-tag">
                        <Ship size={11} /> {s.vessel}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="route-lane-cell">
                      <span className="route-node">
                        <span className="route-flag">{getFlag(s.origin)}</span>
                        {s.origin}
                      </span>
                      <ArrowRight size={13} className="route-arrow-icon" />
                      <span className="route-node">
                        <span className="route-flag">{getFlag(s.destination)}</span>
                        {s.destination}
                      </span>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td>
                    <span className={`carrier-pill ${getCarrierClass(s.carrier)}`}>
                      <Building size={11} /> {s.carrier}
                    </span>
                  </td>
                  <td>
                    <div className="eta-cell">
                      <span className="eta-date">
                        {new Date(s.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`eta-relative ${etaInfo.color}`}>
                        {etaInfo.text}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="cargo-value-wrap">
                      <span className="cargo-value-amount">${s.value.toLocaleString()}</span>
                      <span className="cargo-weight-pill"><Scale size={10} style={{ display: 'inline', marginRight: 3 }} />{s.weight}</span>
                    </div>
                  </td>
                  <td>
                    <div className="progress-cell">
                      <span className="progress-bar">
                        <i style={{ width: `${s.progress}%` }} />
                      </span>
                      <span className="progress-text">{s.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className="view-action-btn">
                      Inspect <ChevronRight size={13} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <EmptyState title="No matching shipments found" description="Try adjusting your search criteria or clear the active filters." />}
      </div>
    </section>

    {/* Detail Modal */}
    {selected && <Modal title={`Shipment ${selected.id}`} subtitle={`${selected.origin} → ${selected.destination}`} onClose={() => setSelected(null)}>
      <div className="detail-hero">
        <span className="detail-icon"><Ship size={26} /></span>
        <div>
          <StatusBadge status={selected.status} />
          <h3>{selected.carrier}</h3>
          <p>{selected.vessel}</p>
        </div>
        <div className="detail-value">
          <span>Total Declared Value</span>
          <strong>${selected.value.toLocaleString()}</strong>
        </div>
      </div>
      <div className="detail-grid">
        <div><span><CalendarDays size={14} /> Estimated Arrival (ETA)</span><strong>{new Date(selected.eta).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
        <div><span><Scale size={14} /> Gross Cargo Weight</span><strong>{selected.weight}</strong></div>
        <div><span><MapPin size={14} /> Origin Port</span><strong>{getFlag(selected.origin)} {selected.origin}</strong></div>
        <div><span><MapPin size={14} /> Destination Port / Depot</span><strong>{getFlag(selected.destination)} {selected.destination}</strong></div>
      </div>
      <div className="shipment-progress">
        <div className="progress-label"><span>Transit Fulfillment Status</span><strong>{selected.progress}% completed</strong></div>
        <div className="progress-track"><i style={{ width: `${selected.progress}%` }} /></div>
        <div className="route-points">
          <span className="done"><i /> Origin Dispatched</span>
          <span className={selected.progress >= 50 ? 'done' : ''}><i /> Port & Customs Cleared</span>
          <span className={selected.progress >= 95 ? 'done' : ''}><i /> Destination Arrival</span>
        </div>
      </div>
    </Modal>}


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
              <CustomSelect
                options={[
                  { value: 'In Transit', label: 'In Transit (Active)' },
                  { value: 'Pending', label: 'Pending Dispatch' },
                  { value: 'Delayed', label: 'Delayed / Port Hold' },
                  { value: 'Delivered', label: 'Delivered' }
                ]}
                value={newShipment.status}
                onChange={(val) => setNewShipment({ ...newShipment, status: val as ShipmentStatus })}
              />
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
