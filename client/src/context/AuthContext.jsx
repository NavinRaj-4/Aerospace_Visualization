import React, { createContext, useContext, useState, useEffect } from 'react';
import { AeroApi } from '../services/api';
import { audioEngine } from '../services/audioEngine';

const AuthContext = createContext(null);

export const ROLE_DEFINITIONS = {
  admin: {
    title: 'Flight Test Director',
    clearance: 'LEVEL 5 - TOP SECRET / FLIGHT DIRECTOR',
    badgeClass: 'text-rose-400 bg-rose-950/70 border-rose-500/50 shadow-rose-glow',
    color: '#f43f5e',
    description: 'Supreme operational authority over all wind tunnel facilities, flight records, security clearances, and system telemetry calibration.',
    can: ['ALL', 'MANAGE_USERS', 'ADMIN_CONSOLE', 'CREATE_MODEL', 'DELETE_MODEL', 'DELETE_RUN', 'UPLOAD_DATASET', 'EXPORT_DATASET', 'RUN_SWEEP', 'SAVE_RUN', 'MANAGE_FACILITY', 'EMERGENCY_SCRAM', 'VIEW_AUDIT']
  },
  engineer: {
    title: 'Senior Aerodynamicist',
    clearance: 'LEVEL 4 - SECRET / SCIENTIFIC CALIBRATION',
    badgeClass: 'text-cyan-300 bg-cyan-950/70 border-cyan-500/50 shadow-cyan-glow',
    color: '#06b6d4',
    description: 'Calibrate flight test runs, design novel airfoil models, execute high-speed AoA sweeps, and ingest scientific flight test databases.',
    can: ['CREATE_MODEL', 'DELETE_RUN', 'UPLOAD_DATASET', 'EXPORT_DATASET', 'RUN_SWEEP', 'SAVE_RUN', 'VIEW_DATA']
  },
  operator: {
    title: 'Wind Tunnel Operator',
    clearance: 'LEVEL 3 - CONFIDENTIAL / CHAMBER OPERATIONS',
    badgeClass: 'text-amber-400 bg-amber-950/70 border-amber-500/50 shadow-amber-glow',
    color: '#f59e0b',
    description: 'Direct control over test chamber drive motors, fan RPM, cryogenic cooling circuits, and manual Emergency Scram safeties.',
    can: ['MANAGE_FACILITY', 'EMERGENCY_SCRAM', 'RUN_SWEEP', 'SAVE_RUN', 'LOG_RUN', 'VIEW_DATA', 'EXPORT_DATASET']
  },
  viewer: {
    title: 'Research Analyst',
    clearance: 'LEVEL 1 - UNCLASSIFIED / OBSERVER',
    badgeClass: 'text-emerald-400 bg-emerald-950/70 border-emerald-500/50 shadow-emerald-glow',
    color: '#10b981',
    description: 'Read-only observer status. Full access to 3D wind tunnel visualizations, aerodynamic polar charts, and public flight test logs.',
    can: ['VIEW_DATA', 'EXPORT_DATASET']
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  const [isLoginPageOpen, setIsLoginPageOpen] = useState(false);

  // Initial session restoration
  useEffect(() => {
    async function initSession() {
      setIsLoading(true);
      try {
        const [me, accounts] = await Promise.all([
          AeroApi.getMe(),
          AeroApi.getDemoAccounts()
        ]);
        if (accounts) setDemoAccounts(accounts);
        if (me) {
          setUser(me);
          setToken(localStorage.getItem('aero_auth_token'));
          setIsLoginPageOpen(false);
        } else {
          // No active session: show Login Page
          setUser(null);
          setToken(null);
          setIsLoginPageOpen(true);
        }
      } catch (err) {
        console.warn('[AuthContext] Session init error:', err);
        setIsLoginPageOpen(true);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, []);

  const login = async (email, password) => {
    setAuthError('');
    try {
      const data = await AeroApi.login(email, password);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      setIsLoginPageOpen(false);
      audioEngine.playClick();
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Authentication error');
      throw err;
    }
  };

  const register = async (userData) => {
    setAuthError('');
    try {
      const data = await AeroApi.register(userData);
      setUser(data.user);
      setToken(data.token);
      setAuthModalOpen(false);
      setIsLoginPageOpen(false);
      audioEngine.playClick();
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Registration error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await AeroApi.logout();
    } catch (e) {}
    setUser(null);
    setToken(null);
    setUserProfileOpen(false);
    setIsLoginPageOpen(true);
    audioEngine.playClick();
  };

  const quickLogin = async (roleName) => {
    const acct = demoAccounts.find(a => a.role === roleName);
    if (!acct) return;
    try {
      const user = await login(acct.email, acct.password);
      setIsLoginPageOpen(false);
      return user;
    } catch (e) {
      // Direct mock switch if network fails
      const fallbackUser = {
        id: `USR-${roleName.toUpperCase()}`,
        name: acct.name,
        email: acct.email,
        role: roleName,
        callsign: acct.callsign,
        department: acct.department
      };
      setUser(fallbackUser);
      setAuthModalOpen(false);
      setIsLoginPageOpen(false);
      audioEngine.playClick();
      return fallbackUser;
    }
  };

  // Permission helpers
  const currentRole = user?.role || 'viewer';
  const roleInfo = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.viewer;

  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return roles.includes(user.role);
  };

  const can = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return roleInfo.can.includes(permission) || roleInfo.can.includes('ALL');
  };

  const value = {
    user,
    token,
    role: currentRole,
    roleInfo,
    isAuthenticated: !!user,
    isLoading,
    isLoginPageOpen,
    setIsLoginPageOpen,
    demoAccounts,
    authModalOpen,
    setAuthModalOpen,
    userProfileOpen,
    setUserProfileOpen,
    authError,
    setAuthError,
    login,
    register,
    logout,
    quickLogin,
    hasRole,
    can
  };

  return (
    <AuthContext.Provider value={value}>
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
