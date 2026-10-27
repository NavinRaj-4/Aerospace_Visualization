import React from 'react';
import StatCard from '../Common/StatCard';
import FacilityStatus from './FacilityStatus';
import { 
  Gauge, 
  Wind, 
  Flame, 
  AlertTriangle, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Radio, 
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function MissionOverview({
  selectedModel,
  setSelectedModel,
  models,
  facilities,
  currentTelemetry,
  aoa,
  setAoa,
  testRunsCount,
  setActiveTab,
  onFacilityUpdated
}) {
  const isStall = currentTelemetry && currentTelemetry.stall !== 'LAMINAR_ATTACHED';
  const stallAngle = selectedModel?.stallAngle || 15.5;

  return (
    <div className="space-y-6">
      {/* 1. Summary Telemetry Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Test Runs"
          value={testRunsCount}
          unit="Records"
          subtitle="In-Memory Telemetry Database"
          icon={Layers}
          variant="cyan"
          trend="+12 this session"
          badgeText="LOGGED"
        />

        <StatCard
          title="Active Facility"
          value={selectedModel?.regime || 'Subsonic'}
          unit={selectedModel?.facilityId || 'TUNNEL-01'}
          subtitle={`Flow Speed: Mach ${selectedModel?.machNumber || '0.15'}`}
          icon={Wind}
          variant="emerald"
          badgeText="ONLINE"
        />

        <StatCard
          title="Max Mach Tested"
          value={`Mach ${Math.max(...models.map(m => m.machNumber)).toFixed(2)}`}
          unit="Supersonic"
          subtitle="Envelope: M 0.05 – M 2.20"
          icon={Flame}
          variant="amber"
          trend="Dynamic Blowdown"
        />

        <StatCard
          title="Boundary Flow State"
          value={isStall ? 'STALL SEPARATED' : 'ATTACHED LAMINAR'}
          unit={isStall ? `${currentTelemetry?.separationPct || 65}% Wake` : 'Stable'}
          subtitle={isStall ? `α (${aoa.toFixed(1)}°) ≥ α_stall (${stallAngle}°)` : `${(stallAngle - aoa).toFixed(1)}° margin to stall`}
          icon={AlertTriangle}
          variant={isStall ? 'red' : 'emerald'}
          isWarning={isStall}
          badgeText={isStall ? 'CRITICAL' : 'NOMINAL'}
        />
      </div>

      {/* 2. Model Quick-Switch Selector & Live Dynamic Angle of Attack Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Model Cards Selector (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                Aerospace Test Models [3 Test Articles]
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">
              Click to activate test article
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {models.map((m) => {
              const isSelected = selectedModel?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m)}
                  className={`aero-card p-4 text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400/90 bg-slate-900 shadow-cyan-glow'
                      : 'hover:border-slate-600 bg-slate-950/60'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-cyan-glow animate-ping" />
                    </div>
                  )}

                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                      m.regime === 'Subsonic' ? 'badge-cyan' : m.regime === 'Transonic' ? 'badge-emerald' : 'badge-amber'
                    }`}>
                      {m.regime.toUpperCase()}
                    </span>

                    <h4 className="text-sm font-bold font-mono text-white mt-2 leading-snug">
                      {m.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 block">{m.code}</span>

                    <p className="text-[11px] font-mono text-slate-400 mt-2 line-clamp-2">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Mach:</span>
                      <span className="text-slate-200 font-bold">{m.machNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Stall α:</span>
                      <span className="text-rose-300 font-bold">{m.stallAngle}°</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>CL,max:</span>
                      <span className="text-emerald-400 font-bold">{m.clMax}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Max L/D:</span>
                      <span className="text-cyan-300 font-bold">{(m.maxLOverD || 50).toFixed(1)}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Model Flow Diagnostics Box */}
          <div className="aero-card p-4 space-y-2 bg-slate-900/60 border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              <span className="font-bold uppercase tracking-wider">Flow Physics &amp; Vortex Behavior:</span>
            </div>
            <p className="text-xs font-mono text-slate-300">
              {selectedModel?.flowCharacteristics}
            </p>
          </div>
        </div>

        {/* Live Instant Pitch & Telemetry Widget */}
        <div className="aero-card p-5 space-y-4 flex flex-col justify-between">
          <div className="reticle-corner-tl" />
          <div className="reticle-corner-tr" />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
                  Live Test Section Pitch
                </h3>
              </div>
              <span className={isStall ? 'badge-red text-[10px] px-1.5 py-0.2 rounded font-bold' : 'badge-emerald text-[10px] px-1.5 py-0.2 rounded'}>
                {isStall ? 'STALL ONSET' : 'FLOW ATTACHED'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Interactive Angle of Attack sweep
            </p>
          </div>

          {/* Angle Dial & Slider */}
          <div className="py-2 space-y-3">
            <div className="flex items-center justify-between font-mono">
              <span className="text-xs text-slate-400">PITCH ANGLE (α):</span>
              <span className={`text-3xl font-bold tracking-tight ${isStall ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                {aoa.toFixed(1)}°
              </span>
            </div>

            <input
              type="range"
              min="-4"
              max="20"
              step="0.5"
              value={aoa}
              onChange={(e) => setAoa(parseFloat(e.target.value))}
              className="w-full aero-slider"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>-4.0°</span>
              <span>0.0° Level</span>
              <span>+10.0°</span>
              <span className="text-rose-400">Stall ({stallAngle}°)</span>
              <span>+20.0°</span>
            </div>
          </div>

          {/* Instantaneous Computed Telemetry */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">SECTION LIFT (CL)</span>
              <span className="text-emerald-400 font-bold text-base">{currentTelemetry?.cl?.toFixed(3) || '0.435'}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">TOTAL DRAG (CD)</span>
              <span className="text-amber-300 font-bold text-base">{currentTelemetry?.cd?.toFixed(4) || '0.0093'}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">GLIDE EFFICIENCY (L/D)</span>
              <span className="text-cyan-300 font-bold text-base">{currentTelemetry?.ld?.toFixed(1) || '46.8'}</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">DYNAMIC PRESS (q∞)</span>
              <span className="text-slate-200 font-bold text-base">{currentTelemetry?.qInf?.toFixed(2) || '1.62'} kPa</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => setActiveTab('windtunnel')}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shadow-cyan-glow flex items-center justify-center space-x-2 transition-all"
            >
              <Wind className="w-4 h-4" />
              <span>Enter 3D Wind Tunnel Viewport</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-xs border border-cyan-500/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Inspect Scientific Curves</span>
            </button>
          </div>
        </div>

      </div>

      {/* 3. Wind Tunnel Test Facilities Status Cards */}
      <FacilityStatus
        facilities={facilities}
        selectedFacilityId={selectedModel?.facilityId}
        onFacilityUpdated={onFacilityUpdated}
      />
    </div>
  );
}
