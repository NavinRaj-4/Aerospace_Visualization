import React from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  User, 
  Radio, 
  Building, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  X, 
  Zap, 
  Lock, 
  KeyRound, 
  Award 
} from 'lucide-react';

export default function UserProfileModal() {
  const { 
    user, 
    role, 
    roleInfo, 
    userProfileOpen, 
    setUserProfileOpen, 
    logout, 
    quickLogin, 
    demoAccounts,
    setIsLoginPageOpen
  } = useAuth();

  if (!userProfileOpen || !user) return null;

  const permissionsCatalog = [
    { key: 'MANAGE_USERS', label: 'Manage Personnel Clearance & User Accounts', req: 'Director (Admin)' },
    { key: 'EMERGENCY_SCRAM', label: 'Trigger Wind Tunnel Emergency SCRAM & Purge', req: 'Operator or Director' },
    { key: 'MANAGE_FACILITY', label: 'Adjust Tunnel Fan RPM & Cooling Circuits', req: 'Operator or Director' },
    { key: 'CREATE_MODEL', label: 'Design & Register Custom Aerospace Models', req: 'Engineer or Director' },
    { key: 'DELETE_MODEL', label: 'De-register & Purge Aerospace Models', req: 'Director (Admin)' },
    { key: 'RUN_SWEEP', label: 'Execute Live Multi-Mach AoA Sweep Engine', req: 'Operator, Engineer, or Director' },
    { key: 'SAVE_RUN', label: 'Log & Persist Test Point into SQLite Database', req: 'Operator, Engineer, or Director' },
    { key: 'DELETE_RUN', label: 'Purge & Delete Test Run Telemetry Records', req: 'Engineer or Director' },
    { key: 'UPLOAD_DATASET', label: 'Import & Validate External Flight Datasets', req: 'Engineer or Director' },
    { key: 'VIEW_AUDIT', label: 'Inspect Real-time System Security Audit Logs', req: 'Director (Admin)' },
    { key: 'VIEW_DATA', label: 'View 3D Wind Tunnel Flow & Analytics Charts', req: 'All Roles (Public)' },
    { key: 'EXPORT_DATASET', label: 'Export Telemetry Data (CSV / JSON / AeroSpec)', req: 'All Roles (Public)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden aero-hud-bar">
        {/* Reticles */}
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-aero-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                PERSONNEL DOSSIER & CLEARANCE MATRIX
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Department of Aerodynamics & Flight Test Operations
              </p>
            </div>
          </div>
          <button
            onClick={() => setUserProfileOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Identity Card */}
          <div className="aero-card p-5 relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 font-mono font-bold text-xl shadow-cyan-glow">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-bold font-mono text-white">{user.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {user.id}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 flex items-center space-x-2 mt-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>CALLSIGN: <strong>{user.callsign || 'N/A'}</strong></span>
                    <span className="text-slate-600">|</span>
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{user.department || 'Aero Research'}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              {/* Clearance Badge */}
              <div className="text-right sm:self-center">
                <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold uppercase inline-block ${roleInfo.badgeClass}`}>
                  {roleInfo.title}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  {roleInfo.clearance}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Clearance Role Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
                Live Role Switcher (Test Permissions)
              </span>
              <span className="text-[10px] font-mono text-slate-500">Switch current session</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {demoAccounts.map((acct) => {
                const isCurrent = user.role === acct.role;
                const def = ROLE_DEFINITIONS[acct.role];
                return (
                  <button
                    key={acct.role}
                    onClick={() => quickLogin(acct.role)}
                    className={`p-2.5 rounded-xl text-left border font-mono text-xs transition-all ${
                      isCurrent
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-cyan-glow'
                        : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold uppercase">{acct.role}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: def?.color || '#06b6d4' }} />
                    </div>
                    <div className="text-[10px] truncate text-slate-400 mt-1">{acct.title}</div>
                    {isCurrent && (
                      <div className="text-[9px] text-cyan-400 mt-1 font-bold">ACTIVE ROLE</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Permission Verification Matrix */}
          <div className="space-y-2">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Clearance & Action Authorization Matrix
            </h5>
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
              <div className="divide-y divide-slate-800/80">
                {permissionsCatalog.map((perm) => {
                  const isAllowed = user.role === 'admin' || (roleInfo.can.includes(perm.key) || roleInfo.can.includes('ALL'));
                  return (
                    <div key={perm.key} className="p-2.5 px-3 flex items-center justify-between text-xs font-mono hover:bg-slate-900/50 transition-colors">
                      <div className="flex items-center space-x-2">
                        {isAllowed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500/70 flex-shrink-0" />
                        )}
                        <span className={isAllowed ? 'text-slate-200' : 'text-slate-500 line-through'}>
                          {perm.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                        {perm.req}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sign Out & Switch Account Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setUserProfileOpen(false);
                setIsLoginPageOpen(true);
              }}
              className="px-4 py-2 rounded-xl border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>Switch Personnel / Open Login Page</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl border border-rose-500/50 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Clearance Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
