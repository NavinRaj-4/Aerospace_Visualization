import React, { useState } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { audioEngine } from '../../services/audioEngine';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  AlertCircle, 
  Compass, 
  Zap, 
  Eye, 
  EyeOff, 
  Radio, 
  Building, 
  CheckCircle2, 
  ArrowRight, 
  Wind, 
  Flame, 
  Gauge, 
  Layers 
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const { login, register, quickLogin, demoAccounts, authError, setAuthError } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('director@aerospace.gov');
  const [password, setPassword] = useState('director123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [callsign, setCallsign] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedRole, setSelectedRole] = useState('engineer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectDemo = (acct) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setMode('login');
    setAuthError('');
    audioEngine.playClick();
  };

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
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestEntry = async () => {
    try {
      await quickLogin('viewer');
      if (onLoginSuccess) onLoginSuccess();
    } catch (e) {
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-aero-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Background Reticle Grid & Cyber Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e1e38_1px,transparent_1px),linear-gradient(to_bottom,#0e1e38_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Top Telemetry Gateway Bar */}
      <div className="w-full bg-aero-950/90 border-b border-cyan-500/20 px-6 py-2.5 flex items-center justify-between text-xs font-mono text-slate-400 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-emerald-400 font-semibold tracking-wider">GATEWAY ONLINE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">SECURITY PROTOCOL: <strong className="text-cyan-400 font-normal">JWT + RBAC LEVEL 1–5</strong></span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-[11px]">
          <span>FACILITIES: <strong className="text-slate-200">3 TUNNELS READY</strong></span>
          <span className="text-slate-600">|</span>
          <span>STORAGE: <strong className="text-cyan-300">SQLITE ENCRYPTED</strong></span>
        </div>
      </div>

      {/* Main Login Screen Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-stretch">
          
          {/* Left Column: Aerospace Intelligence & Role Showcase (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 aero-card p-6 sm:p-8 bg-slate-900/80 border-cyan-500/30 shadow-2xl relative overflow-hidden">
            {/* Corner Reticles */}
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-br" />

            {/* Brand Title Header */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
                  <Compass className="w-7 h-7 animate-pulse-glow" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-wider text-white">
                      AERO<span className="text-cyan-400">SUITE</span>
                    </h1>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
                      v3.0 ENTERPRISE
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyan-300/80">
                    National Aerospace Wind Tunnel Telemetry &amp; Aerodynamic Analysis Platform
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed pt-2">
                Secure flight test engineering terminal for continuous subsonic, transonic slotted-wall, and supersonic blowdown wind tunnel instrumentation. Full Role-Based Access Control (RBAC) enforces strict separation of operational controls, aerodynamic models, and experimental datasets.
              </p>
            </div>

            {/* Facility Status Strip */}
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Wind className="w-3 h-3 text-cyan-400" />
                  <span>Subsonic Tunnel</span>
                </div>
                <div className="text-cyan-300 font-bold mt-1">Mach 0.05–0.35</div>
                <div className="text-[10px] text-emerald-400">TUNNEL-SUB-01</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  <span>Transonic Cryo</span>
                </div>
                <div className="text-amber-300 font-bold mt-1">Mach 0.60–1.30</div>
                <div className="text-[10px] text-amber-400">TUNNEL-TRANS-02</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-rose-400" />
                  <span>Supersonic Blowdown</span>
                </div>
                <div className="text-rose-300 font-bold mt-1">Mach 1.40–3.80</div>
                <div className="text-[10px] text-rose-400">TUNNEL-SUPER-03</div>
              </div>
            </div>

            {/* Preconfigured Personnel Credentials (1-Click Fill) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Fast Enlistment / Personnel Profiles</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">Click any card to auto-fill</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoAccounts.map((acct) => {
                  const def = ROLE_DEFINITIONS[acct.role];
                  const isSelected = email.toLowerCase() === acct.email.toLowerCase();

                  return (
                    <div
                      key={acct.role}
                      onClick={() => handleSelectDemo(acct)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-cyan-glow'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase ${def?.badgeClass}`}>
                          {acct.role}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{acct.callsign}</span>
                      </div>
                      <div className="font-bold text-xs font-mono text-slate-100 mt-2">
                        {acct.name}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        {acct.title}
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400/90 mt-1 flex justify-between">
                        <span>{acct.email}</span>
                        <span className="text-slate-500">pwd: {acct.password}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Info */}
            <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-800/80">
              <span>Security Clearance Level 1 to 5</span>
              <span>All flight telemetry data encrypted at rest</span>
            </div>
          </div>

          {/* Right Column: Clearance Gateway Login & Registration Box (5 cols) */}
          <div className="lg:col-span-5 aero-card p-6 sm:p-8 bg-slate-900/90 border-cyan-500/40 shadow-2xl flex flex-col justify-between relative aero-hud-bar">
            {/* Reticles */}
            <div className="reticle-corner-tl" />
            <div className="reticle-corner-br" />

            <div>
              {/* Form Mode Selector */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold font-mono text-white tracking-wide">
                    {mode === 'login' ? 'PERSONNEL ACCESS LOGIN' : 'ENLIST NEW PERSONNEL'}
                  </h2>
                </div>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => { setMode('login'); setAuthError(''); }}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                      mode === 'login'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setAuthError(''); }}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                      mode === 'register'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Enlist
                  </button>
                </div>
              </div>

              {/* Error Alert Banner */}
              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login / Enlist Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Full Name &amp; Rank *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Dr. Thomas Wright"
                          className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          Radio Callsign
                        </label>
                        <div className="relative">
                          <Radio className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={callsign}
                            onChange={(e) => setCallsign(e.target.value)}
                            placeholder="AERO-GHOST"
                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-8 pr-2 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                          Department
                        </label>
                        <div className="relative">
                          <Building className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Aero Division"
                            className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-8 pr-2 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Clearance Level Requested
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none"
                      >
                        <option value="viewer">Level 1 - Research Analyst (Viewer)</option>
                        <option value="operator">Level 3 - Wind Tunnel Operator (Operator)</option>
                        <option value="engineer">Level 4 - Senior Aerodynamicist (Engineer)</option>
                        <option value="admin">Level 5 - Flight Test Director (Admin)</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Aerospace Credentials Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@aerospace.gov"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Security Authorization Key (Password) *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-cyan-glow flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'Authenticating Session...'
                      : mode === 'login'
                      ? 'Authenticate & Enter Wind Tunnel'
                      : 'Enlist & Generate Clearance Token'}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>

            {/* Quick Guest Observer Bypass */}
            <div className="pt-6 border-t border-slate-800/80 mt-6 space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Or bypass credentials for quick evaluation
                </span>
              </div>
              <button
                type="button"
                onClick={handleGuestEntry}
                className="w-full py-2 px-3 rounded-lg border border-slate-700 hover:border-cyan-500/50 bg-slate-950/80 hover:bg-slate-800 text-xs font-mono text-slate-300 flex items-center justify-center space-x-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Enter as Guest Research Observer (Read-Only)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Futuristic Bottom Status Strip */}
      <footer className="border-t border-slate-900 bg-aero-950/90 py-3 px-4 text-xs font-mono text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>AERO-SUITE ENTERPRISE TELEMETRY ENGINE</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Aerospace Authentication &amp; RBAC Gateway</span>
        </div>
        <div className="mt-2 sm:mt-0 text-slate-400">
          Subsonic / Transonic / Supersonic Wind Tunnel Calibration Suite
        </div>
      </footer>
    </div>
  );
}
