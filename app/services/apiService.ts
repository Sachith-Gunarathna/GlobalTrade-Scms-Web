import type {
  ApiUser,
  CustomsDocument,
  DashboardResponse,
  InventoryItem,
  MonitoringSnapshot,
  Order,
  Shipment,
  Supplier
} from '@/types';

export const BASE_URL = process.env.NEXT_PUBLIC_SCMS_API_URL ?? 'http://localhost:8080/Global-Trade-Scms/v1';

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

type ErrorBody = {
  message?: string;
  error?: string;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers ?? {})
    },
    credentials: 'include',
    cache: init.cache ?? 'no-store'
  });

  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const errorBody = typeof body === 'object' && body !== null ? body as ErrorBody : {};
    const message = errorBody.message || errorBody.error || (typeof body === 'string' && body) || `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return body as T;
}

export async function loginUser(credentials: { email: string; password: string; rememberMe?: boolean }) {
  return request<{ success: boolean; user: ApiUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: credentials.email.trim(), password: credentials.password })
  });
}

export async function registerUser(userData: Record<string, unknown>) {
  return request<{ success: boolean; user: ApiUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

export async function verifySession() {
  return request<{ success: boolean; user: ApiUser }>('/auth/verify');
}

export async function userLogOut() {
  return request<{ success: boolean }>('/auth/logout', { method: 'POST' });
}

export async function updateProfileToBackend(profileData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  hub?: string;
  organization?: string;
}) {
  return request<{ success: boolean; user: ApiUser }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<{ success: boolean; message: string }>('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export async function getDashboardData() {
  return request<DashboardResponse>('/dashboard');
}

export async function getAllShipments() {
  return request<Shipment[]>('/shipments');
}

export async function createShipment(data: {
  trackingNumber: string;
  origin: string;
  destination: string;
  status: string;
  estimatedDeliveryDate: string;
  carrier: string;
  vessel: string;
  progress: number;
  value: number;
  weight: string;
  vendorId: number;
}) {
  return request<Shipment>('/shipments', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateShipmentStatus(id: number, status: string) {
  return request<Shipment>(`/shipments/${id}/status?value=${encodeURIComponent(status)}`, { method: 'PUT' });
}

export async function deleteShipment(id: number) {
  return request<void>(`/shipments/${id}`, { method: 'DELETE' });
}

export async function getAllInventory() {
  return request<InventoryItem[]>('/inventory');
}

export const getAllInvetory = getAllInventory;

export async function createInventoryItem(data: {
  sku: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  warehouse: string;
  value: number;
  capacity: number;
  vendorId?: number;
}) {
  return request<InventoryItem>('/inventory', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateInventoryQuantity(id: number, quantity: number) {
  return request<InventoryItem>(`/inventory/${id}/quantity?value=${quantity}`, { method: 'PUT' });
}

export async function deleteInventoryItem(id: number) {
  return request<void>(`/inventory/${id}`, { method: 'DELETE' });
}

export async function getAllVendors() {
  return request<Supplier[]>('/vendors');
}

export async function createVendor(data: {
  code?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  category: string;
  rating: number;
  onTimeRate: number;
  activeOrders: number;
}) {
  return request<Supplier>('/vendors', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateVendorScore(id: number, score: number) {
  return request<Supplier>(`/vendors/${id}/score?value=${score}`, { method: 'PUT' });
}

export async function deleteVendor(id: number) {
  return request<void>(`/vendors/${id}`, { method: 'DELETE' });
}

export async function getAllOrders() {
  return request<Order[]>('/orders');
}

export async function createOrder(data: {
  orderNumber: string;
  customer: string;
  itemCount: number;
  totalAmount: number;
  status: string;
  orderDate: string;
  region: string;
  contact: string;
  vendorId?: number;
}) {
  return request<Order>('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateOrderStatus(id: number, status: string) {
  return request<Order>(`/orders/${id}/status?value=${encodeURIComponent(status)}`, { method: 'PUT' });
}

export async function getAllCustomsDocs() {
  return request<CustomsDocument[]>('/customs');
}

export async function createCustomsDocument(data: {
  documentNumber: string;
  documentType: string;
  status: string;
  deadline: string;
  notes: string;
  shipmentId: number;
}) {
  return request<CustomsDocument>('/customs', { method: 'POST', body: JSON.stringify(data) });
}

export async function approveCustomsDocument(id: number, notes: string) {
  return request<CustomsDocument>(`/customs/${id}/approve?notes=${encodeURIComponent(notes)}`, { method: 'PUT' });
}

export async function rejectCustomsDocument(id: number, notes: string) {
  return request<CustomsDocument>(`/customs/${id}/reject?notes=${encodeURIComponent(notes)}`, { method: 'PUT' });
}

export async function releaseCustomsShipment(id: number) {
  return request<CustomsDocument>(`/customs/${id}/release`, { method: 'POST' });
}

export async function getMonitoringData() {
  return request<MonitoringSnapshot>('/monitoring');
}

export async function getRoutePriorities() {
  return request<Record<string, number>>('/monitoring/routes');
}

export async function applyRoutePriorities() {
  return request<{ updated: number }>('/monitoring/routes/apply', { method: 'POST' });
}

export async function getUserPreferences(userEmail: string) {
  return request<{ success: boolean; preferences: Record<string, unknown> }>(`/users/${encodeURIComponent(userEmail)}/preferences`);
}

export async function updateUserPreferences(userEmail: string, preferences: object) {
  return request<{ success: boolean; preferences: Record<string, unknown> }>(`/users/${encodeURIComponent(userEmail)}/preferences`, {
    method: 'PUT',
    body: JSON.stringify(preferences)
  });
}
