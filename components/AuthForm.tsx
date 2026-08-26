'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Boxes,
  Globe2,
  KeyRound,
  Zap,
  HelpCircle,
  X,
  Compass,
  Anchor,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { CustomSelect } from './CustomSelect';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
}

const DEPARTMENTS = [
  'Global Supply Chain & Operations',
  'Procurement & Sourcing',
  'Fleet & Transport Logistics',
  'Port Operations & Maritime Dispatch',
  'Customs & Regulatory Clearance',
  'Warehouse & Inventory Management',
  'Supply Chain Analytics & Planning',
  'Executive Administration'
];

const SRI_LANKA_HUBS = [
  'Port of Colombo HQ (Terminal 1 & 2)',
  'Hambantota International Port Hub',
  'Kandy Central Inland Depot',
  'Galle Maritime & Bunkering Centre',
  'BIA Katunayake Air Cargo Hub',
  'Anuradhapura Northern Distribution Hub',
  'Trincomalee Deep Water Logistics Bay'
];

const ROLES = [
  'Operations Director / Lead',
  'Supply Chain Manager',
  'Port Logistics Dispatcher',
  'Procurement Specialist',
  'Customs Clearance Broker',
  'Fleet & Corridor Supervisor',
  'Warehouse Operations Officer',
  'Logistics Data Analyst'
];

