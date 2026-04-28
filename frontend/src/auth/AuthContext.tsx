import { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  userName: string | null;
  setAuth: (token: string, refreshToken: string, userName: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = 'ca_token';
const REFRESH_KEY = 'ca_refresh';
const USER_KEY = 'ca_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(REFRESH_KEY));
  const [userName, setUserName] = useState<string | null>(() => localStorage.getItem(USER_KEY));

  const value = useMemo(
    () => ({
      token,
      refreshToken,
      userName,
      setAuth: (accessToken: string, newRefreshToken: string, newUserName: string) => {
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        setUserName(newUserName);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_KEY, newRefreshToken);
        localStorage.setItem(USER_KEY, newUserName);
      },
      logout: () => {
        setToken(null);
        setRefreshToken(null);
        setUserName(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
      },
    }),
    [refreshToken, token, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
