'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShieldX,
  Truck,
  XCircle
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Modal } from './Modal';
import { CustomSelect } from './CustomSelect';
import {
  approveCustomsDocument,
  createCustomsDocument,
  getAllCustomsDocs,
  getAllShipments,
  rejectCustomsDocument,
  releaseCustomsShipment
} from '@/app/services/apiService';
import { canAccess } from '@/app/services/roleAccess';
import { useCurrentUser } from '@/context/AuthContext';
import type { CustomsDocument, Shipment } from '@/types';



const emptyForm = {
  documentNumber: '',
  documentType: 'Import Declaration',
  status: 'Pending',
  deadline: '',
  notes: '',
  shipmentId: ''
};

function fmtDate(val: string | null | undefined) {
  if (!val) return '—';
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? val : d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function isOverdue(deadline: string | null) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function getStatusConfig(status: string) {
  const s = status.toLowerCase();
  if (s === 'approved' || s === 'released')
    return { cls: 'cust-status-approved', icon: <CheckCircle2 size={11} />, dot: '#10b981' };
  if (s === 'rejected')
    return { cls: 'cust-status-rejected', icon: <XCircle size={11} />, dot: '#ef4444' };
  if (s === 'customs hold')
    return { cls: 'cust-status-hold', icon: <AlertTriangle size={11} />, dot: '#f59e0b' };
  return { cls: 'cust-status-pending', icon: <Clock size={11} />, dot: '#38bdf8' };
}



export function CustomsClient() {
  const [documents, setDocuments] = useState<CustomsDocument[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const user = useCurrentUser();
  const canCreate = canAccess(user?.role, 'customs.create');
  const canDecide = canAccess(user?.role, 'customs.decision');

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    window.setTimeout(() => setToast(null), 3400);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [docs, shipmentRows] = await Promise.all([getAllCustomsDocs(), getAllShipments()]);
      setDocuments(docs);
      setShipments(shipmentRows);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load trade compliance data.', false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  
  const kpiCounts = useMemo(() => ({
    total: documents.length,
    pending: documents.filter((d) => !['Approved', 'Released', 'Rejected'].includes(d.status)).length,
    approved: documents.filter((d) => d.status === 'Approved' || d.status === 'Released').length,
    rejected: documents.filter((d) => d.status === 'Rejected').length,
    overdue: documents.filter((d) => isOverdue(d.deadline) && !['Approved', 'Released', 'Rejected'].includes(d.status)).length,
  }), [documents]);

  
  const filtered = useMemo(() => {
    const q = searchQ.toLowerCase();
    return documents.filter((doc) => {
      const matchSearch = !q ||
        doc.documentNumber.toLowerCase().includes(q) ||
        doc.documentType.toLowerCase().includes(q) ||
        String(doc.trackingNumber ?? '').toLowerCase().includes(q) ||
        (doc.notes ?? '').toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || doc.status.toLowerCase() === filterStatus.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [documents, searchQ, filterStatus]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const shipmentId = Number(form.shipmentId);
    if (!shipmentId) {
      showToast('Select a shipment for this customs document.', false);
      return;
    }
    try {
      const created = await createCustomsDocument({
        documentNumber: form.documentNumber.trim(),
        documentType: form.documentType,
        status: form.status,
        deadline: form.deadline,
        notes: form.notes.trim(),
        shipmentId
      });
      setDocuments((curr) => [created, ...curr]);
      setForm(emptyForm);
      setFormOpen(false);
      showToast(`Customs document ${created.documentNumber} created.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to create customs document.', false);
    }
  };

  const runAction = async (id: number, action: 'approve' | 'reject' | 'release') => {
    setBusyId(id);
    try {
      const updated = action === 'approve'
        ? await approveCustomsDocument(id, 'Approved from trade compliance workspace')
        : action === 'reject'
          ? await rejectCustomsDocument(id, 'Rejected from trade compliance workspace')
          : await releaseCustomsShipment(id);
      setDocuments((curr) => curr.map((doc) => doc.id === id ? updated : doc));
      showToast(action === 'release' ? 'Shipment released from customs.' : `Document ${action}d successfully.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : `Unable to ${action} document.`, false);
    } finally {
      setBusyId(null);
    }
  };

  const statusFilters = ['all', 'Pending', 'Approved', 'Released', 'Rejected'];

  return (
    <div className="cust-root">
      <PageHeader
        eyebrow="International trade"
        title="Trade Compliance"
        description="Track customs documentation, deadlines, approvals, rejections, and shipment release decisions."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary-btn" type="button" onClick={() => void load()} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            {canCreate && (
              <button className="primary-btn" type="button" onClick={() => setFormOpen(true)}>
                <Plus size={14} /> New Document
              </button>
            )}
          </div>
        }
      />

      
      <div className="cust-kpi-row">
        <article className="cust-kpi glass-panel cust-kpi-blue">
          <div className="cust-kpi-icon"><FileCheck2 size={18} /></div>
          <div className="cust-kpi-body">
            <span>Total Documents</span>
            <strong>{loading ? '—' : kpiCounts.total}</strong>
            <small>All records</small>
          </div>
        </article>
        <article className="cust-kpi glass-panel cust-kpi-amber">
          <div className="cust-kpi-icon"><Clock size={18} /></div>
          <div className="cust-kpi-body">
            <span>Pending Review</span>
            <strong>{loading ? '—' : kpiCounts.pending}</strong>
            <small>Awaiting decision</small>
          </div>
        </article>
        <article className="cust-kpi glass-panel cust-kpi-emerald">
          <div className="cust-kpi-icon"><ShieldCheck size={18} /></div>
          <div className="cust-kpi-body">
            <span>Approved / Released</span>
            <strong>{loading ? '—' : kpiCounts.approved}</strong>
            <small>Cleared for release</small>
          </div>
        </article>
        <article className="cust-kpi glass-panel cust-kpi-red">
          <div className="cust-kpi-icon"><ShieldX size={18} /></div>
          <div className="cust-kpi-body">
            <span>Rejected</span>
            <strong>{loading ? '—' : kpiCounts.rejected}</strong>
            <small>Compliance failures</small>
          </div>
        </article>
        <article className="cust-kpi glass-panel cust-kpi-rose">
          <div className="cust-kpi-icon"><AlertTriangle size={18} /></div>
          <div className="cust-kpi-body">
            <span>Overdue</span>
            <strong>{loading ? '—' : kpiCounts.overdue}</strong>
            <small>Passed deadline</small>
          </div>
        </article>
      </div>

      
      {!loading && kpiCounts.overdue > 0 && (
        <div className="cust-overdue-banner">
          <AlertTriangle size={15} />
          <span>
            <strong>{kpiCounts.overdue} document{kpiCounts.overdue !== 1 ? 's' : ''}</strong>
            {' '}ha{kpiCounts.overdue !== 1 ? 've' : 's'} passed their deadline without a final decision.
          </span>
        </div>
      )}

      
      <section className="glass-panel cust-table-panel">

        
        <div className="cust-toolbar">
          <div className="cust-search-wrap">
            <button
              type="button"
              className={`cust-search-icon-btn ${searchQ ? 'cust-search-icon-active' : ''}`}
              onClick={() => searchQ && setSearchQ('')}
              aria-label={searchQ ? 'Clear search' : 'Search'}
              tabIndex={searchQ ? 0 : -1}
            >
              <Search size={13} className="cust-icon-search" />
              <XCircle size={13} className="cust-icon-clear" />
            </button>
            <input
              className="cust-search-input"
              type="text"
              placeholder="Search documents, type, tracking…"
              value={searchQ}
              onChange={(e) => setSearchQ(e.target.value)}
            />
          </div>

          <div className="cust-filter-tabs">
            {statusFilters.map((s) => (
              <button
                key={s}
                type="button"
                className={`cust-filter-tab ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'All' : s}
                {s === 'all'
                  ? <span className="cust-tab-count">{documents.length}</span>
                  : s === 'Pending'
                    ? <span className="cust-tab-count">{kpiCounts.pending}</span>
                    : null}
              </button>
            ))}
          </div>
        </div>

        
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Shipment</th>
                <th>Type</th>
                <th>Deadline</th>
                <th>Status</th>
                {canDecide && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={canDecide ? 6 : 5}>
                    <div className="cust-loading-row">
                      <div className="cust-spinner" />
                      <span>Loading compliance records…</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={canDecide ? 6 : 5}>
                    <div className="cust-empty">
                      <Shield size={32} />
                      <strong>{searchQ || filterStatus !== 'all' ? 'No matching documents' : 'No customs documents yet'}</strong>
                      <span>{searchQ ? `No results for "${searchQ}"` : filterStatus !== 'all' ? `No documents with status "${filterStatus}"` : 'Create the first customs document using the button above.'}</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((doc) => {
                const cfg = getStatusConfig(doc.status);
                const overdue = isOverdue(doc.deadline) && !['Approved', 'Released', 'Rejected'].includes(doc.status);
                const busy = busyId === doc.id;
                return (
                  <tr key={doc.id} className={overdue ? 'cust-row-overdue' : ''}>
                    
                    <td>
                      <div className="cust-doc-cell">
                        <span className="cust-doc-icon"><FileText size={14} /></span>
                        <div>
                          <strong className="cust-doc-number">{doc.documentNumber}</strong>
                          {doc.notes && <span className="cell-sub">{doc.notes}</span>}
                        </div>
                      </div>
                    </td>
                    
                    <td>
                      {doc.trackingNumber || doc.shipmentId ? (
                        <div className="cust-tracking-cell">
                          <Truck size={12} />
                          <span className="mono">{doc.trackingNumber ?? `#${doc.shipmentId}`}</span>
                          {doc.origin && doc.destination && (
                            <span className="cust-route">{doc.origin} → {doc.destination}</span>
                          )}
                        </div>
                      ) : '—'}
                    </td>
                    
                    <td>
                      <span className="cust-type-tag">{doc.documentType}</span>
                    </td>
                    
                    <td>
                      <div className={`cust-deadline-cell ${overdue ? 'cust-deadline-overdue' : ''}`}>
                        {overdue && <AlertTriangle size={11} />}
                        <span>{fmtDate(doc.deadline)}</span>
                      </div>
                    </td>
                    
                    <td>
                      <span className={`cust-status-badge ${cfg.cls}`}>
                        {cfg.icon}
                        {doc.status}
                      </span>
                    </td>
                    
                    {canDecide && (
                      <td>
                        <div className="cust-actions">
                          <button
                            className="cust-action-btn cust-approve"
                            type="button"
                            disabled={busy || ['Approved', 'Released'].includes(doc.status)}
                            onClick={() => void runAction(doc.id, 'approve')}
                            title="Approve"
                          >
                            <CheckCircle2 size={13} />
                            Approve
                          </button>
                          <button
                            className="cust-action-btn cust-reject"
                            type="button"
                            disabled={busy || doc.status === 'Rejected'}
                            onClick={() => void runAction(doc.id, 'reject')}
                            title="Reject"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                          <button
                            className="cust-action-btn cust-release"
                            type="button"
                            disabled={busy || doc.status === 'Released'}
                            onClick={() => void runAction(doc.id, 'release')}
                            title="Release shipment"
                          >
                            <ShieldOff size={13} />
                            Release
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="cust-table-footer">
            Showing {filtered.length} of {documents.length} document{documents.length !== 1 ? 's' : ''}
            {(searchQ || filterStatus !== 'all') && ' (filtered)'}
          </div>
        )}
      </section>

      
      {canCreate && formOpen && (
        <Modal
          onClose={() => setFormOpen(false)}
          title="New Customs Document"
          subtitle="Complete all required fields to register a customs compliance record."
        >
          <form onSubmit={submit} className="cust-form">
            <div className="form-grid-2">
              <div className="form-group">
                <label><FileText size={12} />Document Number</label>
                <input
                  required
                  placeholder="e.g. IMP-2024-00142"
                  value={form.documentNumber}
                  onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label><FileCheck2 size={12} />Document Type</label>
                <CustomSelect
                  value={form.documentType}
                  onChange={(value) => setForm({ ...form, documentType: value })}
                  options={[
                    { value: 'Import Declaration', label: 'Import Declaration' },
                    { value: 'Export Declaration', label: 'Export Declaration' },
                    { value: 'Certificate of Origin', label: 'Certificate of Origin' },
                    { value: 'Trade Permit', label: 'Trade Permit' }
                  ]}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label><Truck size={12} />Shipment</label>
                <CustomSelect
                  value={form.shipmentId}
                  onChange={(value) => setForm({ ...form, shipmentId: value })}
                  placeholder="Select shipment"
                  options={shipments
                    .filter((s) => s.databaseId)
                    .map((s) => ({
                      value: String(s.databaseId),
                      label: `${s.id} — ${s.origin} → ${s.destination}`
                    }))}
                />
              </div>
              <div className="form-group">
                <label><Clock size={12} />Deadline</label>
                <input
                  required
                  type="datetime-local"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows={3}
                placeholder="Additional compliance notes or references…"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="form-footer">
              <button type="button" className="ghost-btn" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="submit" className="primary-btn"><Plus size={14} />Create Document</button>
            </div>
          </form>
        </Modal>
      )}

      
      {toast && (
        <div className={`toast ${toast.ok ? '' : 'toast-error'}`}>
          {toast.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          <div>
            <strong>Trade Compliance</strong>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
