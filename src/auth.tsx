import * as React from "react";

import {
  type AuthLoginCreateMutationRequest,
  type RestAuthDetail,
  useAuthLoginCreate,
  useAuthLogoutCreate,
} from "./api";

type User = {
  access: string;
  refresh?: string;
} | null;

export interface AuthContext {
  isAuthenticated: boolean;
  login: (payload: AuthLoginCreateMutationRequest) => Promise<void>;
  logout: () => Promise<RestAuthDetail>;
  userObj: User;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export const LOCAL_STORAGE_USER_KEY = "tanstack.auth.user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const userObj: User = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_USER_KEY) ?? "null"
  );
  const isAuthenticated = !!userObj?.access;

  const { mutateAsync: loginAsync } = useAuthLoginCreate();
  const { mutateAsync: logoutAsync } = useAuthLogoutCreate();

  const login = React.useCallback(
    async (payload: AuthLoginCreateMutationRequest) => {
      return loginAsync({ data: payload }).then((res) => {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res));
      });
    },
    []
  );

  const logout = React.useCallback(async (): Promise<RestAuthDetail> => {
    localStorage.clear();
    
    try {
      await logoutAsync();
      return { detail: 'Successfully logged out.' };
    } catch (error) {
      console.error('Logout error:', error);
      return { detail: 'Logged out' };
    }
  }, [logoutAsync]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userObj, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
