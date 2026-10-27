import React, { useState, useEffect } from 'react';
import { useAuth, ROLE_DEFINITIONS } from '../../context/AuthContext';
import { AeroApi } from '../../services/api';
import { audioEngine } from '../../services/audioEngine';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  Key, 
  Zap, 
  Activity, 
  Radio, 
  Clock, 
  Database,
  Server,
  FolderTree,
  HardDrive
} from 'lucide-react';

export default function AdminControlPanel() {
  const { user, can, quickLogin } = useAuth();
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [logFilter, setLogFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isReseeding, setIsReseeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const isAdmin = user && user.role === 'admin';

  const loadAdminData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    try {
      const [userList, logs, stats] = await Promise.all([
        AeroApi.getUsers(),
        AeroApi.getAuditLogs(100),
        AeroApi.getDatabaseStatus()
      ]);
      if (userList) setUsers(userList);
      if (logs) setAuditLogs(logs);
      if (stats) setDbStats(stats);
    } catch (err) {
      console.warn('[AdminControlPanel] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updated = await AeroApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setStatusMessage(`Updated ${updated.name}'s clearance to ${newRole.toUpperCase()} in MongoDB`);
      setTimeout(() => setStatusMessage(''), 4000);
      const logs = await AeroApi.getAuditLogs(100);
      if (logs) setAuditLogs(logs);
      audioEngine.playClick();
    } catch (err) {
      setStatusMessage(`Error updating role: ${err.message}`);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleReseedMongoDB = async () => {
    setIsReseeding(true);
    try {
      const result = await AeroApi.reseedDatabase();
      setDbStats(result);
      setStatusMessage('MongoDB collections reseeded successfully with baseline aerodynamic flight datasets.');
      setTimeout(() => setStatusMessage(''), 5000);
      await loadAdminData();
      audioEngine.playClick();
    } catch (err) {
      setStatusMessage(`Reseed failed: ${err.message}`);
    } finally {
      setIsReseeding(false);
    }
  };

  // If user is not admin, show clearance barrier
  if (!isAdmin) {
    return (
      <div className="aero-card p-8 text-center max-w-xl mx-auto my-12 space-y-4 border-rose-500/40 bg-slate-900/90 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/60 text-rose-400 mx-auto flex items-center justify-center shadow-rose-glow animate-pulse">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold font-mono text-white">
          CLEARANCE LEVEL 5 REQUIRED
        </h3>
        <p className="text-xs font-mono text-slate-400 leading-relaxed">
          The Flight Test Security &amp; Database Administration Terminal is restricted strictly to Flight Test Directors.
          Your current session clearance is <strong className="text-cyan-300">[{user?.role ? user.role.toUpperCase() : 'GUEST'}]</strong>.
        </p>
        <div className="pt-2">
          <button
            onClick={() => quickLogin('admin')}
            className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 shadow-cyan-glow transition-all flex items-center space-x-2 mx-auto"
          >
            <Zap className="w-4 h-4 text-amber-900" />
            <span>Elevate Session to Flight Director (Admin)</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    if (logFilter !== 'ALL' && log.severity !== logFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        (log.userName && log.userName.toLowerCase().includes(q)) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Admin Telemetry Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 aero-hud-bar">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-rose-glow">
            <ShieldCheck className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold font-mono text-white">
                SECURITY ADMINISTRATION &amp; DATABASE TERMINAL
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                DIRECTOR CLEARANCE LEVEL 5
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              MongoDB Storage Management, Personnel Role Delegation, &amp; System Audit Stream
            </p>
          </div>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-1.5 transition-colors border border-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh All Streams</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center space-x-2 animate-fade-in shadow-cyan-glow">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* 1. MONGODB DATABASE MANAGEMENT & STORAGE CONSOLE */}
      <div className="aero-card p-5 space-y-4 border-cyan-500/40 bg-slate-900/95 relative overflow-hidden">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-br" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
                  MongoDB Storage &amp; Database Engine
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE &amp; CONNECTED</span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                URI: <strong className="text-cyan-300 font-normal">{dbStats?.uri || 'mongodb://127.0.0.1:27017/aerospace'}</strong> (Mongoose ODM Active)
              </p>
            </div>
          </div>

          <button
            onClick={handleReseedMongoDB}
            disabled={isReseeding}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isReseeding ? 'animate-spin' : ''}`} />
            <span>Reseed MongoDB Baseline</span>
          </button>
        </div>

        {/* MongoDB Collection Document Counts */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Collection: users</div>
            <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
              {dbStats?.collections?.users || users.length}
            </div>
            <div className="text-[9px] font-mono text-slate-500">Personnel Docs</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Collection: facilities</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {dbStats?.collections?.facilities || 3}
            </div>
            <div className="text-[9px] font-mono text-slate-500">Wind Tunnels</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Collection: models</div>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              {dbStats?.collections?.models || 3}
            </div>
            <div className="text-[9px] font-mono text-slate-500">Airfoil CAD Articles</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Collection: test_runs</div>
            <div className="text-xl font-bold font-mono text-amber-400 mt-1">
              {dbStats?.collections?.testRuns || 20}
            </div>
            <div className="text-[9px] font-mono text-slate-500">Flight Telemetry Records</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Collection: audit_logs</div>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1">
              {dbStats?.collections?.auditLogs || auditLogs.length}
            </div>
            <div className="text-[9px] font-mono text-slate-500">Security Events</div>
          </div>
        </div>
      </div>

      {/* Grid: 2. Personnel Management, 3. Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Personnel Management Table */}
        <div className="aero-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Personnel Roster [{users.length} MongoDB Accounts]
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              MongoDB collection.users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-3">Personnel</th>
                  <th className="py-2 px-3">Department</th>
                  <th className="py-2 px-3">Clearance Role</th>
                  <th className="py-2 px-3 text-right">Delegate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => {
                  const roleDef = ROLE_DEFINITIONS[u.role] || ROLE_DEFINITIONS.viewer;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-200">{u.name}</div>
                        <div className="text-[10px] text-cyan-400">{u.callsign || u.email}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {u.department || 'Flight Test Division'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${roleDef.badgeClass}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 hover:border-cyan-500 rounded px-2 py-1 text-[11px] font-mono text-slate-200 focus:outline-none"
                        >
                          <option value="admin">Director (Admin)</option>
                          <option value="engineer">Senior Aero (Engineer)</option>
                          <option value="operator">Tunnel Op (Operator)</option>
                          <option value="viewer">Analyst (Viewer)</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-time System Security & Audit Log Stream */}
        <div className="aero-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Telemetry &amp; Security Audit Trail
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {filteredLogs.length} MongoDB Event Logs
            </span>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex space-x-1 w-full sm:w-auto">
              {['ALL', 'CRITICAL', 'WARN', 'INFO'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setLogFilter(sev)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase font-bold transition-all ${
                    logFilter === sev
                      ? sev === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500' :
                        sev === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                        'bg-cyan-950 text-cyan-300 border border-cyan-500'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Log Stream */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-slate-500">
                No matching security audit records found in MongoDB.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const sevColors = {
                  CRITICAL: 'border-rose-500/70 bg-rose-950/40 text-rose-300',
                  WARN: 'border-amber-500/60 bg-amber-950/30 text-amber-300',
                  INFO: 'border-cyan-500/30 bg-slate-950/40 text-slate-300'
                };

                return (
                  <div
                    key={log._id || log.id}
                    className={`p-3 rounded-lg border text-xs font-mono space-y-1 transition-all ${sevColors[log.severity] || sevColors.INFO}`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold tracking-wider">{log.action}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{log.userName}</span>
                      </div>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-snug">
                      {log.details}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
