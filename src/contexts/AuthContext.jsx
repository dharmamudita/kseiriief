import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as storeLogin, logoutUser as storeLogout, getCurrentUser, initializeData } from '../data/store';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initializeData();
      const u = getCurrentUser();
      if (u) setUser(u);
      setLoading(false);
    };
    init();
  }, []);

  const login = (npm, password) => {
    const u = storeLogin(npm, password);
    if (u) { setUser(u); return { success: true }; }
    return { success: false, error: 'NPM atau Password salah' };
  };

  const logout = () => { storeLogout(); setUser(null); };
  const isAdmin = user?.role === 'admin';

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
