'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarClock,
  ChevronRight,
  CircleDollarSign,
  PackageOpen,
  Plus,
  Search,
  ShoppingBag,
  UserRound,
  CheckCircle2,
  Building,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import { CustomSelect } from './CustomSelect';
import type { Order, OrderStatus, Supplier } from '@/types';
import { createOrder, getAllOrders, getAllVendors } from '@/app/services/apiService';

const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function OrdersClient({
  orders: initialOrders,
  initialQuery = ''
}: {
  orders: Order[];
  initialQuery?: string;
}) {
  const [ordersList, setOrdersList] = useState<Order[]>(initialOrders);
  const [status, setStatus] = useState('All');
  const [query, setQuery] = useState(initialQuery);
  const [selected, setSelected] = useState<Order | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Supplier[]>([]);

  const [newOrder, setNewOrder] = useState({
    id: `ORD-${Math.floor(9280 + Math.random() * 800)}`,
    customer: 'Ceylon Export Holdings PLC',
    items: 8,
    total: 38400,
    status: 'Processing' as OrderStatus,
    date: new Date().toISOString().split('T')[0],
    region: 'Western Province',
    contact: 'procurement@ceylonexports.lk',
    vendorId: 0,
  });

  useEffect(() => {
    let active = true;
    Promise.all([getAllOrders(), getAllVendors()])
      .then(([orderData, vendorData]) => {
        if (!active) return;
        setOrdersList(orderData);
        setVendors(vendorData);
      })
      .catch((error) => {
        if (active) showToast(error instanceof Error ? error.message : 'Unable to load orders.');
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => ordersList.filter((o) => {
    const q = query.toLowerCase();
    return (status === 'All' || o.status === status) && (!q || `${o.id} ${o.customer} ${o.region}`.toLowerCase().includes(q));
  }), [ordersList, status, query]);

  const total = filtered.reduce((sum, o) => sum + o.total, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createOrder({
        orderNumber: newOrder.id.trim(),
        customer: newOrder.customer.trim(),
        itemCount: Number(newOrder.items),
        totalAmount: Number(newOrder.total),
        status: newOrder.status,
        orderDate: newOrder.date,
        region: newOrder.region,
        contact: newOrder.contact.trim(),
        vendorId: newOrder.vendorId || undefined
      });
      setOrdersList((current) => [created, ...current]);
      setIsAddOpen(false);
      showToast(`Order ${created.id} for ${created.customer} added successfully.`);
      setNewOrder({
        id: `ORD-${Math.floor(9280 + Math.random() * 800)}`,
        customer: 'Lanka Industrial Distribution Ltd',
        items: 12,
        total: 54000,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        region: 'Central Province',
        contact: 'orders@lankaindustrial.lk',
        vendorId: newOrder.vendorId
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create order.');
    }
  };


  return <>
    <PageHeader
      eyebrow="Commercial operations"
      title="Orders"
      description="Manage customer orders from intake through fulfillment and delivery."
      action={
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={17} /> Add order
        </button>
      }
    />

    <div className="stat-strip glass-panel">
      <div><span>Open orders</span><strong>{ordersList.filter(o => o.status === 'Processing' || o.status === 'Pending').length}</strong><small>12 processing now</small></div>
      <div><span>Total Order value</span><strong>${(ordersList.reduce((s, o) => s + o.total, 0) / 1000000).toFixed(2)}M</strong><small className="positive-text">+9.2% MoM</small></div>
      <div><span>Avg. order value</span><strong>${Math.round(ordersList.length ? ordersList.reduce((s, o) => s + o.total, 0) / ordersList.length : 0).toLocaleString()}</strong><small>Last 30 days</small></div>
      <div><span>Fulfillment</span><strong>96.4%</strong><small className="positive-text">Above target</small></div>
    </div>

    <section className="panel glass-panel data-panel">
      <div className="table-toolbar">
        <div className="toolbar-search">
          <Search size={16}/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search orders or customers..." />
        </div>
        <div className="status-tabs">
          {statuses.map((s) => (
            <button
              className={status === s ? 'active' : ''}
              onClick={() => setStatus(s)}
              key={s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="result-summary">
        <span>{filtered.length} orders · <strong>${total.toLocaleString()}</strong> visible value</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total value</th>
              <th>Status</th>
              <th>Date</th>
              <th>Region</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr className="clickable-row" key={o.id} onClick={() => setSelected(o)}>
                <td><strong className="mono">{o.id}</strong></td>
                <td>
                  <span className="customer-cell">
                    <span className="tiny-avatar">{o.customer.slice(0,2).toUpperCase()}</span>
                    {o.customer}
                  </span>
                </td>
                <td>{o.items} items</td>
                <td className="value-cell">${o.total.toLocaleString()}</td>
                <td><StatusBadge status={o.status}/></td>
                <td>{new Date(o.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td><span className="region-chip">{o.region}</span></td>
                <td><ChevronRight size={16} className="row-arrow"/></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <EmptyState title="No orders found"/>}
      </div>
    </section>

    
    {selected && <Modal title={selected.id} subtitle="Order details" onClose={() => setSelected(null)}>
      <div className="detail-hero">
        <span className="detail-icon"><ShoppingBag size={26}/></span>
        <div><StatusBadge status={selected.status}/><h3>{selected.customer}</h3><p>{selected.region} customer account</p></div>
        <div className="detail-value"><span>Order total</span><strong>${selected.total.toLocaleString()}</strong></div>
      </div>
      <div className="detail-grid">
        <div><span><PackageOpen size={14}/> Items</span><strong>{selected.items} line items</strong></div>
        <div><span><CalendarClock size={14}/> Order date</span><strong>{new Date(selected.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></div>
        <div><span><UserRound size={14}/> Contact</span><strong>{selected.contact}</strong></div>
        <div><span><CircleDollarSign size={14}/> Value</span><strong>${selected.total.toLocaleString()}</strong></div>
      </div>
      <div className="info-callout">
        <strong>Fulfillment note</strong>
        <p>Order is assigned to priority domestic dispatch route through Colombo Logistics Center.</p>
      </div>
    </Modal>}

    
    {isAddOpen && (
      <Modal
        title="Create New Customer Order"
        subtitle="Register customer commercial intake and schedule fulfillment"
        onClose={() => setIsAddOpen(false)}
      >
        <form onSubmit={handleCreateOrder} className="modal-form-wrap">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Order Reference ID</label>
              <input
                type="text"
                value={newOrder.id}
                onChange={(e) => setNewOrder({ ...newOrder, id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Fulfillment Status</label>
              <CustomSelect
                options={[
                  { value: 'Processing', label: 'Processing' },
                  { value: 'Pending', label: 'Pending Intake' },
                  { value: 'Shipped', label: 'Shipped' },
                  { value: 'Delivered', label: 'Delivered' },
                  { value: 'Cancelled', label: 'Cancelled' }
                ]}
                value={newOrder.status}
                onChange={(val) => setNewOrder({ ...newOrder, status: val as OrderStatus })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><Building size={13} /> Customer / Enterprise Name</label>
              <input
                type="text"
                value={newOrder.customer}
                onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                placeholder="e.g. Dilmah Tea Logistics PLC"
                required
              />
            </div>
            <div className="form-group">
              <label><Mail size={13} /> Customer Contact Email / Phone</label>
              <input
                type="text"
                value={newOrder.contact}
                onChange={(e) => setNewOrder({ ...newOrder, contact: e.target.value })}
                placeholder="e.g. orders@dilmahtea.lk"
                required
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label><MapPin size={13} /> Destination Region</label>
              <CustomSelect
                options={[
                  'Western Province (Colombo)',
                  'Central Province (Kandy)',
                  'Southern Province (Galle / Hambantota)',
                  'North Central (Anuradhapura)',
                  'Northern Province (Jaffna)',
                  'Eastern Province (Trincomalee)',
                  'North Western (Kurunegala)',
                  'Uva Province (Badulla)',
                  'Sabaragamuwa (Ratnapura)'
                ]}
                value={newOrder.region}
                onChange={(val) => setNewOrder({ ...newOrder, region: val })}
              />
            </div>

            <div className="form-group">
              <label><PackageOpen size={13} /> Line Items Count</label>
              <input
                type="number"
                min="1"
                value={newOrder.items}
                onChange={(e) => setNewOrder({ ...newOrder, items: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label><CircleDollarSign size={13} /> Total Valuation ($)</label>
              <input
                type="number"
                min="1"
                value={newOrder.total}
                onChange={(e) => setNewOrder({ ...newOrder, total: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><Calendar size={13} /> Order Intake Date</label>
            <input
              type="date"
              value={newOrder.date}
              onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Supplier Assignment</label>
            <CustomSelect
              options={[{ value: '0', label: 'No supplier assigned' }, ...vendors.map((vendor) => ({ value: String(vendor.databaseId ?? 0), label: `${vendor.id} — ${vendor.name}` }))]}
              value={String(newOrder.vendorId)}
              onChange={(value) => setNewOrder({ ...newOrder, vendorId: Number(value) })}
              searchable
            />
          </div>

          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => setIsAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={15} /> Confirm Order Intake
            </button>
          </div>
        </form>
      </Modal>
    )}

    
    {toastMessage && (
      <div className="toast">
        <CheckCircle2 size={16} />
        <div>
          <strong>Order Added</strong>
          <span>{toastMessage}</span>
        </div>
      </div>
    )}
  </>;
}
