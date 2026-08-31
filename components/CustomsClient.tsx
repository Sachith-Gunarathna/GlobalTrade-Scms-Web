'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { CheckCircle2, FileCheck2, Plus, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
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
import type { CustomsDocument, Shipment } from '@/types';

const emptyForm = {
  documentNumber: '',
  documentType: 'Import Declaration',
  status: 'Pending',
  deadline: '',
  notes: '',
  shipmentId: ''
};

export function CustomsClient() {
  const [documents, setDocuments] = useState<CustomsDocument[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [docs, shipmentRows] = await Promise.all([getAllCustomsDocs(), getAllShipments()]);
      setDocuments(docs);
      setShipments(shipmentRows);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to load trade compliance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const pendingCount = useMemo(
    () => documents.filter((doc) => !['Approved', 'Released', 'Rejected'].includes(doc.status)).length,
    [documents]
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const shipmentId = Number(form.shipmentId);
    if (!shipmentId) {
      showToast('Select a shipment for this customs document.');
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
      setDocuments((current) => [created, ...current]);
      setForm(emptyForm);
      setFormOpen(false);
      showToast(`Customs document ${created.documentNumber} created.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to create customs document.');
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
      setDocuments((current) => current.map((doc) => doc.id === id ? updated : doc));
      showToast(action === 'release' ? 'Shipment released from customs.' : `Document ${action}d successfully.`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : `Unable to ${action} document.`);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="International trade"
        title="Trade Compliance"
        description="Track customs documentation, deadlines, approvals, rejections, and shipment release decisions."
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary-btn" type="button" onClick={() => void load()}><RefreshCw size={15} /> Refresh</button>
            <button className="primary-btn" type="button" onClick={() => setFormOpen(true)}><Plus size={15} /> New Document</button>
          </div>
        }
      />

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><FileCheck2 size={20} /></div><div><span>Total documents</span><strong>{documents.length}</strong></div></div>
        <div className="kpi-card glass-panel"><div className="kpi-icon"><ShieldCheck size={20} /></div><div><span>Pending review</span><strong>{pendingCount}</strong></div></div>
      </div>

      <section className="glass-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Document</th><th>Shipment</th><th>Type</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}>Loading compliance records...</td></tr>
              ) : documents.length === 0 ? (
                <tr><td colSpan={6}>No customs documents have been created yet.</td></tr>
              ) : documents.map((doc) => (
                <tr key={doc.id}>
                  <td><strong>{doc.documentNumber}</strong><span className="cell-sub">{doc.notes || 'No notes'}</span></td>
                  <td>{doc.trackingNumber || doc.shipmentId || '—'}</td>
                  <td>{doc.documentType}</td>
                  <td>{doc.deadline ? new Date(doc.deadline).toLocaleString() : '—'}</td>
                  <td><span className="status-chip active"><i /> {doc.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button className="secondary-btn" type="button" disabled={busyId === doc.id} onClick={() => void runAction(doc.id, 'approve')}><CheckCircle2 size={14} /> Approve</button>
                      <button className="ghost-btn" type="button" disabled={busyId === doc.id} onClick={() => void runAction(doc.id, 'reject')}><XCircle size={14} /> Reject</button>
                      <button className="primary-btn" type="button" disabled={busyId === doc.id} onClick={() => void runAction(doc.id, 'release')}>Release</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {formOpen && <Modal onClose={() => setFormOpen(false)} title="Create Customs Document">
        <form onSubmit={submit}>
          <div className="form-grid-2">
            <div className="form-group"><label>Document Number</label><input required value={form.documentNumber} onChange={(e) => setForm({ ...form, documentNumber: e.target.value })} /></div>
            <div className="form-group"><label>Document Type</label><CustomSelect value={form.documentType} onChange={(value) => setForm({ ...form, documentType: value })} options={[{ value: 'Import Declaration', label: 'Import Declaration' }, { value: 'Export Declaration', label: 'Export Declaration' }, { value: 'Certificate of Origin', label: 'Certificate of Origin' }, { value: 'Trade Permit', label: 'Trade Permit' }]} /></div>
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>Shipment</label><CustomSelect value={form.shipmentId} onChange={(value) => setForm({ ...form, shipmentId: value })} placeholder="Select shipment" options={shipments.filter((shipment) => shipment.databaseId).map((shipment) => ({ value: String(shipment.databaseId), label: `${shipment.id} — ${shipment.origin} to ${shipment.destination}` }))} /></div>
            <div className="form-group"><label>Deadline</label><input required type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Notes</label><textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="form-footer"><button type="button" className="ghost-btn" onClick={() => setFormOpen(false)}>Cancel</button><button type="submit" className="primary-btn">Create Document</button></div>
        </form>
      </Modal>}

      {toast && <div className="toast"><CheckCircle2 size={16} /><div><strong>Trade Compliance</strong><span>{toast}</span></div></div>}
    </div>
  );
}
