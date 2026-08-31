'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Boxes,
  ChartNoAxesCombined,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  Command,
  Container,
  Globe2,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShoppingCart,
  Sliders,
  TriangleAlert,
  Truck,
  UsersRound,
  Building2,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllInventory, getAllOrders, getAllShipments, getAllVendors, getDashboardData, userLogOut, verifySession } from '@/app/services/apiService';
import { canAccess, labelForRole } from '@/app/services/roleAccess';
import { AuthContextProvider } from '@/context/AuthContext';
import type { ApiUser, DashboardAlert, InventoryItem, Order, Shipment, Supplier } from '@/types';

const nav = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview kpi command center sri lanka routes', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'CUSTOMS_AGENT', 'VENDOR_REP'] },
  { href: '/shipments', label: 'Shipments', icon: Truck, keywords: 'carrier eta routes delivery vessel logistics colombo galle hambantota', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'CUSTOMS_AGENT', 'VENDOR_REP'] },
  { href: '/orders', label: 'Orders', icon: ShoppingCart, keywords: 'customer processing sales fulfillment', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'VENDOR_REP'] },
  { href: '/inventory', label: 'Inventory', icon: Boxes, keywords: 'stock sku warehouse products replenishment', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'VENDOR_REP'] },
  { href: '/suppliers', label: 'Suppliers', icon: UsersRound, keywords: 'vendor country contact rating sourcing', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'CUSTOMS_AGENT', 'VENDOR_REP'] },
  { href: '/customs', label: 'Trade Compliance', icon: ShieldCheck, keywords: 'customs clearance declaration permit compliance trade', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'CUSTOMS_AGENT', 'VENDOR_REP'] },
  { href: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined, keywords: 'revenue charts performance metrics intelligence', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'CUSTOMS_AGENT', 'VENDOR_REP'] },
  { href: '/monitoring', label: 'Monitoring', icon: Activity, keywords: 'timers interceptors performance audit alerts ejb', roles: ['ADMIN', 'LOGISTICS_COORDINATOR', 'WAREHOUSE_MANAGER', 'CUSTOMS_AGENT'] }
];

const extraNav = [
  { href: '/account', label: 'My Account', icon: CircleUserRound, keywords: 'profile user account 2fa security password alex grant permissions' },
  { href: '/preferences', label: 'Preferences', icon: Sliders, keywords: 'preferences theme currency lkr language appearance notifications layout' },
  { href: '/settings', label: 'Settings', icon: Building2, keywords: 'settings organization fleet enterprise api team keys backup' }
];

type NotificationItem = {
  id: number;
  icon: typeof Bell;
  tone: string;
  title: string;
  time: string;
};

type SearchResult = {
  href: string;
  label: string;
  meta: string;
  icon: typeof Search;
};

