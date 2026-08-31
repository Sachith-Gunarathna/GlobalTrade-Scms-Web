'use client';

import { useEffect, useMemo, useState } from 'react';
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
  Award,
  Trash2,
  Gauge
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import { CustomSelect } from './CustomSelect';
import type { Supplier } from '@/types';
import { createVendor, deleteVendor, getAllVendors, updateVendorScore } from '@/app/services/apiService';
import { canAccess } from '@/app/services/roleAccess';
import { useCurrentUser } from '@/context/AuthContext';

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
  const user = useCurrentUser();
  const canCreate = canAccess(user?.role, 'suppliers.create');
  const canScore = canAccess(user?.role, 'suppliers.score');
  const canDelete = canAccess(user?.role, 'suppliers.delete');
  const [scoreTarget, setScoreTarget] = useState<Supplier | null>(null);
  const [scoreValue, setScoreValue] = useState(90);
  const [busySupplierId, setBusySupplierId] = useState<number | null>(null);

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

  useEffect(() => {
    let active = true;
    getAllVendors()
      .then((data) => { if (active) setSuppliersList(data); })
      .catch((error) => { if (active) showToast(error instanceof Error ? error.message : 'Unable to load suppliers.'); });
    return () => { active = false; };
  }, []);

  const regions: string[] = ['All regions', ...Array.from(new Set(suppliersList.map((s) => s.region)))];

  const filtered = useMemo(() => suppliersList.filter((s) => {
    const q = query.toLowerCase();
    return (region === 'All regions' || s.region === region) && (!q || `${s.name} ${s.country} ${s.category}`.toLowerCase().includes(q));
  }), [suppliersList, query, region]);

  const avgRating = (suppliersList.length ? suppliersList.reduce((sum, s) => sum + s.rating, 0) / suppliersList.length : 0).toFixed(1);
  const totalActiveOrders = suppliersList.reduce((sum, s) => sum + s.activeOrders, 0);
  const avgOnTime = (suppliersList.length ? suppliersList.reduce((sum, s) => sum + s.onTimeRate, 0) / suppliersList.length : 0).toFixed(1);
  const countryCount = new Set(suppliersList.map((supplier) => supplier.country).filter(Boolean)).size;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createVendor({
        code: newSupplier.id.trim(),
        name: newSupplier.name.trim(),
        country: newSupplier.country,
        region: newSupplier.region.trim(),
        category: newSupplier.category,
        rating: Number(newSupplier.rating),
        activeOrders: Number(newSupplier.activeOrders),
        email: newSupplier.email.trim(),
        phone: newSupplier.phone.trim(),
        onTimeRate: Number(newSupplier.onTimeRate)
      });
      setSuppliersList((current) => [created, ...current]);
      setIsAddOpen(false);
      showToast(`Supplier ${created.name} onboarded to the partner network.`);
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
        onTimeRate: 98.2
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add supplier.');
    }
  };


  const openScore = (supplier: Supplier) => {
    setScoreTarget(supplier);
    setScoreValue(Math.round(supplier.performanceScore ?? supplier.rating * 20));
  };

  const saveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scoreTarget?.databaseId || !canScore) return;
    setBusySupplierId(scoreTarget.databaseId);
    try {
      const updated = await updateVendorScore(scoreTarget.databaseId, scoreValue);
      setSuppliersList((current) => current.map((supplier) => supplier.databaseId === updated.databaseId ? updated : supplier));
      setScoreTarget(null);
      showToast(`Performance score updated for ${updated.name}.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update supplier score.');
    } finally {
      setBusySupplierId(null);
    }
  };

  const removeSupplier = async (supplier: Supplier) => {
    if (!supplier.databaseId || !canDelete) return;
    if (!window.confirm(`Delete ${supplier.name}? This is only allowed when no active logistics records depend on the supplier.`)) return;
    setBusySupplierId(supplier.databaseId);
    try {
      await deleteVendor(supplier.databaseId);
      setSuppliersList((current) => current.filter((item) => item.databaseId !== supplier.databaseId));
      showToast(`${supplier.name} removed from the supplier network.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to delete supplier.');
    } finally {
      setBusySupplierId(null);
    }
  };


  return <>
    <PageHeader
      eyebrow="Partner network"
      title="Suppliers"
      description="Evaluate supplier performance, contacts, active orders, and sourcing coverage."
      action={canCreate ? (
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={17} /> Add supplier
        </button>
      ) : undefined}
    />

    <div className="stat-strip glass-panel">
      <div><span>Active suppliers</span><strong>{suppliersList.length}</strong><small>Across {countryCount} countries</small></div>
      <div><span>Avg. rating</span><strong>{avgRating}</strong><small>Current supplier average</small></div>
      <div><span>Open supplier orders</span><strong>{totalActiveOrders}</strong><small>Reported active orders</small></div>
      <div><span>On-time average</span><strong>{avgOnTime}%</strong><small>Current SLA average</small></div>
    </div>

    <section className="supplier-tools">
      <div className="toolbar-search">
        <Search size={16}/>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search suppliers..."/>
      </div>
      <CustomSelect
        options={regions}
        value={region}
        onChange={(val) => setRegion(val)}
        icon={<MapPinned size={14} />}
        ariaLabel="Filter by region"
      />
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
                <Star size={14} fill="currentColor"/>
                <strong>{s.rating.toFixed(1)}</strong>
                <span>Rating</span>
              </div>
            </div>
            <div className="supplier-stats">
              <div>
                <span>Active orders</span>
                <strong>{s.activeOrders}</strong>
              </div>
              <div>
                <span>On-time rate</span>
                <strong>{s.onTimeRate}%</strong>
              </div>
            </div>
            <div className="supplier-footer">
              <a href={`mailto:${s.email}`} className="icon-link"><Mail size={12}/>{s.email}</a>
              <a href={`tel:${s.phone}`} className="icon-link"><Phone size={12}/>{s.phone}</a>
            </div>
            {(canScore || canDelete) && (
              <div className="supplier-footer" style={{ marginTop: 10, justifyContent: 'flex-end', gap: 8 }}>
                {canScore && <button type="button" className="secondary-btn" disabled={busySupplierId === s.databaseId} onClick={() => openScore(s)}><Gauge size={14}/> Performance score</button>}
                {canDelete && <button type="button" className="ghost-btn danger-text" disabled={busySupplierId === s.databaseId} onClick={() => void removeSupplier(s)}><Trash2 size={14}/> Delete</button>}
              </div>
            )}
          </article>
        ))}
      </section>
    ) : <EmptyState title="No suppliers match filter"/>}

    
    {scoreTarget && canScore && (
      <Modal title="Supplier Performance Score" subtitle={scoreTarget.name} onClose={() => setScoreTarget(null)}>
        <form onSubmit={saveScore} className="modal-form-wrap">
          <div className="form-group">
            <label><Gauge size={13} /> Performance Score (0 - 100)</label>
            <input type="number" min="0" max="100" step="0.1" value={scoreValue} onChange={(e) => setScoreValue(Number(e.target.value))} required />
          </div>
          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => setScoreTarget(null)}>Cancel</button>
            <button type="submit" className="primary-btn" disabled={busySupplierId === scoreTarget.databaseId}>Save Score</button>
          </div>
        </form>
      </Modal>
    )}

    {isAddOpen && (
      <Modal
        title="Add New Vendor / Supplier"
        subtitle="Register a verified logistics vendor, raw material producer, or global distributor"
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
              <CustomSelect
                options={[
                  'Industrial Manufacturing',
                  'Raw Materials',
                  'Electronics & Sensors',
                  'Packaging & Logistics',
                  'Agricultural Products',
                  'Textiles & Fabrics'
                ]}
                value={newSupplier.category}
                onChange={(val) => setNewSupplier({ ...newSupplier, category: val })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Globe2 size={13} /> Country of Origin</label>
              <CustomSelect
                options={[
                  { value: 'Sri Lanka', label: '🇱🇰 Sri Lanka (Domestic Sourcing)' },
                  { value: 'China', label: '🇨🇳 China' },
                  { value: 'Germany', label: '🇩🇪 Germany' },
                  { value: 'Japan', label: '🇯🇵 Japan' },
                  { value: 'India', label: '🇮🇳 India' },
                  { value: 'Singapore', label: '🇸🇬 Singapore' },
                  { value: 'UAE', label: '🇦🇪 UAE' },
                  { value: 'UK', label: '🇬🇧 United Kingdom' },
                  { value: 'Canada', label: '🇨🇦 Canada' }
                ]}
                value={newSupplier.country}
                onChange={(c) => {
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
              />
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
