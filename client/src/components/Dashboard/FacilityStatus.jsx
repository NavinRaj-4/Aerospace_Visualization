import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AeroApi } from '../../services/api';
import { audioEngine } from '../../services/audioEngine';
import { 
  Wind, 
  Gauge, 
  Thermometer, 
  Zap, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  AlertTriangle, 
  Power, 
  Sliders, 
  Snowflake, 
  ShieldAlert 
} from 'lucide-react';

export default function FacilityStatus({ facilities, onSelectFacility, onFacilityUpdated }) {
  const { user, can } = useAuth();
  const [selectedFacId, setSelectedFacId] = useState(facilities[0]?.id || 'TUNNEL-SUB-01');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionNotice, setActionNotice] = useState('');
  const [scramConfirmOpen, setScramConfirmOpen] = useState(false);

  if (!facilities || facilities.length === 0) return null;

  const activeFac = facilities.find(f => f.id === selectedFacId) || facilities[0];

  const handleUpdateRpm = async (newRpm) => {
    if (!can('MANAGE_FACILITY')) {
      setActionNotice('Requires Operator or Flight Director clearance to adjust tunnel drive motors.');
      setTimeout(() => setActionNotice(''), 4000);
      return;
    }

    try {
      setIsUpdating(true);
      const powerCalc = Math.round(120 + (newRpm / 3000) * (activeFac.powerDrawKw > 1000 ? 2200 : 700));
      const updated = await AeroApi.updateFacility(activeFac.id, {
        fanRpm: Number(newRpm),
        powerDrawKw: powerCalc,
        status: newRpm > 0 ? 'ACTIVE' : 'STANDBY'
      });
      if (onFacilityUpdated) onFacilityUpdated(updated);
      audioEngine.updateTunnelRumble(parseFloat(activeFac.machRange) || 0.15, Number(newRpm));
    } catch (err) {
      setActionNotice(`Failed to update RPM: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleCooling = async () => {
    if (!can('MANAGE_FACILITY')) {
      setActionNotice('Requires Operator or Flight Director clearance to toggle cryogenic circuit.');
      setTimeout(() => setActionNotice(''), 4000);
      return;
    }

    try {
      setIsUpdating(true);
      const isCryoActive = activeFac.coolingCircuit && activeFac.coolingCircuit.includes('Active');
      const nextCircuit = isCryoActive ? 'Passive Cooling Loop (24.5 °C)' : 'Active Cryogenic Nitrogen Circuit (12.2 °C)';
      const nextTemp = isCryoActive ? '23.4 °C' : '11.8 °C';

      const updated = await AeroApi.updateFacility(activeFac.id, {
        coolingCircuit: nextCircuit,
        activeTemperature: nextTemp
      });
      if (onFacilityUpdated) onFacilityUpdated(updated);
      audioEngine.playClick();
    } catch (err) {
      setActionNotice(`Failed to toggle cooling: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmergencyScram = async () => {
    if (!can('EMERGENCY_SCRAM')) {
      setActionNotice('Clearance Denied: Operator or Flight Director required to trigger Facility SCRAM.');
      setTimeout(() => setActionNotice(''), 4000);
      return;
    }

    try {
      setIsUpdating(true);
      audioEngine.playEmergencyScram();
      const updated = await AeroApi.emergencyScramFacility(activeFac.id, `Emergency Scram triggered by ${user?.name || 'Operator'}`);
      if (onFacilityUpdated) onFacilityUpdated(updated);
      setScramConfirmOpen(false);
      setActionNotice(`[CRITICAL] Emergency Scram engaged for ${activeFac.name}! Drive motor dropped to 0 RPM.`);
      setTimeout(() => setActionNotice(''), 6000);
    } catch (err) {
      setActionNotice(`Emergency scram error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Facilities Title Strip */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
            Wind Tunnel Test Facilities & Drive Motor Control
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{facilities.length} Wind Tunnels Online</span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/50 text-amber-300 font-mono text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Facilities Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {facilities.map((fac) => {
          const isSelected = selectedFacId === fac.id;
          const statusColors = {
            ACTIVE: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
            STANDBY: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
            READY: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
            EMERGENCY_SHUTDOWN: 'text-rose-400 bg-rose-950/80 border-rose-500 shadow-rose-glow animate-pulse'
          };

          return (
            <div
              key={fac.id}
              onClick={() => {
                setSelectedFacId(fac.id);
                if (onSelectFacility) onSelectFacility(fac.id);
                audioEngine.playClick();
              }}
              className={`aero-card p-4 space-y-3 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-cyan-500 bg-slate-900/95 shadow-cyan-glow' 
                  : 'hover:border-slate-700 bg-slate-900/60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${statusColors[fac.status] || statusColors.ACTIVE}`}>
                    {fac.status}
                  </span>
                  <h4 className="text-sm font-bold font-mono text-slate-100 mt-1">
                    {fac.name}
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400 block">{fac.id}</span>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                    SELECTED
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Regime:</span>
                  <span className="text-cyan-300 font-bold">{fac.regime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mach Envelope:</span>
                  <span className="text-slate-200">{fac.machRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Section Dimensions:</span>
                  <span className="text-slate-200 truncate max-w-[170px]">{fac.testSectionSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Temperature:</span>
                  <span className="text-amber-300">{fac.activeTemperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Turbulence Intensity:</span>
                  <span className="text-emerald-400 font-bold">{fac.turbulenceIntensity}</span>
                </div>
              </div>

              {/* Drive Load Bar */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Fan Drive Motor</span>
                  <span className="text-cyan-300 font-bold">{fac.fanRpm ? `${fac.fanRpm} RPM` : '0 RPM (Cryo Static)'}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-500 h-full rounded-full transition-all duration-300 shadow-cyan-glow"
                    style={{ width: `${fac.fanRpm ? Math.min(100, (fac.fanRpm / 3200) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Facility Operations & Telemetry Control Console */}
      <div className="aero-card p-5 space-y-4 border-cyan-500/30 bg-slate-900/90">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              Chamber Operations Console: <span className="text-cyan-300">{activeFac.name}</span>
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {can('MANAGE_FACILITY') 
              ? 'Authorized: Operator / Director controls enabled' 
              : 'Observer mode: Operator clearance required to command actuators'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Fan RPM Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Drive Fan Motor RPM:</span>
              <strong className="text-cyan-300 text-sm">{activeFac.fanRpm || 0} RPM</strong>
            </div>
            <input
              type="range"
              min="0"
              max="3200"
              step="50"
              value={activeFac.fanRpm || 0}
              onChange={(e) => handleUpdateRpm(e.target.value)}
              disabled={!can('MANAGE_FACILITY') || isUpdating}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0 (Idle)</span>
              <span>1500 (Cruising)</span>
              <span>3200 (Max Mach)</span>
            </div>
          </div>

          {/* Cryo Cooling Toggle & Power Draw */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Cooling Circuit:</span>
              <span className="text-slate-300 truncate max-w-[150px]">{activeFac.coolingCircuit}</span>
            </div>
            <button
              onClick={handleToggleCooling}
              disabled={!can('MANAGE_FACILITY') || isUpdating}
              className="w-full py-2 px-3 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-800 text-xs font-mono text-slate-200 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
              <span>Toggle Cryogenic Loop</span>
            </button>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Power Draw:</span>
              <span className="text-amber-300 font-bold">{activeFac.powerDrawKw || 640} kW</span>
            </div>
          </div>

          {/* Emergency SCRAM Safety Button */}
          <div className="space-y-2 text-center md:text-right">
            <div className="text-[10px] font-mono text-slate-400">Emergency Procedures</div>
            {!scramConfirmOpen ? (
              <button
                onClick={() => {
                  if (!can('EMERGENCY_SCRAM')) {
                    setActionNotice('Clearance Denied: Operator or Flight Director required to trigger Facility SCRAM.');
                    setTimeout(() => setActionNotice(''), 4000);
                    return;
                  }
                  setScramConfirmOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/60 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-rose-glow flex items-center justify-center space-x-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>EMERGENCY FACILITY SCRAM</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-500 space-y-2 animate-shake">
                <div className="text-[11px] font-mono text-rose-200 font-bold">
                  CONFIRM SCRAM SHUTDOWN?
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setScramConfirmOpen(false)}
                    className="flex-1 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmergencyScram}
                    className="flex-1 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono shadow-rose-glow"
                  >
                    EXECUTE SCRAM
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
