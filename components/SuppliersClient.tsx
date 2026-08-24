'use client';

import { useMemo, useState } from 'react';
import {
  Mail,
  MapPinned,
  Phone,
  Plus,
  Search,
  Star,
  TrendingUp,
  UsersRound,
  CheckCircle2,
  Building,
  Globe2,
  Tag,
  Award
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import type { Supplier } from '@/types';

const flags: Record<string, string> = {
  'Sri Lanka': '🇱🇰',
  China: '🇨🇳',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
  UAE: '🇦🇪',
  Canada: '🇨🇦',
  Singapore: '🇸🇬',
  India: '🇮🇳',
  UK: '🇬🇧',
};

export function SuppliersClient({
  suppliers: initialSuppliers,
  initialQuery = ''
}: {
  suppliers: Supplier[];
  initialQuery?: string;
}) {
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(initialSuppliers);
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState('All regions');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Supplier Form State
  const [newSupplier, setNewSupplier] = useState({
    id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
    name: 'Lanka Industrial Fabrications PLC',
    country: 'Sri Lanka',
    region: 'South Asia',
    category: 'Industrial Manufacturing',
    rating: 4.8,
    activeOrders: 4,
    email: 'supply@lankafabrications.lk',
    phone: '+94 11 289 4020',
    onTimeRate: 95.8,
  });

  const regions = ['All regions', ...Array.from(new Set(suppliersList.map((s) => s.region)))];

  const filtered = useMemo(() => suppliersList.filter((s) => {
    const q = query.toLowerCase();
    return (region === 'All regions' || s.region === region) && (!q || `${s.name} ${s.country} ${s.category}`.toLowerCase().includes(q));
  }), [suppliersList, query, region]);

  const avgRating = (suppliersList.reduce((sum, s) => sum + s.rating, 0) / suppliersList.length).toFixed(1);
  const totalActiveOrders = suppliersList.reduce((sum, s) => sum + s.activeOrders, 0);
  const avgOnTime = (suppliersList.reduce((sum, s) => sum + s.onTimeRate, 0) / suppliersList.length).toFixed(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Supplier = {
      ...newSupplier,
      rating: Number(newSupplier.rating),
      activeOrders: Number(newSupplier.activeOrders),
      onTimeRate: Number(newSupplier.onTimeRate),
    };

    setSuppliersList([created, ...suppliersList]);
    setIsAddOpen(false);
    showToast(`Supplier ${created.name} onboarded to partner network!`);

    // Reset with new ID
    setNewSupplier({
      id: `SUP-${Math.floor(100 + Math.random() * 900)}`,
      name: 'Tokyo Precision Robotics Ltd',
      country: 'Japan',
      region: 'East Asia',
      category: 'Electronics & Sensors',
      rating: 4.9,
      activeOrders: 2,
      email: 'export@tokyorobotics.jp',
      phone: '+81 3 5555 0192',
      onTimeRate: 98.2,
    });
  };

  return <>
    <PageHeader
      eyebrow="Partner network"
      title="Suppliers"
      description="Evaluate supplier performance, contacts, active orders, and sourcing coverage."
      action={
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={17} /> Add supplier
        </button>
      }
    />

    <div className="stat-strip glass-panel">
      <div><span>Active suppliers</span><strong>{suppliersList.length}</strong><small>Across 28 countries</small></div>
      <div><span>Avg. rating</span><strong>{avgRating}</strong><small className="positive-text">Top tier partner network</small></div>
      <div><span>Open supplier orders</span><strong>{totalActiveOrders}</strong><small>$892K committed</small></div>
      <div><span>On-time average</span><strong>{avgOnTime}%</strong><small className="positive-text">+2.1%</small></div>
    </div>

    <section className="supplier-tools">
      <div className="toolbar-search">
        <Search size={16}/>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers..."/>
      </div>
      <div className="select-wrap">
        <MapPinned size={15}/>
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
    </section>

    {filtered.length ? (
      <section className="supplier-grid">
        {filtered.map((s) => (
          <article className="supplier-card glass-panel" key={s.id}>
            <div className="supplier-card-top">
              <div className="supplier-logo">
                {s.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </div>
              <span className="region-chip">
                {flags[s.country] ?? '🌐'} {s.country}
              </span>
            </div>
            <div className="supplier-main">
              <span className="section-label">{s.category}</span>
              <h2>{s.name}</h2>
              <div className="rating">
                <Star size={15} fill="currentColor"/>
                <strong>{s.rating.toFixed(1)}</strong>
                <span>verified partner</span>
              </div>
            </div>
            <div className="supplier-metrics">
              <div>
                <span>Active orders</span>
                <strong>{s.activeOrders}</strong>
              </div>
              <div>
                <span>On-time rate</span>
                <strong>{s.onTimeRate}%</strong>
              </div>
              <div>
                <span>Region</span>
                <strong>{s.region}</strong>
              </div>
            </div>
            <div className="performance-bar">
              <span><i style={{ width: `${s.onTimeRate}%` }}/></span>
              <small><TrendingUp size={13}/> Delivery reliability</small>
            </div>
            <div className="supplier-contact">
              <a href={`mailto:${s.email}`}><Mail size={14}/>{s.email}</a>
              <a href={`tel:${s.phone}`}><Phone size={14}/>{s.phone}</a>
            </div>
          </article>
        ))}
      </section>
    ) : (
      <div className="panel glass-panel">
        <EmptyState title="No suppliers found"/>
      </div>
    )}

    {/* Add Supplier Modal Form */}
    {isAddOpen && (
      <Modal
        title="Onboard New Supplier Partner"
        subtitle="Register vendor profile, country of origin, procurement category, and contact information"
        onClose={() => setIsAddOpen(false)}
      >
        <form onSubmit={handleAddSupplier} className="modal-form-wrap">
          <div className="form-grid-2">
            <div className="form-group">
              <label><Building size={13} /> Supplier / Enterprise Name</label>
              <input
                type="text"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                placeholder="e.g. Lanka Precision Castings PLC"
                required
              />
            </div>
            <div className="form-group">
              <label><Tag size={13} /> Sourcing Category</label>
              <select
                value={newSupplier.category}
                onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
              >
                <option value="Industrial Manufacturing">Industrial Manufacturing</option>
                <option value="Raw Materials">Raw Materials & Minerals</option>
                <option value="Electronics & Sensors">Electronics & Microchips</option>
                <option value="Packaging & Logistics">Packaging & Logistics Crate</option>
                <option value="Agricultural Products">Agricultural & Agro-Goods</option>
                <option value="Textiles & Fabrics">Textiles & Garment Sourcing</option>
              </select>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Globe2 size={13} /> Country of Origin</label>
              <select
                value={newSupplier.country}
                onChange={(e) => {
                  const c = e.target.value;
                  const reg =
                    c === 'Sri Lanka' || c === 'India'
                      ? 'South Asia'
                      : c === 'China' || c === 'Japan'
                      ? 'East Asia'
                      : c === 'Germany' || c === 'UK'
                      ? 'Europe'
                      : c === 'UAE'
                      ? 'Middle East'
                      : 'North America';
                  setNewSupplier({ ...newSupplier, country: c, region: reg });
                }}
              >
                <option value="Sri Lanka">🇱🇰 Sri Lanka (Domestic Sourcing)</option>
                <option value="China">🇨🇳 China</option>
                <option value="Germany">🇩🇪 Germany</option>
                <option value="Japan">🇯🇵 Japan</option>
                <option value="India">🇮🇳 India</option>
                <option value="Singapore">🇸🇬 Singapore</option>
                <option value="UAE">🇦🇪 UAE</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="Canada">🇨🇦 Canada</option>
              </select>
            </div>

            <div className="form-group">
              <label><MapPinned size={13} /> Geographic Trade Region</label>
              <input
                type="text"
                value={newSupplier.region}
                onChange={(e) => setNewSupplier({ ...newSupplier, region: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Mail size={13} /> Business Email</label>
              <input
                type="email"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                placeholder="e.g. procurement@vendor.lk"
                required
              />
            </div>
            <div className="form-group">
              <label><Phone size={13} /> Contact Telephone</label>
              <input
                type="tel"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                placeholder="e.g. +94 11 234 5678"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label><Star size={13} /> Initial Rating (1 - 5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={newSupplier.rating}
                onChange={(e) => setNewSupplier({ ...newSupplier, rating: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Initial Active Orders</label>
              <input
                type="number"
                min="0"
                value={newSupplier.activeOrders}
                onChange={(e) => setNewSupplier({ ...newSupplier, activeOrders: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label><Award size={13} /> On-Time SLA Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={newSupplier.onTimeRate}
                onChange={(e) => setNewSupplier({ ...newSupplier, onTimeRate: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => setIsAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={15} /> Onboard Supplier
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
          <strong>Supplier Onboarded</strong>
          <span>{toastMessage}</span>
        </div>
      </div>
    )}
  </>;
}
