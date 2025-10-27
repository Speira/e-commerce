import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useMutation } from '@apollo/client/react';

import { AuthLoading } from './elements/AuthLoading';
import { REFRESH_AUTH_TOKEN, type RefreshAuthTokenResponse } from './requests';
import { type AuthUser } from './types';

export interface AuthState {
  authRefreshError?: string;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  onAfterLogin: (nextAuthUser: AuthUser, nextToken: string) => void;
  onAfterLogout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = 'auth-token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [refreshAuthToken, { data, loading, error }] =
    useMutation<RefreshAuthTokenResponse>(REFRESH_AUTH_TOKEN);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      refreshAuthToken({ variables: { token } });
    }
  }, [refreshAuthToken]);

  useEffect(() => {
    if (data) {
      localStorage.setItem(TOKEN_KEY, data.refreshAuthToken.token);
    }
  }, [data]);

  const value = useMemo(
    () => ({
      authRefreshError: error?.message,
      authUser,
      isAuthenticated,
      onAfterLogin(nextAuthUser: AuthUser, nextToken: string) {
        setAuthUser(nextAuthUser);
        setIsAuthenticated(true);
        localStorage.setItem(TOKEN_KEY, nextToken);
      },
      onAfterLogout() {
        setAuthUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(TOKEN_KEY);
      },
    }),
    [authUser, isAuthenticated, error?.message],
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <AuthLoading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