export function AuthForm({ initialMode = 'login' }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('GlobalTrade SCMS Partner Ltd');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [hub, setHub] = useState(SRI_LANKA_HUBS[0]);
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const pwd = registerPassword;
    let score = 0;
    const requirements = {
      length: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd)
    };

    if (requirements.length) score++;
    if (requirements.hasUpper) score++;
    if (requirements.hasNumber) score++;
    if (requirements.hasSpecial) score++;

    return {
      score,
      requirements,
      label: score <= 1 ? 'Weak' : score <= 3 ? 'Medium' : 'Strong',
      colorClass: score <= 1 ? 'active-weak' : score <= 3 ? 'active-medium' : 'active-strong'
    };
  }, [registerPassword]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    const result = await login(loginEmail, loginPassword, rememberMe);
    if (result.success) {
      setSuccessMessage('Authentication successful! Redirecting to SCMS Command Center...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      setErrorMessage(result.error || 'Invalid email or password.');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!firstName.trim() || !lastName.trim() || !registerEmail.trim() || !registerPassword) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (registerPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must accept the Enterprise Logistics Terms & Security Protocol.');
      return;
    }

    setLoading(true);
    const result = await register({
      firstName,
      lastName,
      email: registerEmail,
      password: registerPassword,
      phone: phone || '+94 77 000 0000',
      organization,
      role,
      department,
      hub
    });

    if (result.success) {
      setSuccessMessage('Account registered successfully! Redirecting to SCMS workspace...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickDemoSelect = async (demoUser: typeof DEMO_USERS[0]) => {
    setLoginEmail(demoUser.email);
    setLoginPassword('DemoPassword123!');
    setErrorMessage(null);
    setSuccessMessage(`Logged in as ${demoUser.name} (${demoUser.role})`);
    setLoading(true);
    await demoLogin(demoUser.id);
    setTimeout(() => {
      router.push(redirectUrl);
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-ambient-glow-1" />
      <div className="auth-ambient-glow-2" />

      <div className="auth-container">
        {/* Left Hero Pane */}
        <div className="auth-hero-pane">
          <div>
            <Link href="/" className="auth-hero-brand">
              <img src="/logo/global trade logo.png" alt="GlobalTrade Logo" width={46} height={46} />
              <div className="brand-copy">
                <strong>GlobalTrade</strong>
                <small>SCMS LANKA</small>
              </div>
            </Link>

            <div className="auth-hero-badge">
              <i /> Live Sri Lanka Maritime & Inland Logistics Gateway
            </div>

            <h2 className="auth-hero-title">
              Next-Gen <span>Supply Chain</span> & Trade Intelligence
            </h2>

            <p className="auth-hero-desc">
              Comprehensive cargo tracking, port transshipment automation, inventory replenishment,
              and expressway freight routing across Sri Lanka and worldwide corridors.
            </p>

            <div className="auth-hero-stats">
              <div className="auth-stat-box">
                <strong>1,420+</strong>
                <small>Active TEUs</small>
              </div>
              <div className="auth-stat-box">
                <strong>99.4%</strong>
                <small>On-Time Delivery</small>
              </div>
              <div className="auth-stat-box">
                <strong>7 Hubs</strong>
                <small>Island-wide</small>
              </div>
            </div>

            <div className="auth-hubs-list">
              <div className="auth-hub-pill">
                <Anchor size={12} /> Port of Colombo
              </div>
              <div className="auth-hub-pill">
                <Compass size={12} /> Hambantota Port
              </div>
              <div className="auth-hub-pill">
                <Truck size={12} /> Kandy Freight Hub
              </div>
              <div className="auth-hub-pill">
                <Boxes size={12} /> BIA Air Cargo
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <div className="auth-hero-security">
              <ShieldCheck size={15} />
              <span>AES-256 & 2FA Protected Gateway</span>
            </div>
            <span>v1.4 Enterprise</span>
          </div>
        </div>

        {/* Right Form Pane */}
        <div className="auth-form-pane">
          {/* Mode Switcher Tabs */}
          <div className="auth-nav-tabs">
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              <KeyRound size={15} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-nav-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
            >
              <User size={15} /> Register
            </button>
          </div>

          {/* Header */}
          <div className="auth-header">
            <h1>{mode === 'login' ? 'Welcome back to SCMS' : 'Create Enterprise Account'}</h1>
            <p>
              {mode === 'login'
                ? 'Enter your enterprise credentials or select a quick demo profile.'
                : 'Register your organization to access Sri Lanka logistics corridors.'}
            </p>
          </div>

          {/* Error & Success Alerts */}
          {errorMessage && (
            <div className="auth-alert error">
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <CheckCircle2 size={17} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-input-group">
                <label className="auth-label">Work Email / Username</label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="alex.grant@globaltrade.lk"
                    className="auth-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div className="auth-label">
                  <span>Password</span>
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      setForgotModalOpen(true);
                      setForgotSubmitted(false);
                      setForgotEmail(loginEmail || 'alex.grant@globaltrade.lk');
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="auth-input has-toggle"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="auth-options-row">
                <label className="auth-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>Keep me signed in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className={`auth-submit-btn ${successMessage ? 'success' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                    <span>Verifying Credentials...</span>
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Access Granted</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to SCMS</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Quick Demo Logins Box */}
              <div className="demo-accounts-box">
                <div className="demo-accounts-header">
                  <span><Zap size={13} /> 1-Click Demo Profiles</span>
                  <small style={{ color: '#64748b', fontSize: 10 }}>Click to auto-fill & login</small>
                </div>
                <div className="demo-accounts-grid">
                  {DEMO_USERS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      className="demo-account-chip"
                      onClick={() => handleQuickDemoSelect(demo)}
                      title={`Login as ${demo.name} (${demo.role})`}
                    >
                      <div className="demo-chip-avatar">{demo.avatar}</div>
                      <div className="demo-chip-info">
                        <strong>{demo.name}</strong>
                        <small>{demo.role.split('&')[0]}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enterprise SSO Divider */}
              <div className="auth-divider">
                <span>Or Continue With Enterprise SSO</span>
              </div>

              <div className="auth-sso-grid">
                <button
                  type="button"
                  className="auth-sso-btn"
                  onClick={() => {
                    handleQuickDemoSelect(DEMO_USERS[0]);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Workspace</span>
                </button>
                <button
                  type="button"
                  className="auth-sso-btn"
                  onClick={() => {
                    handleQuickDemoSelect(DEMO_USERS[1]);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
                    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
                  </svg>
                  <span>Microsoft 365</span>
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="auth-form">
              <div className="auth-row-2">
                <div className="auth-input-group">
                  <label className="auth-label">First Name *</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Kasun"
                      className="auth-input"
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Last Name *</label>
                  <div className="auth-input-wrapper">
                    <User size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Dissanayake"
                      className="auth-input"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-row-2">
                <div className="auth-input-group">
                  <label className="auth-label">Work Email *</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="kasun.d@trade.lk"
                      className="auth-input"
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Phone (Sri Lanka / Intl)</label>
                  <div className="auth-input-wrapper">
                    <Phone size={16} className="auth-input-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 77 123 4567"
                      className="auth-input"
                    />
                  </div>
                </div>
              </div>

              <div className="auth-row-2">
                <div className="auth-input-group">
                  <label className="auth-label">Organization / Company</label>
                  <div className="auth-input-wrapper">
                    <Building2 size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Ceylon Logistics & Freight PLC"
                      className="auth-input"
                    />
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Primary Sri Lanka Hub</label>
                  <CustomSelect
                    options={SRI_LANKA_HUBS}
                    value={hub}
                    onChange={(val) => setHub(val)}
                    icon={<Anchor size={15} />}
                    searchable
                  />
                </div>
              </div>

              <div className="auth-row-2">
                <div className="auth-input-group">
                  <label className="auth-label">Department</label>
                  <CustomSelect
                    options={DEPARTMENTS}
                    value={department}
                    onChange={(val) => setDepartment(val)}
                    icon={<Layers size={15} />}
                    searchable
                  />
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Operational Role</label>
                  <CustomSelect
                    options={ROLES}
                    value={role}
                    onChange={(val) => setRole(val)}
                    icon={<User size={15} />}
                    searchable
                  />
                </div>
              </div>

              <div className="auth-row-2">
                <div className="auth-input-group">
                  <label className="auth-label">Password *</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="auth-input has-toggle"
                    />
                    <button
                      type="button"
                      className="auth-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="auth-input-group">
                  <label className="auth-label">Confirm Password *</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="auth-input has-toggle"
                    />
                    <button
                      type="button"
                      className="auth-toggle-btn"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Meter */}
              {registerPassword && (
                <div className="pw-strength-box">
                  <div className="pw-strength-bar">
                    <div className={`pw-strength-segment ${passwordStrength.score >= 1 ? passwordStrength.colorClass : ''}`} />
                    <div className={`pw-strength-segment ${passwordStrength.score >= 2 ? passwordStrength.colorClass : ''}`} />
                    <div className={`pw-strength-segment ${passwordStrength.score >= 3 ? passwordStrength.colorClass : ''}`} />
                    <div className={`pw-strength-segment ${passwordStrength.score >= 4 ? passwordStrength.colorClass : ''}`} />
                  </div>
                  <div className="pw-strength-text">
                    <span>Password Strength: <strong style={{ color: passwordStrength.score >= 3 ? '#10b981' : '#f59e0b' }}>{passwordStrength.label}</strong></span>
                    <span>{passwordStrength.score}/4 criteria</span>
                  </div>
                  <div className="pw-reqs-list">
                    <span className={`pw-req-item ${passwordStrength.requirements.length ? 'met' : ''}`}>
                      <CheckCircle2 size={11} /> 8+ Characters
                    </span>
                    <span className={`pw-req-item ${passwordStrength.requirements.hasUpper ? 'met' : ''}`}>
                      <CheckCircle2 size={11} /> Uppercase letter
                    </span>
                    <span className={`pw-req-item ${passwordStrength.requirements.hasNumber ? 'met' : ''}`}>
                      <CheckCircle2 size={11} /> Numeric character
                    </span>
                    <span className={`pw-req-item ${passwordStrength.requirements.hasSpecial ? 'met' : ''}`}>
                      <CheckCircle2 size={11} /> Special symbol (!@#$)
                    </span>
                  </div>
                </div>
              )}

              <div className="auth-options-row" style={{ marginTop: 6 }}>
                <label className="auth-checkbox-label" style={{ fontSize: 11 }}>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="auth-checkbox"
                  />
                  <span>
                    I agree to the <strong>GlobalTrade Enterprise Security Protocol</strong> & Sri Lanka Port Authority compliance terms.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className={`auth-submit-btn ${successMessage ? 'success' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                    <span>Creating Enterprise Account...</span>
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Account Created</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Complete Registration</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div className="auth-modal-overlay" onClick={() => setForgotModalOpen(false)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div>
                <h3>Reset Password PIN</h3>
                <p>Enter your enterprise email to receive an authentication reset OTP.</p>
              </div>
              <button
                type="button"
                className="auth-modal-close"
                onClick={() => setForgotModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {forgotSubmitted ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 14px'
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <h4 style={{ margin: '0 0 6px', color: '#f1f5f9' }}>Password Reset Link Sent!</h4>
                <p style={{ fontSize: 12, color: '#8da2c0', lineHeight: 1.5, margin: 0 }}>
                  We have dispatched a secure recovery link and temporary OTP to <strong>{forgotEmail}</strong>.
                  Please check your inbox or spam folder.
                </p>
                <button
                  type="button"
                  className="auth-modal-btn-submit"
                  style={{ width: '100%', marginTop: 20 }}
                  onClick={() => setForgotModalOpen(false)}
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="auth-input-group" style={{ marginBottom: 16 }}>
                  <label className="auth-label">Enterprise Work Email</label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="alex.grant@globaltrade.lk"
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-modal-actions">
                  <button
                    type="button"
                    className="auth-modal-btn-cancel"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="auth-modal-btn-submit">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