const allNav = [...nav, ...extraNav];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/signin' ||
    pathname === '/signup';

  const [user, setUser] = useState<ApiUser | null>(null);
  const [authChecked, setAuthChecked] = useState(isAuthRoute);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [searchShipments, setSearchShipments] = useState<Shipment[]>([]);
  const [searchOrders, setSearchOrders] = useState<Order[]>([]);
  const [searchInventory, setSearchInventory] = useState<InventoryItem[]>([]);
  const [searchSuppliers, setSearchSuppliers] = useState<Supplier[]>([]);
  const [dashboardAlerts, setDashboardAlerts] = useState<DashboardAlert[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const active = allNav.find((item) => (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))) ?? nav[0];
  const restrictedNav = nav.find((item) => item.href !== '/' && pathname.startsWith(item.href));
  const routeAllowed = !user || (restrictedNav ? restrictedNav.roles.includes(user.role) : pathname.startsWith('/settings') ? canAccess(user.role, 'settings.view') : true);
  const notificationItems = useMemo<NotificationItem[]>(() => dashboardAlerts.map((alert, index) => {
    const lower = `${alert.type} ${alert.category}`.toLowerCase();
    const tone = lower.includes('critical') || lower.includes('delay') || lower.includes('danger') ? 'danger' : lower.includes('stock') || lower.includes('warning') ? 'warning' : 'info';
    const icon = tone === 'danger' ? TriangleAlert : tone === 'warning' ? Boxes : Info;
    return { id: index + 1, icon, tone, title: alert.title || alert.message, time: 'Current operational alert' };
  }), [dashboardAlerts]);
  const unreadCount = notificationItems.filter((n) => !readNotifications.includes(n.id)).length;

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const moduleResults = allNav
      .filter((item) => !('roles' in item) || item.roles.includes(user?.role ?? ''))
      .filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(q))
      .map((item) => ({ href: item.href, label: item.label, meta: 'Workspace module', icon: item.icon }));

    const shipmentResults = searchShipments
      .filter((item) => `${item.id} ${item.origin} ${item.destination} ${item.carrier} ${item.vessel}`.toLowerCase().includes(q))
      .map((item) => ({ href: `/shipments?q=${encodeURIComponent(item.id)}`, label: item.id, meta: `${item.origin} → ${item.destination}`, icon: Truck }));

    const orderResults = searchOrders
      .filter((item) => `${item.id} ${item.customer} ${item.region}`.toLowerCase().includes(q))
      .map((item) => ({ href: `/orders?q=${encodeURIComponent(item.id)}`, label: item.id, meta: item.customer, icon: ShoppingCart }));

    const inventoryResults = searchInventory
      .filter((item) => `${item.sku} ${item.name} ${item.category} ${item.warehouse}`.toLowerCase().includes(q))
      .map((item) => ({ href: `/inventory?q=${encodeURIComponent(item.sku)}`, label: item.sku, meta: item.name, icon: PackageSearch }));

    const supplierResults = searchSuppliers
      .filter((item) => `${item.name} ${item.country} ${item.region} ${item.category}`.toLowerCase().includes(q))
      .map((item) => ({ href: `/suppliers?q=${encodeURIComponent(item.name)}`, label: item.name, meta: `${item.country} · ${item.category}`, icon: UsersRound }));

    return [...moduleResults, ...shipmentResults, ...orderResults, ...inventoryResults, ...supplierResults].slice(0, 8);
  }, [query, user?.role, searchShipments, searchOrders, searchInventory, searchSuppliers]);

  useEffect(() => {
    let activeRequest = true;

    if (isAuthRoute) {
      setAuthChecked(true);
    } else {
      setAuthChecked(false);
      verifySession()
        .then((result) => {
          if (!activeRequest) return;
          setUser(result.user);
          localStorage.setItem('scms_user', JSON.stringify(result.user));
          setAuthChecked(true);

          const role = result.user.role;
          void Promise.all([
            canAccess(role, 'shipments.view') ? getAllShipments().catch(() => []) : Promise.resolve([] as Shipment[]),
            canAccess(role, 'orders.view') ? getAllOrders().catch(() => []) : Promise.resolve([] as Order[]),
            canAccess(role, 'inventory.view') ? getAllInventory().catch(() => []) : Promise.resolve([] as InventoryItem[]),
            canAccess(role, 'suppliers.view') ? getAllVendors().catch(() => []) : Promise.resolve([] as Supplier[])
          ]).then(([shipmentRows, orderRows, inventoryRows, supplierRows]) => {
            if (!activeRequest) return;
            setSearchShipments(shipmentRows);
            setSearchOrders(orderRows);
            setSearchInventory(inventoryRows);
            setSearchSuppliers(supplierRows);
          });

          void getDashboardData().then((dashboard) => {
            if (activeRequest) setDashboardAlerts(dashboard.alerts ?? []);
          }).catch(() => {
            if (activeRequest) setDashboardAlerts([]);
          });
        })
        .catch(() => {
          if (!activeRequest) return;
          localStorage.removeItem('scms_user');
          setUser(null);
          setAuthChecked(true);
          router.replace('/login');
        });
    }

    const saved = window.localStorage.getItem('globaltrade-sidebar-collapsed');
    if (saved === 'true') setCollapsed(true);

    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
        setQuery('');
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      activeRequest = false;
      window.removeEventListener('keydown', handler);
    };
  }, [isAuthRoute, router]);

  useEffect(() => {
    if (authChecked && user && !routeAllowed) {
      router.replace('/');
    }
  }, [authChecked, user, routeAllowed, router]);

  const handleLogOut = async () => {
    try {
      await userLogOut();
    } catch {
      localStorage.removeItem('scms_user');
    } finally {
      localStorage.removeItem('scms_user');
      setUser(null);
      setProfileOpen(false);
      router.replace('/login');
    }
  };

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem('globaltrade-sidebar-collapsed', String(next));
      return next;
    });
  };

  const go = (href: string) => {
    router.push(href);
    setQuery('');
    setMobileOpen(false);
  };

  const toggleNotification = (id: number) => {
    setReadNotifications((current) => current.includes(id) ? current.filter((n) => n !== id) : [...current, id]);
  };

  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!authChecked || !user || !routeAllowed) {
    return <div className="app-loading" aria-label="Checking session" />;
  }

  return (
    <AuthContextProvider value={user}>
      <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar glass ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand-row">
          <Link href="/" className="brand" onClick={() => setMobileOpen(false)}>
            <img src="/logo/global trade logo.png" alt="Logo" width={50} height={50} />
            <span className="brand-copy"><strong>GlobalTrade</strong><small>SCMS LANKA</small></span>
          </Link>
          <button className="icon-btn mobile-only" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19} /></button>
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          <p className="nav-caption">Workspace</p>
          {nav.filter((item) => item.roles.includes(user.role)).map((item) => {
            const Icon = item.icon;
            const selected = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${selected ? 'active' : ''}`} title={collapsed ? item.label : undefined}>
                <Icon size={20} strokeWidth={1.9} />
                <span>{item.label}</span>
                {selected && !collapsed ? <ChevronRight size={16} className="nav-chevron" /> : null}
              </Link>
            );
          })}

          <p className="nav-caption" style={{ marginTop: '14px' }}>System</p>
          {extraNav.filter((item) => item.href !== '/settings' || canAccess(user.role, 'settings.view')).map((item) => {
            const Icon = item.icon;
            const selected = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`nav-item ${selected ? 'active' : ''}`} title={collapsed ? item.label : undefined}>
                <Icon size={20} strokeWidth={1.9} />
                <span>{item.label}</span>
                {selected && !collapsed ? <ChevronRight size={16} className="nav-chevron" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="network-card">
            <div className="network-card-icon"><Container size={20} /></div>
            <div className="network-card-copy">
              <strong>Island Network</strong>
              <span><i /> Sri Lanka Hubs Live</span>
            </div>
          </div>
          {canAccess(user.role, 'settings.view') && (
            <Link href="/settings" onClick={() => setMobileOpen(false)} className={`nav-item muted sidebar-action ${pathname.startsWith('/settings') ? 'active' : ''}`}>
              <Settings size={20} />
              <span>Settings</span>
            </Link>
          )}
          <button className="collapse-btn" onClick={toggleCollapsed} type="button">
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span>{collapsed ? 'Expand' : 'Collapse sidebar'}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <div className="main-frame">
        <header className="topbar glass">
          <div className="topbar-left">
            <button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
            <div className="breadcrumb"><span>GlobalTrade</span><ChevronRight size={14} /><strong>{active.label}</strong></div>
          </div>

          <div className="topbar-actions">
            <div className="global-search-wrap">
              <Search size={17} />
              <input ref={searchRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search shipments, orders, SKUs, settings..." aria-label="Global search" />
              <kbd><Command size={12} />K</kbd>
              {query && (
                <div className="search-results glass">
                  {results.length ? results.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button key={`${item.href}-${index}`} onClick={() => go(item.href)}>
                        <span className="search-result-icon"><Icon size={17} /></span>
                        <span className="search-result-copy"><strong>{item.label}</strong><small>{item.meta}</small></span>
                        <ChevronRight size={15} />
                      </button>
                    );
                  }) : <div className="search-empty">No result matches “{query}”</div>}
                </div>
              )}
            </div>

            <div className="dropdown-wrap">
              <button className="icon-btn badge-btn" onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }} aria-label={`${unreadCount} unread notifications`}>
                <Bell size={19} />{unreadCount > 0 && <span className="notification-dot" />}
              </button>
              {notifOpen && (
                <div className="dropdown-panel notification-panel glass">
                  <div className="dropdown-head">
                    <div><strong>Notifications</strong><span>{unreadCount ? `${unreadCount} unread updates` : 'You are all caught up'}</span></div>
                    <button onClick={() => setReadNotifications(notificationItems.map((n) => n.id))} disabled={!unreadCount}>Mark all read</button>
                  </div>
                  <div className="notification-list">
                    {notificationItems.length ? notificationItems.map((n) => {
                      const Icon = n.icon;
                      const isRead = readNotifications.includes(n.id);
                      return (
                        <button className={`notification-item ${isRead ? 'is-read' : ''}`} key={n.id} onClick={() => toggleNotification(n.id)}>
                          <span className={`notification-icon ${n.tone}`}><Icon size={17} /></span>
                          <span><strong>{n.title}</strong><small>{n.time}</small></span>
                        </button>
                      );
                    }) : <div className="search-empty">No active operational alerts.</div>}
                  </div>
                  <Link href="/preferences" className="dropdown-footer" onClick={() => setNotifOpen(false)}>Notification preferences <ChevronRight size={15} /></Link>
                </div>
              )}
            </div>

            <div className="dropdown-wrap profile-wrap">
              <button className="profile-button" onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}>
                <span className="avatar">{`${user.firstName?.[0] || 'U'}${user.lastName?.[0] || 'G'}`}</span>
                <span className="profile-meta"><strong>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'SCMS User'}</strong><small>{labelForRole(user.role)}</small></span>
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="dropdown-panel profile-panel glass">
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--line)', marginBottom: '6px' }}>
                    <strong style={{ display: 'block', fontSize: '12px', color: '#f1f5f9' }}>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'SCMS User'}</strong>
                    <small style={{ display: 'block', fontSize: '10px', color: '#7b8fa7', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</small>
                    <small style={{ display: 'block', fontSize: '9px', color: '#10b981', marginTop: '2px', fontWeight: 600 }}>{user.primaryHub || user.hub || 'No hub assigned'}</small>
                  </div>
                  <Link href="/account" className="dropdown-nav-btn" onClick={() => setProfileOpen(false)}>
                    <CircleUserRound size={17} /> My account
                  </Link>
                  <Link href="/preferences" className="dropdown-nav-btn" onClick={() => setProfileOpen(false)}>
                    <Sliders size={17} /> Preferences
                  </Link>
                  {canAccess(user.role, 'settings.view') && (
                    <Link href="/settings" className="dropdown-nav-btn" onClick={() => setProfileOpen(false)}>
                      <Building2 size={17} /> System Settings
                    </Link>
                  )}
                  <div className="dropdown-sep" />
                  <button
                    type="button"
                    className="dropdown-nav-btn danger-text"
                    onClick={() => {
                      setProfileOpen(false);
                      void handleLogOut();
                    }}
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <LogOut size={17} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="content">{children}</main>
        </div>
      </div>
    </AuthContextProvider>
  );
}
