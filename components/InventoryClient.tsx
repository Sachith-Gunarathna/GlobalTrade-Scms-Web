'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  PackagePlus,
  Search,
  Warehouse,
  Plus,
  CheckCircle2,
  Tag,
  DollarSign,
  Layers,
  Sliders
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { EmptyState } from './EmptyState';
import { Modal } from './Modal';
import { CustomSelect } from './CustomSelect';
import type { InventoryItem, Supplier } from '@/types';
import { createInventoryItem, getAllInventory, getAllVendors } from '@/app/services/apiService';

export function InventoryClient({
  inventory: initialInventory,
  initialQuery = ''
}: {
  inventory: InventoryItem[];
  initialQuery?: string;
}) {
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(initialInventory);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState(initialQuery);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [vendors, setVendors] = useState<Supplier[]>([]);

  const [newItem, setNewItem] = useState({
    sku: `ELX-${Math.floor(4000 + Math.random() * 5000)}`,
    name: 'GPS Telematics Fleet Tracker Sensors',
    category: 'Electronics',
    stock: 240,
    threshold: 60,
    warehouse: 'Colombo Central Distribution Center',
    value: 36000,
    capacity: 400,
    vendorId: 0,
  });


  useEffect(() => {
    let active = true;
    Promise.all([getAllInventory(), getAllVendors()])
      .then(([items, vendorData]) => {
        if (!active) return;
        setInventoryList(items);
        setVendors(vendorData);
      })
      .catch((error) => {
        if (active) showToast(error instanceof Error ? error.message : 'Unable to load inventory.');
      });
    return () => { active = false; };
  }, []);
  const categories = ['All', ...Array.from(new Set(inventoryList.map((i) => i.category)))];

  const filtered = useMemo(() => inventoryList.filter((i) => {
    const q = query.toLowerCase();
    return (category === 'All' || i.category === category) && (!q || `${i.sku} ${i.name} ${i.warehouse}`.toLowerCase().includes(q));
  }), [inventoryList, category, query]);

  const lowCount = inventoryList.filter((i) => i.stock < i.threshold).length;
  const totalValuation = inventoryList.reduce((acc, i) => acc + i.value, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createInventoryItem({
        sku: newItem.sku.trim(),
        name: newItem.name.trim(),
        category: newItem.category,
        stock: Number(newItem.stock),
        threshold: Number(newItem.threshold),
        warehouse: newItem.warehouse,
        value: Number(newItem.value),
        capacity: Number(newItem.capacity),
        vendorId: newItem.vendorId || undefined
      });
      setInventoryList((current) => [created, ...current]);
      setIsAddOpen(false);
      showToast(`SKU ${created.sku} registered in the warehouse catalog.`);
      setNewItem({
        sku: `PKG-${Math.floor(6000 + Math.random() * 3000)}`,
        name: 'High-Density Reinforced Container Pallets',
        category: 'Packaging',
        stock: 180,
        threshold: 50,
        warehouse: 'Hambantota Port Free Zone DC',
        value: 14500,
        capacity: 350,
        vendorId: newItem.vendorId
      });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add inventory item.');
    }
  };


  return <>
    <PageHeader
      eyebrow="Stock intelligence"
      title="Inventory"
      description="Monitor stock positions, warehouse capacity, and replenishment risk in real time."
      action={
        <button
          type="button"
          className="primary-btn"
          onClick={() => setIsAddOpen(true)}
        >
          <PackagePlus size={17} /> Add item
        </button>
      }
    />

    <div className="stat-strip glass-panel">
      <div><span>Total SKUs</span><strong>{inventoryList.length}</strong><small>Across 8 warehouses</small></div>
      <div><span>Inventory value</span><strong>${(totalValuation / 1000000).toFixed(2)}M</strong><small className="positive-text">+5.6%</small></div>
      <div><span>Low stock items</span><strong>{lowCount}</strong><small className={lowCount > 0 ? 'danger-text' : 'positive-text'}>{lowCount > 0 ? 'Needs replenishment' : 'All optimal'}</small></div>
      <div><span>Capacity used</span><strong>74%</strong><small>Network average</small></div>
    </div>

    <section className="panel glass-panel data-panel">
      <div className="table-toolbar">
        <div className="toolbar-search">
          <Search size={16}/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search SKU, product or warehouse..." />
        </div>
        <div className="category-filter">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? 'active' : ''}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Stock level</th>
              <th>Warehouse</th>
              <th>Inventory value</th>
              <th>Health</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const low = item.stock < item.threshold;
              const pct = Math.min(100, Math.round((item.stock / item.capacity) * 100));
              return (
                <tr key={item.sku} className={low ? 'low-stock-row' : ''}>
                  <td><strong className="mono">{item.sku}</strong></td>
                  <td>
                    <span className="product-cell">
                      <span className="product-icon"><Boxes size={16}/></span>
                      <span>
                        <strong>{item.name}</strong>
                        <small>Threshold: {item.threshold} units</small>
                      </span>
                    </span>
                  </td>
                  <td><span className="region-chip">{item.category}</span></td>
                  <td>
                    <div className="stock-cell">
                      <div>
                        <strong>{item.stock}</strong>
                        <small>/ {item.capacity} units</small>
                      </div>
                      <div className={`stock-progress ${low ? 'danger' : ''}`}>
                        <i style={{ width: `${pct}%` }}/>
                      </div>
                    </div>
                  </td>
                  <td><span className="location-cell"><Warehouse size={14}/>{item.warehouse}</span></td>
                  <td className="value-cell">${item.value.toLocaleString()}</td>
                  <td>
                    {low ? (
                      <span className="stock-warning"><AlertTriangle size={14}/> Low stock</span>
                    ) : (
                      <span className="stock-ok"><i/> Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <EmptyState title="No inventory items found"/>}
      </div>
    </section>

    
    {isAddOpen && (
      <Modal
        title="Register New Inventory SKU"
        subtitle="Catalog stock item, assign warehouse location, and define automated replenishment thresholds"
        onClose={() => setIsAddOpen(false)}
      >
        <form onSubmit={handleAddItem} className="modal-form-wrap">
          <div className="form-grid-2">
            <div className="form-group">
              <label>SKU Code / Part Number</label>
              <input
                type="text"
                value={newItem.sku}
                onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label><Tag size={13} /> Product Category</label>
              <CustomSelect
                options={[
                  { value: 'Electronics', label: 'Electronics & Telematics' },
                  { value: 'Packaging', label: 'Industrial Packaging' },
                  { value: 'Apparel & Textiles', label: 'Apparel & Garments' },
                  { value: 'Automotive', label: 'Automotive & Spare Parts' },
                  { value: 'Agricultural', label: 'Agricultural & Ceylon Tea' },
                  { value: 'Raw Materials', label: 'Raw Materials & Minerals' }
                ]}
                value={newItem.category}
                onChange={(val) => setNewItem({ ...newItem, category: val })}
              />
            </div>
          </div>

          <div className="form-group">
            <label><Boxes size={13} /> Product Name / Description</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="e.g. Telematics Fleet Sensors Gen-4"
              required
            />
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Supplier</label>
              <CustomSelect
                options={[{ value: '0', label: 'No supplier assigned' }, ...vendors.map((vendor) => ({ value: String(vendor.databaseId ?? 0), label: `${vendor.id} — ${vendor.name}` }))]}
                value={String(newItem.vendorId)}
                onChange={(value) => setNewItem({ ...newItem, vendorId: Number(value) })}
                searchable
              />
            </div>
            <div className="form-group">
              <label><Warehouse size={13} /> Warehouse Location</label>
              <CustomSelect
                options={[
                  'Colombo Central Distribution Center',
                  'Port of Colombo Transshipment Hub',
                  'Hambantota Port Free Zone DC',
                  'Kandy Regional Logistics Depot',
                  'Anuradhapura Logistics Warehouse',
                  'Trincomalee Harbor Depot'
                ]}
                value={newItem.warehouse}
                onChange={(val) => setNewItem({ ...newItem, warehouse: val })}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label>Initial Stock (Units)</label>
              <input
                type="number"
                min="0"
                value={newItem.stock}
                onChange={(e) => setNewItem({ ...newItem, stock: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Safety Threshold</label>
              <input
                type="number"
                min="1"
                value={newItem.threshold}
                onChange={(e) => setNewItem({ ...newItem, threshold: Number(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Storage Capacity</label>
              <input
                type="number"
                min="1"
                value={newItem.capacity}
                onChange={(e) => setNewItem({ ...newItem, capacity: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><DollarSign size={13} /> Total Stock Value ($)</label>
            <input
              type="number"
              min="0"
              value={newItem.value}
              onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })}
              required
            />
          </div>

          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => setIsAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Plus size={15} /> Save SKU to Catalog
            </button>
          </div>
        </form>
      </Modal>
    )}

    
    {toastMessage && (
      <div className="toast">
        <CheckCircle2 size={16} />
        <div>
          <strong>Inventory Updated</strong>
          <span>{toastMessage}</span>
        </div>
      </div>
    )}
  </>;
}
