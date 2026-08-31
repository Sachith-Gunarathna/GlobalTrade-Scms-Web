'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  Copy,
  Database,
  Download,
  FileCode,
  Globe2,
  KeyRound,
  Radio,
  Save,
  ShieldCheck,
  Truck,
  Users
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { CustomSelect } from './CustomSelect';
import { BASE_URL, getAllInventory, getAllShipments, getMonitoringData } from '@/app/services/apiService';

const TEAM_MEMBERS = [
  { id: 1, name: 'Alex Grant', role: 'ADMIN', email: 'admin@globaltrade.lk', hub: 'Colombo HQ', status: 'Active' },
  { id: 2, name: 'Nimal Perera', role: 'LOGISTICS_COORDINATOR', email: 'logistics@globaltrade.lk', hub: 'Port of Colombo', status: 'Active' },
  { id: 3, name: 'Sanduni Fernando', role: 'WAREHOUSE_MANAGER', email: 'warehouse@globaltrade.lk', hub: 'Kandy Depot', status: 'Active' },
  { id: 4, name: 'Tharindu Silva', role: 'CUSTOMS_AGENT', email: 'customs@globaltrade.lk', hub: 'Hambantota Port', status: 'Active' },
  { id: 5, name: 'Kamal Jayawardena', role: 'VENDOR_REP', email: 'vendor@globaltrade.lk', hub: 'Supplier Portal', status: 'Active' }
];

const DEFAULT_ORG = {
  companyName: 'GlobalTrade Logistics Corporation',
  registrationNo: 'PV-84920-LK',
  taxId: 'TIN-492049182',
  primaryPort: 'Port of Colombo, Sri Lanka',
  secondaryPort: 'Port of Hambantota, Sri Lanka',
  headOffice: 'Colombo, Sri Lanka',
  supportContact: 'ops-desk@globaltrade.lk'
};

const SETTINGS_KEY = 'globaltrade_system_settings';

