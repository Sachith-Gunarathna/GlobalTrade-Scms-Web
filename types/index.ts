export type ShipmentStatus = 'In Transit' | 'Delayed' | 'Delivered' | 'Pending' | 'Cancelled' | 'Customs Hold';

export type Shipment = {
  databaseId?: number;
  id: string;
  trackingNumber?: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  estimatedDeliveryDate?: string | null;
  carrier: string;
  vessel: string;
  progress: number;
  value: number;
  weight: string;
  updated: string;
  vendorId?: number;
  vendorName?: string;
  routePriority?: number;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  databaseId?: number;
  id: string;
  orderNumber?: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
  region: string;
  contact: string;
  vendorId?: number;
  vendorName?: string;
};

export type InventoryItem = {
  databaseId?: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  warehouse: string;
  value: number;
  unitValue?: number;
  capacity: number;
  vendorId?: number;
  vendorName?: string;
  updatedAt?: string;
};

export type Supplier = {
  databaseId?: number;
  id: string;
  code?: string;
  name: string;
  country: string;
  region: string;
  category: string;
  rating: number;
  performanceScore?: number;
  activeOrders: number;
  email: string;
  phone: string;
  onTimeRate: number;
  status?: string;
};

export type CustomsDocument = {
  id: number;
  documentNumber: string;
  documentType: string;
  status: string;
  deadline: string | null;
  notes: string;
  shipmentId?: number;
  trackingNumber?: string;
  origin?: string;
  destination?: string;
  updatedAt?: string | null;
};

export type ApiUser = {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  mobileNumber?: string;
  organization?: string;
  organizationOrCompany?: string;
  hub?: string;
  primaryHub?: string;
  department?: string;
  role: string;
  title?: string;
};

export type DashboardKpis = {
  totalShipments: number;
  inTransit: number;
  lowStockItems: number;
  totalSuppliers: number;
};

export type DashboardShipmentStatus = {
  pending: number;
  inTransit: number;
  delayed: number;
  delivered: number;
};

export type DashboardAlert = {
  type: string;
  category: string;
  referenceId: number | string | null;
  title: string;
  message: string;
};

export type DashboardShipment = {
  id: number | string;
  trackingNumber: number | string;
  origin: string;
  destination: string;
  status: string;
  estimatedDeliveryDate: string | null;
  vendor: string;
};

export type DashboardActivity = {
  id: number | string;
  action: string;
  methodName: string;
  timestamp: string | null;
  performedBy: string | null;
};

export type DashboardResponse = {
  kpis: DashboardKpis;
  shipmentStatus: DashboardShipmentStatus;
  alerts: DashboardAlert[];
  recentShipments: DashboardShipment[];
  recentActivity: DashboardActivity[];
};

export type PerformanceMetric = {
  id: number;
  type: string;
  operation: string;
  durationMs: number;
  success: boolean;
  recordedAt: string | null;
};

export type AuditEntry = {
  id: number;
  action: string;
  component: string;
  method: string;
  performedBy: string | null;
  durationMs: number | null;
  success: boolean;
  detail: string | null;
  timestamp: string | null;
};

export type SupplyAlert = {
  id: number;
  type: string;
  category: string;
  referenceKey: string | null;
  title: string;
  message: string;
  createdAt: string | null;
};

export type TimerSnapshot = {
  info: string;
  nextTimeout: string | null;
  persistent: boolean;
};

export type MonitoringSnapshot = {
  averageMethodDurationMs: number;
  metrics: PerformanceMetric[];
  audit: AuditEntry[];
  alerts: SupplyAlert[];
  timers: TimerSnapshot[];
};
