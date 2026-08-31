'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Check, CheckCircle2, Clock, Key, Laptop, LogOut, Mail, MapPin, Phone, Save, Shield, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PageHeader } from './PageHeader';
import { changePassword, updateProfileToBackend, userLogOut, verifySession } from '@/app/services/apiService';
import type { ApiUser } from '@/types';

type ProfileForm = {
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  hub: string;
  organization: string;
};

const emptyProfile: ProfileForm = {
  firstName: '',
  lastName: '',
  phone: '',
  department: '',
  hub: '',
  organization: ''
};

export function AccountClient() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'permissions' | 'sessions'>('profile');
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3200);
  };

  const copyUserToForm = (value: ApiUser) => {
    setProfile({
      firstName: value.firstName || '',
      lastName: value.lastName || '',
      phone: value.phone || value.mobileNumber || '',
      department: value.department || '',
      hub: value.hub || value.primaryHub || '',
      organization: value.organization || value.organizationOrCompany || ''
    });
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await verifySession();
        setUser(response.user);
        copyUserToForm(response.user);
        localStorage.setItem('scms_user', JSON.stringify(response.user));
      } catch {
        const stored = localStorage.getItem('scms_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as ApiUser;
            setUser(parsed);
            copyUserToForm(parsed);
          } catch {
            localStorage.removeItem('scms_user');
          }
        }
      }
    };
    void loadUser();
  }, []);

  const initials = useMemo(() => {
    const value = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.trim();
    return value || 'GT';
  }, [profile.firstName, profile.lastName]);

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await updateProfileToBackend(profile);
      const updatedUser = response.user;
      setUser(updatedUser);
      copyUserToForm(updatedUser);
      localStorage.setItem('scms_user', JSON.stringify(updatedUser));
      showToast('Account details updated successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update account details.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event: FormEvent) => {
    event.preventDefault();
    if (passwords.newPassword.length < 8) {
      showToast('New password must contain at least 8 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast('New password and confirmation do not match.');
      return;
    }
    setSaving(true);
    try {
      const response = await changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast(response.message || 'Password updated successfully.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      setSaving(false);
    }
  };

  const endSession = async () => {
    try {
      await userLogOut();
    } finally {
      localStorage.removeItem('scms_user');
      router.replace('/login');
    }
  };

  return (
    <div className="account-container">
      <PageHeader eyebrow="User profile" title="My Account" description="Manage profile information, credentials, role authorization, and the current authenticated session." />

      <section className="account-hero glass-panel">
        <div className="account-avatar-wrap"><div className="account-avatar">{initials}</div></div>
        <div className="account-hero-info">
          <div className="hero-name-row">
            <h2>{profile.firstName || 'User'} {profile.lastName}</h2>
            <span className="role-chip lead">{user?.role || 'Authenticated user'}</span>
            <span className="status-chip active"><i /> Active</span>
          </div>
          <p className="hero-subtitle">{profile.department || 'Supply Chain Operations'}</p>
          <div className="hero-meta-items">
            <span><Mail size={13} /> {user?.email || '—'}</span>
            <span><Phone size={13} /> {profile.phone || '—'}</span>
            <span><MapPin size={13} /> {profile.hub || '—'}</span>
            <span><Clock size={13} /> Asia/Colombo</span>
          </div>
        </div>
      </section>

      <div className="settings-tabs-bar">
        <button type="button" className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}><User size={15} /> Personal Profile</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}><Key size={15} /> Security</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'permissions' ? 'active' : ''}`} onClick={() => setActiveTab('permissions')}><Shield size={15} /> Authorization</button>
        <button type="button" className={`settings-tab-btn ${activeTab === 'sessions' ? 'active' : ''}`} onClick={() => setActiveTab('sessions')}><Laptop size={15} /> Session</button>
      </div>

      {activeTab === 'profile' && (
        <form onSubmit={handleSave} className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Personal Information</h3><p>Update the information stored with your authenticated SCMS account.</p></div><button type="submit" className="primary-btn" disabled={saving}><Save size={14} /> Save Profile</button></div>
          <div className="form-grid-2">
            <div className="form-group"><label>First Name</label><input required value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} /></div>
            <div className="form-group"><label>Last Name</label><input required value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} /></div>
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>Phone</label><input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
            <div className="form-group"><label>Department</label><input value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} /></div>
          </div>
          <div className="form-grid-2">
            <div className="form-group"><label>Primary Hub</label><input value={profile.hub} onChange={(e) => setProfile({ ...profile, hub: e.target.value })} /></div>
            <div className="form-group"><label>Organization</label><input value={profile.organization} onChange={(e) => setProfile({ ...profile, organization: e.target.value })} /></div>
          </div>
          <div className="form-footer"><button type="button" className="ghost-btn" onClick={() => user && copyUserToForm(user)}>Reset</button><button type="submit" className="primary-btn" disabled={saving}><Check size={14} /> Save Changes</button></div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handlePasswordChange} className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Password Security</h3><p>The current password is verified by the Jakarta EE authentication service before the new password is stored.</p></div></div>
          <div className="form-grid-3">
            <div className="form-group"><label>Current Password</label><input required type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></div>
            <div className="form-group"><label>New Password</label><input required type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /></div>
            <div className="form-group"><label>Confirm New Password</label><input required type="password" autoComplete="new-password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} /></div>
          </div>
          <button type="submit" className="secondary-btn" disabled={saving}><Key size={14} /> Update Password</button>
        </form>
      )}

      {activeTab === 'permissions' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Role-Based Authorization</h3><p>Server-side authorization uses the role attached to the authenticated account for each protected REST operation.</p></div></div>
          <div className="permissions-grid">
            <div className="perm-card granted"><div className="perm-top"><CheckCircle2 size={18} className="perm-ok" /><strong>Current Role</strong></div><p>{user?.role || 'No role loaded'}</p></div>
            <div className="perm-card granted"><div className="perm-top"><CheckCircle2 size={18} className="perm-ok" /><strong>Authenticated Identity</strong></div><p>{user?.email || 'Session identity has not been loaded.'}</p></div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="settings-panel glass-panel">
          <div className="settings-section-head"><div><h3>Current Login Session</h3><p>The application uses the authenticated Jakarta EE HTTP session and sends the session cookie with API requests.</p></div><button type="button" className="danger-btn" onClick={() => void endSession()}><LogOut size={14} /> Sign Out This Session</button></div>
          <div className="sessions-list"><div className="session-item current"><div className="session-device"><Laptop size={20} /></div><div className="session-details"><div className="session-title-row"><strong>Current Browser Session</strong><span className="current-badge">Current Session</span></div><p>{user?.email || 'Authenticated user'} • Active now</p></div></div></div>
        </div>
      )}

      {toastMessage && <div className="toast"><CheckCircle2 size={16} /><div><strong>Account</strong><span>{toastMessage}</span></div></div>}
    </div>
  );
}
