import React, { useState } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  AlertCircle, 
  X, 
  Compass, 
  Zap, 
  Crown, 
  Radio, 
  CheckCircle2 
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    login, 
    register, 
    quickLogin, 
    demoAccounts, 
    authError, 
    setAuthError 
  } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('engineer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          email,
          password,
          name,
          role: selectedRole,
          callsign,
          department
        });
      }
    } catch (err) {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden aero-hud-bar">
        {/* Reticles */}
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-aero-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                AEROSPACE CLEARANCE AUTHENTICATION
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Wind Tunnel Platform Telemetry & RBAC Security Gateway
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Bar (1-Click Tester) */}
        <div className="bg-slate-950/70 p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 flex items-center space-x-1">
              <Zap className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
              1-Click Instant Demo Authentication
            </span>
            <span className="text-[10px] font-mono text-slate-500">Test Any Clearance</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {demoAccounts.map((acct) => {
              const def = ROLE_DEFINITIONS[acct.role];
              return (
                <button
                  key={acct.role}
                  type="button"
                  onClick={() => quickLogin(acct.role)}
                  className="flex flex-col p-2.5 rounded-xl text-left bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-200 group-hover:text-cyan-300">
                      {acct.role.toUpperCase()}
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def?.color || '#06b6d4' }} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 truncate mt-1">
                    {acct.name}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400/80 mt-0.5 truncate">
                    {acct.callsign}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Error Banner */}
        {authError && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center space-x-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {/* Tabs: Sign In / Register */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-950/30">
          <button
            onClick={() => { setMode('login'); setAuthError(''); }}
            className={`pb-2.5 px-4 text-xs font-mono font-semibold uppercase tracking-wider transition-all border-b-2 ${
              mode === 'login'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Clearance Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setAuthError(''); }}
            className={`pb-2.5 px-4 text-xs font-mono font-semibold uppercase tracking-wider transition-all border-b-2 ${
              mode === 'register'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Enlist Personnel (Register)
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Thomas Wright"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Radio Callsign
                </label>
                <div className="relative">
                  <Radio className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="e.g. AERO-GHOST"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Aerospace Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@aerospace.gov"
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Security Access Key / Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950/80 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Clearance Role Assignment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ROLE_DEFINITIONS).map(([rKey, rVal]) => (
                  <button
                    key={rKey}
                    type="button"
                    onClick={() => setSelectedRole(rKey)}
                    className={`p-2 rounded-lg text-left border text-xs font-mono transition-all flex items-center justify-between ${
                      selectedRole === rKey
                        ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{rVal.title}</div>
                      <div className="text-[10px] text-slate-500 capitalize">{rKey}</div>
                    </div>
                    {selectedRole === rKey && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-cyan-glow flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Validating Clearance...'
                : mode === 'login'
                ? 'Authenticate & Authorize Session'
                : 'Enlist & Generate Clearance Token'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
