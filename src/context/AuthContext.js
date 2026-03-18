import { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const user = null;
  const loading = false;

  // Firebase auth logic has been deactivated to save bundle size.
  // Restore onAuthStateChanged here when user authentication is needed again.

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
