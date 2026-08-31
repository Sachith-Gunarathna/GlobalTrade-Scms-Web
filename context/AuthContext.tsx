'use client';

import { createContext, useContext } from 'react';
import type { ApiUser } from '@/types';

const AuthContext = createContext<ApiUser | null>(null);

export const AuthContextProvider = AuthContext.Provider;

export function useCurrentUser() {
  return useContext(AuthContext);
}
