'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getUserPreferences, updateUserPreferences } from '@/app/services/apiService';

export type ThemeMode = 'glass-dark' | 'oled' | 'slate';

export interface UserPreferences {

  themeMode: ThemeMode;
  compactRows: boolean;
  enableMapRadar: boolean;
  enableAnimations: boolean;


  currency: string;
  language: string;
  timezone: string;
  dateFormat: string;
  weightUnit: string;


  notifShipmentDelays: boolean;
  notifLowStock: boolean;
  notifCustomsCleared: boolean;
  notifWeeklyDigest: boolean;
  soundAlerts: boolean;

  autoRefreshRate: string;
  defaultView: string;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  themeMode: 'glass-dark',
  compactRows: false,
  enableMapRadar: true,
  enableAnimations: true,

  currency: 'LKR',
  language: 'en',
  timezone: 'Asia/Colombo',
  dateFormat: 'DD/MM/YYYY',
  weightUnit: 'kg',

  notifShipmentDelays: true,
  notifLowStock: true,
  notifCustomsCleared: true,
  notifWeeklyDigest: true,
  soundAlerts: false,

  autoRefreshRate: '30s',
  defaultView: 'overview'
};

const PREFERENCES_STORAGE_KEY = 'globaltrade_user_preferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  isSaving: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<{ success: boolean; error?: string }>;
  setThemeMode: (mode: ThemeMode) => void;
  setCompactRows: (val: boolean) => void;
  setEnableMapRadar: (val: boolean) => void;
  setEnableAnimations: (val: boolean) => void;
  resetPreferences: () => Promise<void>;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  const applyDOMPreferences = (prefs: UserPreferences) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-theme', prefs.themeMode);
    root.setAttribute('data-animations', prefs.enableAnimations ? 'true' : 'false');
    root.setAttribute('data-compact', prefs.compactRows ? 'true' : 'false');
    root.setAttribute('data-map-radar', prefs.enableMapRadar ? 'true' : 'false');
  };


  useEffect(() => {
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        let loadedPrefs: UserPreferences | null = null;


        if (user && user.id) {
          const apiData = await getUserPreferences(user.id);
          if (apiData && apiData.preferences) {
            loadedPrefs = { ...DEFAULT_PREFERENCES, ...apiData.preferences };
          }
        }


        if (!loadedPrefs) {
          const localStored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
          if (localStored) {
            try {
              const parsed = JSON.parse(localStored);
              loadedPrefs = { ...DEFAULT_PREFERENCES, ...parsed };
            } catch (e) {
              console.error('Error parsing local preferences', e);
            }
          }
        }

        const finalPrefs = loadedPrefs || DEFAULT_PREFERENCES;
        setPreferences(finalPrefs);
        applyDOMPreferences(finalPrefs);
      } catch (err) {
        console.error('Error loading preferences', err);
        applyDOMPreferences(DEFAULT_PREFERENCES);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);


  const updatePreferences = async (
    updates: Partial<UserPreferences>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsSaving(true);
    try {
      const updated: UserPreferences = { ...preferences, ...updates };
      setPreferences(updated);
      applyDOMPreferences(updated);


      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));


      const userId = user?.id || 'demo-1';
      await updateUserPreferences(userId, updated);

      return { success: true };
    } catch (err: any) {
      console.error('Failed to sync preferences to backend', err);
      return { success: false, error: err.message || 'Failed to save preferences' };
    } finally {
      setIsSaving(false);
    }
  };

  const setThemeMode = (mode: ThemeMode) => {
    updatePreferences({ themeMode: mode });
  };

  const setCompactRows = (val: boolean) => {
    updatePreferences({ compactRows: val });
  };

  const setEnableMapRadar = (val: boolean) => {
    updatePreferences({ enableMapRadar: val });
  };

  const setEnableAnimations = (val: boolean) => {
    updatePreferences({ enableAnimations: val });
  };

  const resetPreferences = async () => {
    await updatePreferences(DEFAULT_PREFERENCES);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        isLoading,
        isSaving,
        updatePreferences,
        setThemeMode,
        setCompactRows,
        setEnableMapRadar,
        setEnableAnimations,
        resetPreferences
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