function downloadBlob(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function csvValue(value: unknown) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState<'org' | 'fleet' | 'api' | 'team' | 'backup'>('org');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [orgData, setOrgData] = useState(DEFAULT_ORG);
  const [autoExpressway, setAutoExpressway] = useState(true);
  const [speedThreshold, setSpeedThreshold] = useState('75 km/h');
  const [customsBufferHours, setCustomsBufferHours] = useState('4');
  const [exporting, setExporting] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as {
        orgData?: typeof DEFAULT_ORG;
        autoExpressway?: boolean;
        speedThreshold?: string;
        customsBufferHours?: string;
      };
      if (parsed.orgData) setOrgData({ ...DEFAULT_ORG, ...parsed.orgData });
      if (typeof parsed.autoExpressway === 'boolean') setAutoExpressway(parsed.autoExpressway);
      if (parsed.speedThreshold) setSpeedThreshold(parsed.speedThreshold);
      if (parsed.customsBufferHours) setCustomsBufferHours(parsed.customsBufferHours);
    } catch {
      localStorage.removeItem(SETTINGS_KEY);
    }
  }, []);

  const saveSettings = (message: string) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ orgData, autoExpressway, speedThreshold, customsBufferHours }));
    showToast(message);
  };

  const copyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText(BASE_URL);
      setCopiedEndpoint(true);
      showToast('REST API base URL copied.');
      window.setTimeout(() => setCopiedEndpoint(false), 2000);
    } catch {
      showToast('Clipboard access was not available.');
    }
  };

  const exportShipments = async () => {
    setExporting(true);
    try {
      const rows = await getAllShipments();
      const header = ['Tracking Number', 'Origin', 'Destination', 'Status', 'Carrier', 'Vessel', 'ETA', 'Declared Value', 'Weight', 'Vendor'];
      const body = rows.map((row) => [row.id, row.origin, row.destination, row.status, row.carrier, row.vessel, row.estimatedDeliveryDate || row.eta, row.value, row.weight, row.vendorName || ''].map(csvValue).join(','));
      downloadBlob('globaltrade-shipments.csv', [header.map(csvValue).join(','), ...body].join('\n'), 'text/csv;charset=utf-8');
      showToast('Shipment CSV exported.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Shipment export failed.');
    } finally {
      setExporting(false);
    }
  };

  const exportInventory = async () => {
    setExporting(true);
    try {
      const rows = await getAllInventory();
      downloadBlob('globaltrade-inventory.json', JSON.stringify(rows, null, 2), 'application/json');
      showToast('Inventory JSON exported.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Inventory export failed.');
    } finally {
      setExporting(false);
    }
  };

  const exportAudit = async () => {
    setExporting(true);
    try {
      const monitoring = await getMonitoringData();
      downloadBlob('globaltrade-audit-trail.json', JSON.stringify(monitoring.audit, null, 2), 'application/json');
      showToast('Audit trail exported.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Audit export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="settings-container">
      <PageHeader eyebrow="Enterprise Administration" title="System Settings" description="Configure organization details, routing preferences, API information, role accounts, and operational exports." />

      <div className="settings-tabs-bar">
        <button type="button" className={`settings-tab-btn ${activeTab === 'org' ? 'active' : ''}`} onClick={() => setActiveTab('org')}><Building2 size={15} /> Organization Profile</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'fleet' ? 'active' : ''}`} onClick={() => setActiveTab('fleet')}><Truck size={15} /> Fleet & Corridors</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}><KeyRound size={15} /> Integrations & API</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}><Users size={15} /> Team & Permissions</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'backup' ? 'active' : ''}`} onClick={() => setActiveTab('backup')}><Database size={15} /> Data & Audit Trail</button>
      </div>

      {activeTab === 'org' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Enterprise Information</h3><p>Store local workspace details used by this frontend.</p></div><button type="button" className="primary-btn" onClick={() => saveSettings('Organization profile saved.')}><Save size={14} /> Save Entity Data</button></div>
          <div className="form-grid-2">
            <div className="form-group"><label>Registered Company Name</label><input value={orgData.companyName} onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })} /></div>
            <div className="form-group"><label>Business Registration Number</label><input value={orgData.registrationNo} onChange={(e) => setOrgData({ ...orgData, registrationNo: e.target.value })} /></div>
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>Tax Identification Number</label><input value={orgData.taxId} onChange={(e) => setOrgData({ ...orgData, taxId: e.target.value })} /></div>
            <div className="form-group"><label>Operations Desk Email</label><input type="email" value={orgData.supportContact} onChange={(e) => setOrgData({ ...orgData, supportContact: e.target.value })} /></div>
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>Primary Port</label><input value={orgData.primaryPort} onChange={(e) => setOrgData({ ...orgData, primaryPort: e.target.value })} /></div>
            <div className="form-group"><label>Secondary Port</label><input value={orgData.secondaryPort} onChange={(e) => setOrgData({ ...orgData, secondaryPort: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Head Office</label><textarea rows={2} value={orgData.headOffice} onChange={(e) => setOrgData({ ...orgData, headOffice: e.target.value })} /></div>
        </div>
      )}

      {activeTab === 'fleet' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Domestic Logistics & Corridor Routing</h3><p>Save frontend defaults used when reviewing logistics routes.</p></div><button type="button" className="primary-btn" onClick={() => saveSettings('Fleet routing preferences saved.')}><Save size={14} /> Save Routing Rules</button></div>
          <div className="preference-toggle-list">
            <div className="security-toggle-row">
              <div className="toggle-info"><div className="toggle-icon blue"><Truck size={18} /></div><div><strong>Expressway Priority Routing</strong><p>Prefer expressway corridors when the route is suitable for freight movement.</p></div></div>
              <button type="button" className={`toggle-switch ${autoExpressway ? 'active' : ''}`} onClick={() => setAutoExpressway((value) => !value)}><span /></button>
            </div>
          </div>
          <div className="form-grid-2" style={{ marginTop: 16 }}>
            <div className="form-group"><label>Heavy Vehicle Speed Reference</label><CustomSelect options={[{ value: '60 km/h', label: '60 km/h' }, { value: '75 km/h', label: '75 km/h', badge: 'Default' }, { value: '85 km/h', label: '85 km/h' }]} value={speedThreshold} onChange={setSpeedThreshold} /></div>
            <div className="form-group"><label>Customs SLA Lead Time</label><CustomSelect options={[{ value: '2', label: '2 Hours' }, { value: '4', label: '4 Hours', badge: 'Default' }, { value: '8', label: '8 Hours' }]} value={customsBufferHours} onChange={setCustomsBufferHours} /></div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Integration Architecture</h3><p>The prototype exposes Jakarta REST endpoints and keeps external carrier/customs adapters isolated from core EJB logic.</p></div></div>
          <div className="integrations-grid">
            <div className="integration-card connected"><div className="int-top"><div className="int-icon blue"><Radio size={18} /></div><span className="int-status"><CheckCircle2 size={13} /> REST</span></div><h4>SCMS REST Gateway</h4><p>Frontend requests use credentialed HTTP sessions against the Jakarta REST application.</p></div>
            <div className="integration-card connected"><div className="int-top"><div className="int-icon green"><ShieldCheck size={18} /></div><span className="int-status"><CheckCircle2 size={13} /> Secured</span></div><h4>Role Authorization</h4><p>EJB role checks protect logistics, warehouse, customs, and vendor operations.</p></div>
            <div className="integration-card connected"><div className="int-top"><div className="int-icon purple"><Globe2 size={18} /></div><span className="int-status"><CheckCircle2 size={13} /> Modular</span></div><h4>External System Boundary</h4><p>Carrier and customs integrations can be added behind service interfaces without changing the web module.</p></div>
          </div>
          <div className="api-key-box"><h4>REST API Base URL</h4><p>Use this address when testing the deployed Payara web module.</p><div className="api-key-row"><code>{BASE_URL}</code><button type="button" className="secondary-btn" onClick={() => void copyEndpoint()}>{copiedEndpoint ? <Check size={13} /> : <Copy size={13} />} {copiedEndpoint ? 'Copied' : 'Copy URL'}</button></div></div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Prototype Role Accounts</h3><p>Bootstrap accounts demonstrate the role-based authorization paths implemented in the EJB layer.</p></div></div>
          <div className="table-wrap compact-table">
            <table>
              <thead><tr><th>Staff Member</th><th>Role</th><th>Primary Hub</th><th>Status</th></tr></thead>
              <tbody>{TEAM_MEMBERS.map((member) => <tr key={member.id}><td><strong>{member.name}</strong><span className="cell-sub">{member.email}</span></td><td><span className="region-chip">{member.role}</span></td><td>{member.hub}</td><td><span className="status-chip active"><i /> {member.status}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Operational Data Exports</h3><p>Exports are generated from the live backend response rather than static sample files.</p></div></div>
          <div className="backup-actions-grid">
            <div className="backup-card"><h4>Shipments CSV</h4><p>Tracking numbers, routes, status, carrier, ETA, value, weight, and vendor.</p><button type="button" className="secondary-btn" disabled={exporting} onClick={() => void exportShipments()}><Download size={14} /> Download Shipments CSV</button></div>
            <div className="backup-card"><h4>Inventory JSON</h4><p>SKU, stock, reorder levels, warehouse, valuation, capacity, and supplier data.</p><button type="button" className="secondary-btn" disabled={exporting} onClick={() => void exportInventory()}><Download size={14} /> Download Inventory JSON</button></div>
            <div className="backup-card"><h4>Audit Trail JSON</h4><p>Cross-cutting actions recorded by the logistics audit interceptor.</p><button type="button" className="primary-btn" disabled={exporting} onClick={() => void exportAudit()}><FileCode size={14} /> Export Audit Trail</button></div>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast"><CheckCircle2 size={16} /><div><strong>Settings</strong><span>{toastMessage}</span></div></div>}
    </div>
  );
}
