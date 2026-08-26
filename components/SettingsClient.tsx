'use client';

import React, { useState } from 'react';
import {
  Building2,
  Truck,
  KeyRound,
  Users,
  Database,
  CheckCircle2,
  Copy,
  RefreshCw,
  Plus,
  Download,
  ShieldCheck,
  Globe2,
  Radio,
  FileCode,
  Save,
  Check,
  Trash2
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { CustomSelect } from './CustomSelect';

const TEAM_MEMBERS = [
  { id: 1, name: 'Alex Grant', role: 'Operations Director & Admin', email: 'alex.grant@globaltrade.lk', hub: 'Colombo HQ', status: 'Active' },
  { id: 2, name: 'Nimal Perera', role: 'Port Logistics Dispatcher', email: 'nimal.p@globaltrade.lk', hub: 'Port of Colombo', status: 'Active' },
  { id: 3, name: 'Sanduni Fernando', role: 'Inventory & Procurement Lead', email: 'sanduni.f@globaltrade.lk', hub: 'Kandy Depot', status: 'Active' },
  { id: 4, name: 'Tharindu Silva', role: 'Customs Clearance Broker', email: 'tharindu.s@globaltrade.lk', hub: 'Hambantota Port', status: 'Active' },
  { id: 5, name: 'Kamal Jayawardena', role: 'Regional Fleet Supervisor', email: 'kamal.j@globaltrade.lk', hub: 'Anuradhapura Hub', status: 'Active' }
];

export function SettingsClient() {
  const [activeTab, setActiveTab] = useState<'org' | 'fleet' | 'api' | 'team' | 'backup'>('org');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Organization state
  const [orgData, setOrgData] = useState({
    companyName: 'GlobalTrade SCMS Lanka (Pvt) Ltd',
    registrationNo: 'PV-84920-LK',
    taxId: 'TIN-492049182',
    primaryPort: 'Port of Colombo, Sri Lanka',
    secondaryPort: 'Port of Hambantota, Sri Lanka',
    headOffice: 'Level 14, World Trade Centre, Echelon Square, Colombo 01',
    supportContact: 'ops-desk@globaltrade.lk',
  });

  // Fleet state
  const [autoExpressway, setAutoExpressway] = useState(true);
  const [speedThreshold, setSpeedThreshold] = useState('75 km/h');
  const [customsBufferHours, setCustomsBufferHours] = useState('4');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('gt_live_94f8a29b01c3e449281a89c7d1e02');
    setCopiedKey(true);
    showToast('Production API Key copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="settings-container">
      <PageHeader
        eyebrow="Enterprise Administration"
        title="System Settings"
        description="Configure organization profile, domestic fleet parameters, API gateways, and staff access controls."
      />

      {/* Tabs */}
      <div className="settings-tabs-bar">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'org' ? 'active' : ''}`}
          onClick={() => setActiveTab('org')}
        >
          <Building2 size={15} /> Organization Profile
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setActiveTab('fleet')}
        >
          <Truck size={15} /> Fleet & Corridors
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <KeyRound size={15} /> Integrations & API
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={15} /> Team & Permissions
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          <Database size={15} /> Data & Audit Trail
        </button>
      </div>

      {/* Tab 1: Organization */}
      {activeTab === 'org' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Enterprise & Entity Information</h3>
              <p>Official legal registration and maritime port credentials for customs filing.</p>
            </div>
            <button type="button" className="primary-btn" onClick={() => showToast('Organization profile saved!')}>
              <Save size={14} /> Save Entity Data
            </button>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Registered Company Name</label>
              <input
                type="text"
                value={orgData.companyName}
                onChange={(e) => setOrgData({ ...orgData, companyName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Business Registration Number (BRN)</label>
              <input
                type="text"
                value={orgData.registrationNo}
                onChange={(e) => setOrgData({ ...orgData, registrationNo: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Tax Identification Number (TIN / VAT)</label>
              <input
                type="text"
                value={orgData.taxId}
                onChange={(e) => setOrgData({ ...orgData, taxId: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>24/7 Operations Desk Email</label>
              <input
                type="email"
                value={orgData.supportContact}
                onChange={(e) => setOrgData({ ...orgData, supportContact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Primary Terminal / Port of Origin</label>
              <input
                type="text"
                value={orgData.primaryPort}
                onChange={(e) => setOrgData({ ...orgData, primaryPort: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Secondary / Deepwater Gateway</label>
              <input
                type="text"
                value={orgData.secondaryPort}
                onChange={(e) => setOrgData({ ...orgData, secondaryPort: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Corporate Headquarters Address</label>
            <textarea
              rows={2}
              value={orgData.headOffice}
              onChange={(e) => setOrgData({ ...orgData, headOffice: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Fleet & Corridors */}
      {activeTab === 'fleet' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Domestic Logistics & Corridor Routing</h3>
              <p>Automated expressway freight assignment and SLA compliance parameters.</p>
            </div>
            <button type="button" className="primary-btn" onClick={() => showToast('Fleet parameters updated!')}>
              <Save size={14} /> Save Routing Rules
            </button>
          </div>

          <div className="preference-toggle-list">
            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon blue"><Truck size={18} /></div>
                <div>
                  <strong>Southern Expressway E01 & Central E04 Priority Routing</strong>
                  <p>Automatically prioritize expressway toll corridors over non-expressway trunk roads for heavy freight.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${autoExpressway ? 'active' : ''}`}
                onClick={() => setAutoExpressway(!autoExpressway)}
              >
                <span />
              </button>
            </div>
          </div>

          <div className="form-grid-2" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label>Heavy Vehicle Highway Speed Limit Buffer</label>
              <CustomSelect
                options={[
                  { value: '60 km/h', label: '60 km/h (Strict Safety Mode)' },
                  { value: '75 km/h', label: '75 km/h (Expressway Commercial Standard)', badge: 'Standard' },
                  { value: '85 km/h', label: '85 km/h (Emergency Priority)' }
                ]}
                value={speedThreshold}
                onChange={(val) => setSpeedThreshold(val)}
              />
            </div>

            <div className="form-group">
              <label>Customs Inspection SLA Lead Time (Hours)</label>
              <CustomSelect
                options={[
                  { value: '2', label: '2 Hours (Fast Track Expedited)' },
                  { value: '4', label: '4 Hours (Standard Sri Lanka Customs)', badge: 'Standard' },
                  { value: '8', label: '8 Hours (Special Examination)' }
                ]}
                value={customsBufferHours}
                onChange={(val) => setCustomsBufferHours(val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API & Integrations */}
      {activeTab === 'api' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Connected Services & Telematics Gateways</h3>
              <p>API keys and webhook endpoints for Sri Lanka Customs, Port Authority, and GPS tracking.</p>
            </div>
          </div>

          {/* Integration Status Cards */}
          <div className="integrations-grid">
            <div className="integration-card connected">
              <div className="int-top">
                <div className="int-icon blue"><Radio size={18} /></div>
                <span className="int-status"><CheckCircle2 size={13} /> Connected</span>
              </div>
              <h4>Dialog Telematics GPS Fleet API</h4>
              <p>Real-time vehicle GPS coordinates across all 9 provinces with 10-second ping telemetry.</p>
            </div>

            <div className="integration-card connected">
              <div className="int-top">
                <div className="int-icon green"><ShieldCheck size={18} /></div>
                <span className="int-status"><CheckCircle2 size={13} /> Active</span>
              </div>
              <h4>Sri Lanka Customs ASYCUDA World</h4>
              <p>Direct electronic manifest transmission and clearance certificate retrieval.</p>
            </div>

            <div className="integration-card connected">
              <div className="int-top">
                <div className="int-icon purple"><Globe2 size={18} /></div>
                <span className="int-status"><CheckCircle2 size={13} /> Active</span>
              </div>
              <h4>SLPA Port Terminal EDI Gateway</h4>
              <p>Automated container gate-in/gate-out logs for Colombo and Hambantota berths.</p>
            </div>
          </div>

          {/* API Keys */}
          <div className="api-key-box">
            <h4>Live Production Secret Key</h4>
            <p>Use this key to authenticate external ERP, SAP, or warehouse management systems.</p>
            <div className="api-key-row">
              <code>gt_live_94f8a29b01c3e449281a89c7d1e02</code>
              <button type="button" className="secondary-btn" onClick={handleCopyKey}>
                {copiedKey ? <Check size={13} /> : <Copy size={13} />} {copiedKey ? 'Copied' : 'Copy Key'}
              </button>
              <button type="button" className="ghost-btn" onClick={() => showToast('New API key generated!')}>
                <RefreshCw size={13} /> Regenerate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Team */}
      {activeTab === 'team' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Operations Staff & Member Roles</h3>
              <p>Manage authenticated staff with role-based dashboard permissions.</p>
            </div>
            <button type="button" className="primary-btn" onClick={() => showToast('Invite link generated!')}>
              <Plus size={14} /> Add Team Member
            </button>
          </div>

          <div className="table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Role</th>
                  <th>Primary Hub</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {TEAM_MEMBERS.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.name}</strong>
                      <span className="cell-sub">{member.email}</span>
                    </td>
                    <td><span className="region-chip">{member.role}</span></td>
                    <td>{member.hub}</td>
                    <td><span className="status-chip active"><i /> {member.status}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="session-revoke-btn"
                        onClick={() => showToast(`Edit permissions for ${member.name}`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Data & Backup */}
      {activeTab === 'backup' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Data Export & System Archives</h3>
              <p>Download full logistics database snapshots, shipment logs, and regulatory audit records.</p>
            </div>
          </div>

          <div className="backup-actions-grid">
            <div className="backup-card">
              <h4>Export All Active Shipments (CSV)</h4>
              <p>Includes domestic tracking numbers, carrier details, timestamps, and ETA metrics.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => showToast('Shipments export downloaded (shipments-aug-2026.csv)')}
              >
                <Download size={14} /> Download Shipments CSV
              </button>
            </div>

            <div className="backup-card">
              <h4>Export Inventory & Stock Matrix (JSON)</h4>
              <p>Full catalog of SKUs, warehouse bin locations, safety thresholds, and valuation totals.</p>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => showToast('Inventory export downloaded (inventory-aug-2026.json)')}
              >
                <Download size={14} /> Download Inventory JSON
              </button>
            </div>

            <div className="backup-card">
              <h4>Full SCMS Audit Trail Snapshot</h4>
              <p>Certified historical log of all dispatch approvals, customs declarations, and user actions.</p>
              <button
                type="button"
                className="primary-btn"
                onClick={() => showToast('Audit trail archive generated')}
              >
                <FileCode size={14} /> Export Encrypted Audit Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="toast">
          <CheckCircle2 size={16} />
          <div>
            <strong>Success</strong>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
