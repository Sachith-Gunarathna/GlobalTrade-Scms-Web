'use client';

import React, { useState } from 'react';
import {
  Palette,
  Globe2,
  Bell,
  Layout,
  Sliders,
  DollarSign,
  Languages,
  Clock,
  Sparkles,
  Zap,
  Save,
  CheckCircle2,
  Truck,
  Package,
  FileText,
  Volume2
} from 'lucide-react';
import { PageHeader } from './PageHeader';

export function PreferencesClient() {
  const [activeTab, setActiveTab] = useState<'theme' | 'localization' | 'notifications' | 'dashboard'>('theme');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preference States
  const [themeMode, setThemeMode] = useState<'glass-dark' | 'oled' | 'slate'>('glass-dark');
  const [compactRows, setCompactRows] = useState(false);
  const [enableMapRadar, setEnableMapRadar] = useState(true);
  const [enableAnimations, setEnableAnimations] = useState(true);

  // Localization
  const [currency, setCurrency] = useState('LKR');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Asia/Colombo');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [weightUnit, setWeightUnit] = useState('kg');

  // Notifications
  const [notifShipmentDelays, setNotifShipmentDelays] = useState(true);
  const [notifLowStock, setNotifLowStock] = useState(true);
  const [notifCustomsCleared, setNotifCustomsCleared] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  // Dashboard
  const [autoRefreshRate, setAutoRefreshRate] = useState('30s');
  const [defaultView, setDefaultView] = useState('overview');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = () => {
    showToast('Preferences saved and applied across workspace!');
  };

  return (
    <div className="preferences-container">
      <PageHeader
        eyebrow="System Customization"
        title="User Preferences"
        description="Tailor your visual theme, regional localization, alert subscriptions, and dashboard experience."
      />

      {/* Tabs */}
      <div className="settings-tabs-bar">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          <Palette size={15} /> Appearance & Visuals
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'localization' ? 'active' : ''}`}
          onClick={() => setActiveTab('localization')}
        >
          <Globe2 size={15} /> Currency & Regional
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={15} /> Alert Subscriptions
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Layout size={15} /> Dashboard & Telemetry
        </button>
      </div>

      {/* Tab 1: Appearance */}
      {activeTab === 'theme' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Visual Aesthetics & Theme</h3>
              <p>Customize the interface palette, backdrop lighting, and animation fidelity.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Save Appearance
            </button>
          </div>

          <div className="theme-selector-grid">
            <div
              className={`theme-card ${themeMode === 'glass-dark' ? 'selected' : ''}`}
              onClick={() => setThemeMode('glass-dark')}
            >
              <div className="theme-preview glass-dark-preview">
                <span className="theme-sample-pill blue" />
                <span className="theme-sample-pill green" />
              </div>
              <div className="theme-card-info">
                <strong>Glassmorphic Dark (Default)</strong>
                <p>Curated deep navy & sapphire with blurred backdrop panels and ambient route glows.</p>
              </div>
              {themeMode === 'glass-dark' && <span className="theme-active-tag">Active</span>}
            </div>

            <div
              className={`theme-card ${themeMode === 'oled' ? 'selected' : ''}`}
              onClick={() => setThemeMode('oled')}
            >
              <div className="theme-preview oled-preview">
                <span className="theme-sample-pill emerald" />
              </div>
              <div className="theme-card-info">
                <strong>OLED Midnight Black</strong>
                <p>Pure black canvas optimized for low-light logistics control rooms and high contrast.</p>
              </div>
              {themeMode === 'oled' && <span className="theme-active-tag">Active</span>}
            </div>

            <div
              className={`theme-card ${themeMode === 'slate' ? 'selected' : ''}`}
              onClick={() => setThemeMode('slate')}
            >
              <div className="theme-preview slate-preview">
                <span className="theme-sample-pill purple" />
              </div>
              <div className="theme-card-info">
                <strong>Cyber Slate</strong>
                <p>Industrial titanium and steel tones tailored for dense cargo dispatch tables.</p>
              </div>
              {themeMode === 'slate' && <span className="theme-active-tag">Active</span>}
            </div>
          </div>

          <div className="preference-toggle-list">
            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon blue"><Sparkles size={18} /></div>
                <div>
                  <strong>Sri Lanka Trade Map Animated Cargo Stream</strong>
                  <p>Display live pulsing radar rings around Colombo HQ and animated dash vectors along corridors.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${enableMapRadar ? 'active' : ''}`}
                onClick={() => setEnableMapRadar(!enableMapRadar)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon green"><Zap size={18} /></div>
                <div>
                  <strong>Micro-animations & Transition Effects</strong>
                  <p>Smooth chart bar renders, table row hover transitions, and modal popups.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${enableAnimations ? 'active' : ''}`}
                onClick={() => setEnableAnimations(!enableAnimations)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon amber"><Sliders size={18} /></div>
                <div>
                  <strong>High-Density Compact Data Tables</strong>
                  <p>Reduce table row padding to inspect 20% more shipments and order rows simultaneously.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${compactRows ? 'active' : ''}`}
                onClick={() => setCompactRows(!compactRows)}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Localization */}
      {activeTab === 'localization' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Regional & Currency Settings</h3>
              <p>Configure default currency symbols, language, timezone, and measurement standards.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Save Localization
            </button>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label><DollarSign size={14} /> Primary Valuation Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="LKR">Sri Lankan Rupee (LKR - Rs.)</option>
                <option value="USD">US Dollar (USD - $)</option>
                <option value="EUR">Euro (EUR - €)</option>
                <option value="GBP">British Pound (GBP - £)</option>
                <option value="SGD">Singapore Dollar (SGD - S$)</option>
              </select>
            </div>

            <div className="form-group">
              <label><Languages size={14} /> System Interface Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English (International Logistics)</option>
                <option value="si">සිංහල (Sinhala - Sri Lanka)</option>
                <option value="ta">தமிழ் (Tamil - Sri Lanka)</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label><Clock size={14} /> Timezone Offset</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                <option value="Asia/Colombo">Asia/Colombo (Sri Lanka Standard Time - GMT+5:30)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT - GMT+8:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST - GMT+4:00)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Calendar Date Format</label>
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                <option value="DD/MM/YYYY">DD/MM/YYYY (Sri Lanka Standard - e.g. 24/08/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601 - e.g. 2026-08-24)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US Format - e.g. 08/24/2026)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cargo Weight & Volume Unit</label>
              <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="kg">Metric (Kilograms / Metric Tonnes / TEU)</option>
                <option value="lbs">Imperial (Pounds / Short Tons)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Supply Chain Event Notifications</h3>
              <p>Select which operational exceptions trigger email, SMS, and desktop alerts.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Update Subscriptions
            </button>
          </div>

          <div className="preference-toggle-list">
            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon red"><Truck size={18} /></div>
                <div>
                  <strong>Expressway / Port Transit Delay Warnings</strong>
                  <p>Instant alert when a container truck is delayed by over 60 minutes due to weather or port congestion.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${notifShipmentDelays ? 'active' : ''}`}
                onClick={() => setNotifShipmentDelays(!notifShipmentDelays)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon amber"><Package size={18} /></div>
                <div>
                  <strong>Low Warehouse Stock Threshold Triggers</strong>
                  <p>Notify when any SKU at Colombo, Kandy, or Hambantota distribution centers falls below 15% safety stock.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${notifLowStock ? 'active' : ''}`}
                onClick={() => setNotifLowStock(!notifLowStock)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon green"><FileText size={18} /></div>
                <div>
                  <strong>Sri Lanka Customs ASYCUDA Clearance Notices</strong>
                  <p>Send an update when incoming maritime shipments receive pre-arrival green light status.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${notifCustomsCleared ? 'active' : ''}`}
                onClick={() => setNotifCustomsCleared(!notifCustomsCleared)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon blue"><Volume2 size={18} /></div>
                <div>
                  <strong>Audible Alert Chimes</strong>
                  <p>Play subtle chime on critical operational exceptions.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${soundAlerts ? 'active' : ''}`}
                onClick={() => setSoundAlerts(!soundAlerts)}
              >
                <span />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Dashboard Layout */}
      {activeTab === 'dashboard' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Dashboard & Real-Time Telemetry</h3>
              <p>Configure live data polling intervals and primary landing widgets.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Save Configuration
            </button>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Live Polling Frequency</label>
              <select value={autoRefreshRate} onChange={(e) => setAutoRefreshRate(e.target.value)}>
                <option value="15s">Every 15 seconds (High Frequency / Port Dispatch)</option>
                <option value="30s">Every 30 seconds (Recommended)</option>
                <option value="1m">Every 1 minute</option>
                <option value="5m">Every 5 minutes</option>
                <option value="manual">Manual Refresh Only</option>
              </select>
            </div>

            <div className="form-group">
              <label>Default Launch Workspace</label>
              <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
                <option value="overview">Executive Command Overview (Dashboard)</option>
                <option value="shipments">Live Shipment Dispatch Table</option>
                <option value="orders">Fulfillment & Orders Flow</option>
                <option value="inventory">Warehouse Inventory Matrix</option>
              </select>
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
