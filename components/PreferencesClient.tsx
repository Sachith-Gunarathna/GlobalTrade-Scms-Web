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
import { CustomSelect } from './CustomSelect';

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
              <CustomSelect
                options={[
                  { value: 'LKR', label: 'Sri Lankan Rupee (LKR - Rs.)', badge: 'Primary' },
                  { value: 'USD', label: 'US Dollar (USD - $)' },
                  { value: 'EUR', label: 'Euro (EUR - €)' },
                  { value: 'GBP', label: 'British Pound (GBP - £)' },
                  { value: 'SGD', label: 'Singapore Dollar (SGD - S$)' }
                ]}
                value={currency}
                onChange={(val) => setCurrency(val)}
              />
            </div>

            <div className="form-group">
              <label><Languages size={14} /> System Interface Language</label>
              <CustomSelect
                options={[
                  { value: 'en', label: 'English (International Logistics)', badge: 'Default' },
                  { value: 'si', label: 'සිංහල (Sinhala - Sri Lanka)' },
                  { value: 'ta', label: 'தமிழ் (Tamil - Sri Lanka)' }
                ]}
                value={language}
                onChange={(val) => setLanguage(val)}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label><Clock size={14} /> Timezone Offset</label>
              <CustomSelect
                options={[
                  { value: 'Asia/Colombo', label: 'Asia/Colombo (Sri Lanka Standard Time - GMT+5:30)', badge: 'SLST' },
                  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT - GMT+8:00)' },
                  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST - GMT+4:00)' },
                  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
                ]}
                value={timezone}
                onChange={(val) => setTimezone(val)}
              />
            </div>

            <div className="form-group">
              <label>Calendar Date Format</label>
              <CustomSelect
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (Sri Lanka Standard - 24/08/2026)' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO 8601 - 2026-08-24)' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US Format - 08/24/2026)' }
                ]}
                value={dateFormat}
                onChange={(val) => setDateFormat(val)}
              />
            </div>

            <div className="form-group">
              <label>Cargo Weight & Volume Unit</label>
              <CustomSelect
                options={[
                  { value: 'kg', label: 'Metric (Kilograms / Metric Tonnes / TEU)' },
                  { value: 'lbs', label: 'Imperial (Pounds / Short Tons)' }
                ]}
                value={weightUnit}
                onChange={(val) => setWeightUnit(val)}
              />
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
              <p>Configure automated email triggers, SMS dispatch alerts, and audio telemetry chimes.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Save Subscriptions
            </button>
          </div>

          <div className="preference-toggle-list">
            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon blue"><Truck size={18} /></div>
                <div>
                  <strong>Critical Shipment Delays & Port Congestion</strong>
                  <p>Receive real-time push alerts when transit vessels or expressways exceed buffer times.</p>
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
                  <strong>Low Stock Inventory Alerts</strong>
                  <p>Trigger automated procurement notices when SKU stock drops below safety reorder threshold.</p>
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
                  <strong>Weekly Performance Intelligence Digest</strong>
                  <p>Receive aggregated executive metrics and SLA delivery scorecards every Monday morning.</p>
                </div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${notifWeeklyDigest ? 'active' : ''}`}
                onClick={() => setNotifWeeklyDigest(!notifWeeklyDigest)}
              >
                <span />
              </button>
            </div>

            <div className="security-toggle-row">
              <div className="toggle-info">
                <div className="toggle-icon red"><Volume2 size={18} /></div>
                <div>
                  <strong>Audio Chimes & Terminal Telemetry Sounds</strong>
                  <p>Play subtle audio cues when priority dispatch orders are fulfilled or received.</p>
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

      {/* Tab 4: Dashboard & Telemetry */}
      {activeTab === 'dashboard' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Dashboard Flow & Telemetry</h3>
              <p>Configure automated data polling frequency, chart rendering styles, and default entry view.</p>
            </div>
            <button type="button" className="primary-btn" onClick={handleSave}>
              <Save size={14} /> Save Configuration
            </button>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Live Polling Frequency</label>
              <CustomSelect
                options={[
                  { value: '15s', label: 'Every 15 seconds (High Frequency / Port Dispatch)' },
                  { value: '30s', label: 'Every 30 seconds (Recommended)', badge: 'Optimal' },
                  { value: '1m', label: 'Every 1 minute' },
                  { value: '5m', label: 'Every 5 minutes' },
                  { value: 'manual', label: 'Manual Refresh Only' }
                ]}
                value={autoRefreshRate}
                onChange={(val) => setAutoRefreshRate(val)}
              />
            </div>

            <div className="form-group">
              <label>Default Launch Workspace</label>
              <CustomSelect
                options={[
                  { value: 'overview', label: 'Executive Command Overview (Dashboard)' },
                  { value: 'shipments', label: 'Live Shipment Dispatch Table' },
                  { value: 'orders', label: 'Fulfillment & Orders Flow' },
                  { value: 'inventory', label: 'Warehouse Inventory Matrix' }
                ]}
                value={defaultView}
                onChange={(val) => setDefaultView(val)}
              />
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
