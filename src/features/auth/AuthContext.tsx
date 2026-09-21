import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { addResponseInterceptor } from "../../services/apiClient";
import { authService } from "./auth.service";
import type { AuthSession, LoginInput } from "./auth.types";

const sessionKey = "auth_session";
const tokenKey = "auth_token";
const tenantIdKey = "tenant_id";

function readStoredSession(): AuthSession | null {
  try {
    const stored = localStorage.getItem(sessionKey);
    return stored ? (JSON.parse(stored) as AuthSession) : null;
  } catch {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(tenantIdKey);
    return null;
  }
}

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);

  const clearSession = useCallback(() => {
    localStorage.removeItem(sessionKey);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(tenantIdKey);
    setSession(null);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const nextSession = await authService.login(input);
    localStorage.setItem(tokenKey, nextSession.token);
    localStorage.setItem(sessionKey, JSON.stringify(nextSession));
    localStorage.setItem(tenantIdKey, nextSession.tenantId ?? "");
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(
    () =>
      addResponseInterceptor((response) => {
        if (response.status === 401) clearSession();
        return response;
      }),
    [clearSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ session, isAuthenticated: session !== null, login, logout }),
    [login, logout, session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
