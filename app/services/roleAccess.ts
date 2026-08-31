export type RoleCode = 'ADMIN' | 'LOGISTICS_COORDINATOR' | 'WAREHOUSE_MANAGER' | 'CUSTOMS_AGENT' | 'VENDOR_REP';

export type Permission =
  | 'dashboard.view'
  | 'shipments.view'
  | 'shipments.create'
  | 'shipments.status'
  | 'shipments.delete'
  | 'orders.view'
  | 'orders.create'
  | 'orders.status'
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.adjust'
  | 'inventory.delete'
  | 'suppliers.view'
  | 'suppliers.create'
  | 'suppliers.score'
  | 'suppliers.delete'
  | 'customs.view'
  | 'customs.create'
  | 'customs.decision'
  | 'analytics.view'
  | 'monitoring.view'
  | 'monitoring.routes'
  | 'settings.view';

const permissions: Record<RoleCode, Permission[]> = {
  ADMIN: [
    'dashboard.view','shipments.view','shipments.create','shipments.status','shipments.delete',
    'orders.view','orders.create','orders.status','inventory.view','inventory.create','inventory.adjust','inventory.delete',
    'suppliers.view','suppliers.create','suppliers.score','suppliers.delete','customs.view','customs.create','customs.decision',
    'analytics.view','monitoring.view','monitoring.routes','settings.view'
  ],
  LOGISTICS_COORDINATOR: [
    'dashboard.view','shipments.view','shipments.create','shipments.status','shipments.delete',
    'orders.view','orders.create','orders.status','inventory.view','inventory.create','inventory.adjust',
    'suppliers.view','suppliers.create','suppliers.score','suppliers.delete','customs.view','customs.create',
    'analytics.view','monitoring.view','monitoring.routes'
  ],
  WAREHOUSE_MANAGER: [
    'dashboard.view','shipments.view','orders.view','inventory.view','inventory.create','inventory.adjust','inventory.delete',
    'suppliers.view','analytics.view','monitoring.view'
  ],
  CUSTOMS_AGENT: [
    'dashboard.view','shipments.view','shipments.status','suppliers.view','customs.view','customs.create','customs.decision',
    'analytics.view','monitoring.view'
  ],
  VENDOR_REP: [
    'dashboard.view','shipments.view','orders.view','inventory.view','suppliers.view','customs.view','analytics.view'
  ]
};

export const roleLabels: Record<RoleCode, string> = {
  ADMIN: 'System Administrator',
  LOGISTICS_COORDINATOR: 'Logistics Coordinator',
  WAREHOUSE_MANAGER: 'Warehouse Manager',
  CUSTOMS_AGENT: 'Customs Agent',
  VENDOR_REP: 'Vendor Representative'
};

export function normalizeRole(role?: string | null): RoleCode | null {
  if (!role) return null;
  const value = role.trim().toUpperCase() as RoleCode;
  return value in permissions ? value : null;
}

export function canAccess(role: string | null | undefined, permission: Permission): boolean {
  const normalized = normalizeRole(role);
  return normalized ? permissions[normalized].includes(permission) : false;
}

export function labelForRole(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  return normalized ? roleLabels[normalized] : 'SCMS User';
}
