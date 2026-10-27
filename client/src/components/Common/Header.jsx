import React, { useState, useEffect } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { audioEngine } from '../../services/audioEngine';
import { 
  Activity, 
  Wind, 
  Gauge, 
  Layers, 
  Database, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Radio, 
  ChevronDown,
  Compass,
  AlertTriangle,
  ShieldCheck,
  User,
  Plus,
  Zap,
  Lock
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  selectedModel, 
  setSelectedModel, 
  models, 
  currentTelemetry,
  audioEnabled,
  setAudioEnabled,
  onOpenCreateModel
}) {
  const { 
    user, 
    role, 
    roleInfo, 
    quickLogin, 
    demoAccounts, 
    setAuthModalOpen, 
    setUserProfileOpen, 
    isLoginPageOpen,
    setIsLoginPageOpen,
    can 
  } = useAuth();

  const [timeStr, setTimeStr] = useState('');
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    audioEngine.setMuted(!nextState);
    if (nextState) {
      audioEngine.playClick();
      audioEngine.startTunnelRumble(currentTelemetry?.mach || 0.15);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Mission Control', icon: Gauge },
    { id: 'windtunnel', label: '3D Wind Tunnel Viewport', icon: Wind },
    { id: 'analytics', label: 'Analytics Suite', icon: Activity },
    { id: 'datasets', label: 'Flight Test Records', icon: Database },
    { id: 'sweep', label: 'Live AoA Sweep', icon: Radio },
    { id: 'admin', label: 'Security & Admin', icon: ShieldCheck, badge: 'DIR-L5' }
  ];

  const isStall = currentTelemetry && currentTelemetry.stall !== 'LAMINAR_ATTACHED';

  return (
    <header className="sticky top-0 z-50 aero-hud-bar border-b border-slate-800/80 backdrop-blur-xl">
      {/* Top Telemetry Ticker Strip */}
      <div className="bg-aero-950/90 px-4 py-1 border-b border-cyan-500/20 text-xs font-mono flex flex-wrap items-center justify-between text-slate-400 gap-2">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-semibold tracking-wider">SYSTEM ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">FACILITY: <strong className="text-cyan-400 font-normal">{selectedModel?.facilityId || 'TUNNEL-01'}</strong></span>
          </div>
          <div className="hidden lg:flex items-center space-x-3 text-[11px]">
            <span>MACH: <strong className="text-cyan-300">{currentTelemetry?.mach?.toFixed(2) || '0.15'}</strong></span>
            <span>q∞: <strong className="text-slate-200">{currentTelemetry?.qInf?.toFixed(2) || '1.62'} kPa</strong></span>
            <span>AoA: <strong className={isStall ? 'text-rose-400 font-bold' : 'text-cyan-300'}>{currentTelemetry?.aoa?.toFixed(1) || '0.0'}°</strong></span>
            <span>Re: <strong className="text-slate-300">{selectedModel?.reynoldsNumber || '3.0 × 10⁶'}</strong></span>
          </div>
        </div>

        {/* 1-Click Fast Role Switcher in Ticker */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 hidden xl:inline">
            Active Clearance:
          </span>
          <div className="flex items-center space-x-1">
            {['admin', 'engineer', 'operator', 'viewer'].map((r) => {
              const isSelected = user?.role === r;
              const def = ROLE_DEFINITIONS[r];
              const shortLabels = { admin: 'Director', engineer: 'Senior Aero', operator: 'Operator', viewer: 'Observer' };
              return (
                <button
                  key={r}
                  onClick={() => quickLogin(r)}
                  title={`Switch active session to ${def?.title}`}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center space-x-1 ${
                    isSelected
                      ? `${def?.badgeClass} scale-105`
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: def?.color || '#06b6d4' }} />
                  <span>{shortLabels[r]}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block"></div>

          {isStall && (
            <div className="badge-red px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>STALL ACTIVE</span>
            </div>
          )}

          {/* Audio Synthesizer Toggle */}
          <button 
            onClick={toggleAudio}
            title={audioEnabled ? "Mute Wind Tunnel Audio" : "Enable Wind Tunnel Audio Synthesizer"}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded hover:bg-slate-800"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          <span className="text-slate-500 font-mono tracking-widest hidden sm:inline">{timeStr}</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-400 shadow-cyan-glow">
              <Compass className="w-6 h-6 animate-pulse-glow" />
              <div className="reticle-corner-tl" />
              <div className="reticle-corner-br" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold font-display tracking-wider text-white">
                  AERO<span className="text-cyan-400">SUITE</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  v3.0 ENTERPRISE
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 hidden sm:block">
                Aerospace Wind Tunnel & Telemetry Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    audioEngine.playClick();
                  }}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-xs font-medium font-mono uppercase tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-500/40 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster: Active Model Selector + User Profile Badge */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800/90 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/50 text-xs font-mono transition-all"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">Test Article</span>
                  <span className="font-semibold text-cyan-300 truncate max-w-[130px] sm:max-w-[160px]">
                    {selectedModel?.name || 'Select Model'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              {modelDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 border border-cyan-500/30 shadow-2xl z-50 p-2 space-y-1 backdrop-blur-2xl"
                  onMouseLeave={() => setModelDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 border-b border-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>Aerodynamic Test Articles</span>
                    {can('CREATE_MODEL') && (
                      <button
                        onClick={() => {
                          setModelDropdownOpen(false);
                          if (onOpenCreateModel) onOpenCreateModel();
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Model</span>
                      </button>
                    )}
                  </div>
                  {models.map((m) => {
                    const isSelected = selectedModel?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m);
                          setModelDropdownOpen(false);
                          audioEngine.playClick();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-start justify-between transition-all ${
                          isSelected 
                            ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/40' 
                            : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center space-x-1">
                            <span>{m.name}</span>
                            {m.isCustom && (
                              <span className="text-[9px] px-1 rounded bg-amber-950 text-amber-300 border border-amber-500/40">CUSTOM</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                            <span className="text-cyan-400">{m.regime}</span>
                            <span>•</span>
                            <span>Mach {m.machNumber}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shadow-cyan-glow"></span>
                        )}
                      </button>
                    );
                  })}

                  {/* Add Model Button in Dropdown */}
                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setModelDropdownOpen(false);
                        if (onOpenCreateModel) onOpenCreateModel();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-mono text-cyan-300 hover:bg-slate-800 flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Register New Aerospace Article</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dedicated Login Page Gateway Button */}
            <button
              onClick={() => {
                setIsLoginPageOpen(true);
                audioEngine.playClick();
              }}
              title="Open Dedicated Aerospace Personnel Login Page"
              className="flex items-center space-x-1.5 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-all hover:shadow-cyan-glow"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Login Page</span>
            </button>

            {/* Personnel Profile Button */}
            {user ? (
              <button
                onClick={() => {
                  setUserProfileOpen(true);
                  audioEngine.playClick();
                }}
                className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 hover:border-cyan-500/50 rounded-lg p-1.5 sm:px-2.5 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-md bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[11px] font-bold font-mono text-slate-200 truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider">
                    {user.role}
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginPageOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-mono font-bold uppercase tracking-wider shadow-cyan-glow transition-all flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enlist / Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden bg-slate-950/90 border-t border-slate-800 px-2 py-1.5 flex overflow-x-auto space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                audioEngine.playClick();
              }}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-[11px] font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
