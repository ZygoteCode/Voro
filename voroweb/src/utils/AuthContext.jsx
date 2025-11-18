import { createContext, useState, useEffect, useCallback, useMemo } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedSecretKey = localStorage.getItem("secretKey");

    if (savedToken) setToken(savedToken);
    if (savedSecretKey) setSecretKey(savedSecretKey);

    setLoading(false);
  }, []);

  const login = useCallback((newToken, newSecretKey) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("secretKey", newSecretKey);

    setToken(newToken);
    setSecretKey(newSecretKey);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("secretKey");

    setToken(null);
    setSecretKey(null);
  }, []);

  const value = useMemo(() => ({
    token,
    secretKey,
    loading,
    login,
    logout,
  }), [token, secretKey, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}