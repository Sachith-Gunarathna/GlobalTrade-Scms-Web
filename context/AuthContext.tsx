'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '@/app/services/apiService';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  hub: string;
  organization: string;
  phone: string;
  avatar: string;
  token?: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'demo-1',
    firstName: 'Alex',
    lastName: 'Grant',
    name: 'Alex Grant',
    email: 'alex.grant@globaltrade.lk',
    role: 'Operations Director & Admin',
    title: 'Operations Director & SCMS Lead',
    department: 'Global Supply Chain & Logistics',
    hub: 'Colombo HQ (Port of Colombo)',
    organization: 'GlobalTrade SCMS Lanka (Pvt) Ltd',
    phone: '+94 77 182 9400',
    avatar: 'AG',
    token: 'gt_demo_token_alex_grant_2026'
  },
  {
    id: 'demo-2',
    firstName: 'Sanduni',
    lastName: 'Fernando',
    name: 'Sanduni Fernando',
    email: 'sanduni.f@globaltrade.lk',
    role: 'Procurement & Inventory Lead',
    title: 'Senior Inventory Manager',
    department: 'Procurement & Sourcing',
    hub: 'Kandy Inland Depot',
    organization: 'GlobalTrade SCMS Lanka (Pvt) Ltd',
    phone: '+94 71 492 1083',
    avatar: 'SF',
    token: 'gt_demo_token_sanduni_f_2026'
  },
  {
    id: 'demo-3',
    firstName: 'Nimal',
    lastName: 'Perera',
    name: 'Nimal Perera',
    email: 'nimal.p@globaltrade.lk',
    role: 'Port Logistics Dispatcher',
    title: 'Senior Dispatch Specialist',
    department: 'Fleet & Corridor Logistics',
    hub: 'Port of Colombo Terminal 2',
    organization: 'GlobalTrade SCMS Lanka (Pvt) Ltd',
    phone: '+94 77 348 2910',
    avatar: 'NP',
    token: 'gt_demo_token_nimal_p_2026'
  },
  {
    id: 'demo-4',
    firstName: 'Tharindu',
    lastName: 'Silva',
    name: 'Tharindu Silva',
    email: 'tharindu.s@globaltrade.lk',
    role: 'Customs Clearance Broker',
    title: 'Certified Customs Specialist',
    department: 'Customs & Regulatory Compliance',
    hub: 'Hambantota International Port Hub',
    organization: 'GlobalTrade SCMS Lanka (Pvt) Ltd',
    phone: '+94 76 902 4415',
    avatar: 'TS',
    token: 'gt_demo_token_tharindu_s_2026'
  }
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    organization: string;
    role: string;
    department: string;
    hub: string;
  }) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (userId: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'globaltrade_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEMO_USERS[0]); // Default to Alex Grant
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading stored auth user', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (newUser: AuthUser | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Check matching demo user first
      const matchedDemo = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedDemo) {
        if (rememberMe) persistUser(matchedDemo);
        else setUser(matchedDemo);
        return { success: true };
      }

      // 2. Call backend API service
      const apiResult = await apiLoginUser({ email, password });
      if (apiResult && apiResult.user) {
        const loggedUser: AuthUser = {
          id: apiResult.user.id || `usr-${Date.now()}`,
          firstName: apiResult.user.firstName || email.split('@')[0],
          lastName: apiResult.user.lastName || '',
          name: apiResult.user.name || `${apiResult.user.firstName || ''} ${apiResult.user.lastName || ''}`.trim() || email.split('@')[0],
          email: apiResult.user.email || email,
          role: apiResult.user.role || 'Logistics Specialist',
          title: apiResult.user.title || 'Supply Chain Officer',
          department: apiResult.user.department || 'Operations',
          hub: apiResult.user.hub || 'Colombo HQ',
          organization: apiResult.user.organization || 'GlobalTrade Lanka',
          phone: apiResult.user.phone || '+94 77 000 0000',
          avatar: (apiResult.user.firstName?.[0] || email[0] || 'U').toUpperCase() + ((apiResult.user.lastName?.[0] || email[1] || '').toUpperCase()),
          token: apiResult.token || `token-${Date.now()}`
        };
        if (rememberMe) persistUser(loggedUser);
        else setUser(loggedUser);
        return { success: true };
      }

      // 3. Fallback seamless login for any valid email format
      if (email.includes('@') && password.length >= 4) {
        const parts = email.split('@')[0].split('.');
        const first = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Trade';
        const last = parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : 'Officer';
        const fallbackUser: AuthUser = {
          id: `usr-${Date.now()}`,
          firstName: first,
          lastName: last,
          name: `${first} ${last}`,
          email: email.trim(),
          role: 'Logistics Operations Officer',
          title: 'Supply Chain Specialist',
          department: 'Fleet & Cargo Dispatch',
          hub: 'Port of Colombo Hub, Sri Lanka',
          organization: 'GlobalTrade SCMS Lanka',
          phone: '+94 77 123 4567',
          avatar: `${first[0] || 'U'}${last[0] || 'O'}`.toUpperCase(),
          token: `gt_token_${Date.now()}`
        };
        if (rememberMe) persistUser(fallbackUser);
        else setUser(fallbackUser);
        return { success: true };
      }

      return { success: false, error: 'Invalid email address or password credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An error occurred during authentication.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    organization: string;
    role: string;
    department: string;
    hub: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Call backend API service
      const apiResult = await apiRegisterUser(data);

      const newUser: AuthUser = {
        id: apiResult?.user?.id || `usr-${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email.trim(),
        role: data.role || 'Logistics Specialist',
        title: `${data.role} (${data.department})`,
        department: data.department || 'Operations',
        hub: data.hub || 'Colombo HQ',
        organization: data.organization || 'GlobalTrade SCMS Partner',
        phone: data.phone || '+94 77 000 0000',
        avatar: `${data.firstName[0] || 'U'}${data.lastName[0] || 'N'}`.toUpperCase(),
        token: apiResult?.token || `gt_token_${Date.now()}`
      };

      persistUser(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (userId: string) => {
    setIsLoading(true);
    const target = DEMO_USERS.find((u) => u.id === userId) || DEMO_USERS[0];
    persistUser(target);
    setIsLoading(false);
  };

  const logout = () => {
    persistUser(null);
  };

  const updateUserProfile = (data: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
