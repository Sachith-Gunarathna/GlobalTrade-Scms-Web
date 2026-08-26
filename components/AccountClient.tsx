'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Smartphone,
  Lock,
  History,
  CheckCircle2,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Save,
  Globe,
  Camera,
  LogOut,
  Laptop,
  Check
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { useAuth } from '@/context/AuthContext';

export function AccountClient() {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'sessions'>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State initialized from active user
  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'Alex',
    lastName: user?.lastName || 'Grant',
    title: user?.title || 'Operations Director & SCMS Lead',
    email: user?.email || 'alex.grant@globaltrade.lk',
    secondaryEmail: 'ops.desk@globaltrade.lk',
    phone: user?.phone || '+94 77 182 9400',
    location: user?.hub || 'Port of Colombo Hub, Sri Lanka',
    department: user?.department || 'Global Supply Chain & Logistics',
    bio: 'Lead supply chain director overseeing island-wide distribution, port transshipment, and domestic expressway freight corridors.',
  });

  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        email: user.email,
        phone: user.phone || prev.phone,
        location: user.hub || prev.location,
        department: user.department || prev.department
      }));
    }
  }, [user]);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      title: formData.title,
      phone: formData.phone,
      department: formData.department,
      hub: formData.location
    });
    showToast('Account details updated successfully!');
  };


  return (
    <div className="account-container">
      <PageHeader
        eyebrow="User Profile"
        title="My Account"
        description="Manage your personal profile, security credentials, logistics authorization levels, and active sessions."
      />

      {/* Profile Hero Header */}
      <section className="account-hero glass-panel">
        <div className="account-avatar-wrap">
          <div className="account-avatar">{user?.avatar || `${formData.firstName[0] || 'U'}${formData.lastName[0] || 'G'}`}</div>
          <button className="avatar-edit-btn" title="Change profile picture" type="button">
            <Camera size={14} />
          </button>
        </div>
        <div className="account-hero-info">
          <div className="hero-name-row">
            <h2>{formData.firstName} {formData.lastName}</h2>
            <span className="role-chip lead">{user?.role || 'Operations Director'}</span>
            <span className="status-chip active"><i /> Active</span>
          </div>
          <p className="hero-subtitle">{formData.title} • {formData.department}</p>
          <div className="hero-meta-items">
            <span><Mail size={13} /> {formData.email}</span>
            <span><Phone size={13} /> {formData.phone}</span>
            <span><MapPin size={13} /> {formData.location}</span>
            <span><Clock size={13} /> Asia/Colombo (GMT+5:30)</span>
          </div>
        </div>
        <div className="hero-quick-actions">
          <button className="secondary-btn" onClick={() => setActiveTab('security')}>
            <Shield size={14} /> Security Status
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="settings-tabs-bar">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={15} /> Personal Profile
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Key size={15} /> Security & 2FA
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          <Shield size={15} /> Roles & Authorization
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <History size={15} /> Active Sessions
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Personal Information</h3>
              <p>Update your public information and primary logistics contact details.</p>
            </div>
            <button type="submit" className="primary-btn">
              <Save size={14} /> Save Profile
            </button>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Department / Fleet Division</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Backup / Dispatch Alert Email</label>
              <input
                type="email"
                value={formData.secondaryEmail}
                onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Mobile Number (Sri Lanka)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Primary Station / Hub Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio / Operational Responsibilities</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="form-footer">
            <button type="button" className="ghost-btn" onClick={() => showToast('Changes discarded')}>
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              <Check size={14} /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & 2FA */}
      {activeTab === 'security' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Security & Authentication</h3>
              <p>Control password credentials, two-factor authentication, and security locks.</p>
            </div>
          </div>

          {/* Password Change Box */}
          <div className="security-sub-box">
            <h4>Change Account Password</h4>
            <p>Ensure your password is at least 12 characters with symbols, numbers, and capital letters.</p>
            <div className="form-grid-3">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="••••••••••••" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="New strong password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Repeat new password" />
              </div>
            </div>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => showToast('Password updated successfully!')}
            >
              <Key size={14} /> Update Password
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="security-toggle-row">
            <div className="toggle-info">
              <div className="toggle-icon green"><Smartphone size={20} /></div>
              <div>
                <strong>Two-Factor Authentication (2FA)</strong>
                <p>Require an authenticator code (Google Authenticator / Authy) on every login.</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch ${twoFactorEnabled ? 'active' : ''}`}
              onClick={() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                showToast(twoFactorEnabled ? '2FA has been disabled' : '2FA activated successfully');
              }}
            >
              <span />
            </button>
          </div>

          {/* Biometric Login */}
          <div className="security-toggle-row">
            <div className="toggle-info">
              <div className="toggle-icon blue"><Shield size={20} /></div>
              <div>
                <strong>Biometric & Hardware Key Authentication (WebAuthn)</strong>
                <p>Use TouchID, Windows Hello, or FIDO2 Security Keys for seamless dispatch authorization.</p>
              </div>
            </div>
            <button
              type="button"
              className={`toggle-switch ${biometricEnabled ? 'active' : ''}`}
              onClick={() => {
                setBiometricEnabled(!biometricEnabled);
                showToast(biometricEnabled ? 'Biometrics disabled' : 'Biometrics registered');
              }}
            >
              <span />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Roles & Permissions */}
      {activeTab === 'permissions' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Supply Chain Access & Authorization</h3>
              <p>Operational roles and clearance levels assigned to this account.</p>
            </div>
          </div>

          <div className="permissions-grid">
            <div className="perm-card granted">
              <div className="perm-top">
                <CheckCircle2 size={18} className="perm-ok" />
                <strong>Full Dispatch Authority</strong>
              </div>
              <p>Authorization to approve inter-district vehicle movement and port container release up to $500,000 SLA value.</p>
            </div>

            <div className="perm-card granted">
              <div className="perm-top">
                <CheckCircle2 size={18} className="perm-ok" />
                <strong>Customs Declaration e-Sign</strong>
              </div>
              <p>Authorized to digital sign Sri Lanka Customs ASYCUDA clearance documentation and port gate passes.</p>
            </div>

            <div className="perm-card granted">
              <div className="perm-top">
                <CheckCircle2 size={18} className="perm-ok" />
                <strong>Multi-Hub Fleet Management</strong>
              </div>
              <p>Real-time telemetry rerouting across Colombo, Hambantota, Kandy, Anuradhapura, and Jaffna hubs.</p>
            </div>

            <div className="perm-card granted">
              <div className="perm-top">
                <CheckCircle2 size={18} className="perm-ok" />
                <strong>Inventory Restock Approval</strong>
              </div>
              <p>Sign off on automated stock procurement thresholds and supplier emergency replenishment POs.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Active Sessions */}
      {activeTab === 'sessions' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head">
            <div>
              <h3>Active Login Sessions</h3>
              <p>Devices and IP addresses currently logged into this SCMS workstation.</p>
            </div>
            <button
              type="button"
              className="danger-btn"
              onClick={() => showToast('All other sessions terminated')}
            >
              <LogOut size={14} /> Terminate Other Sessions
            </button>
          </div>

          <div className="sessions-list">
            <div className="session-item current">
              <div className="session-device"><Laptop size={20} /></div>
              <div className="session-details">
                <div className="session-title-row">
                  <strong>Windows Workstation (Chrome 128)</strong>
                  <span className="current-badge">Current Session</span>
                </div>
                <p>Colombo Headquarters, Sri Lanka • IP: 175.157.82.10 • Active right now</p>
              </div>
            </div>

            <div className="session-item">
              <div className="session-device"><Smartphone size={20} /></div>
              <div className="session-details">
                <div className="session-title-row">
                  <strong>SCMS Mobile Dispatch Tablet (iOS 17)</strong>
                </div>
                <p>Port of Colombo Gate 4 Logistics • IP: 175.157.82.14 • Last active 22 min ago</p>
              </div>
              <button
                type="button"
                className="session-revoke-btn"
                onClick={() => showToast('Session revoked')}
              >
                Revoke
              </button>
            </div>

            <div className="session-item">
              <div className="session-device"><Laptop size={20} /></div>
              <div className="session-details">
                <div className="session-title-row">
                  <strong>MacBook Pro Operations Laptop (macOS 15)</strong>
                </div>
                <p>Kandy Regional Logistics Depot • IP: 112.134.19.4 • Last active 3 days ago</p>
              </div>
              <button
                type="button"
                className="session-revoke-btn"
                onClick={() => showToast('Session revoked')}
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast popup */}
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
