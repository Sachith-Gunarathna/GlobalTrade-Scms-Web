export type ShipmentStatus = 'In Transit' | 'Delayed' | 'Delivered' | 'Pending';

export type Shipment = {
  id: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  carrier: string;
  vessel: string;
  progress: number;
  value: number;
  weight: string;
  updated: string;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
  region: string;
  contact: string;
};

export type InventoryItem = {
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  warehouse: string;
  value: number;
  capacity: number;
};

export type Supplier = {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  rating: number;
  activeOrders: number;
  email: string;
  phone: string;
  onTimeRate: number;
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
