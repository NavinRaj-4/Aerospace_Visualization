import React, { useState } from 'react';
import LiftCurveChart from './LiftCurveChart';
import DragPolarChart from './DragPolarChart';
import PitchMomentChart from './PitchMomentChart';
import PressureDistributionChart from './PressureDistributionChart';
import LiftToDragEfficiencyChart from './LiftToDragEfficiencyChart';
import { 
  Activity, 
  Grid, 
  Maximize2, 
  Download, 
  Layers, 
  CheckSquare, 
  Square,
  Sparkles,
  Info
} from 'lucide-react';

export default function AnalyticsSuite({ selectedModel, models, currentTelemetry }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'lift', 'drag', 'moment', 'pressure', 'efficiency'
  const [showCFD, setShowCFD] = useState(true);

  if (!selectedModel) return null;

  const exportCurrentModelCSV = () => {
    const headers = ['AoA (deg)', 'CL', 'CD', 'CM', 'L/D', 'Dynamic Pressure (kPa)', 'Stall Status'];
    const rows = selectedModel.curves.map(c => [
      c.aoa,
      c.cl,
      c.cd,
      c.cm,
      c.ld,
      c.qInf,
      c.stall ? 'TRUE' : 'FALSE'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedModel.code}_Aerodynamic_Curves.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Toolbar */}
      <div className="aero-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="badge-cyan text-xs font-mono px-2 py-0.5 rounded font-bold">
              {selectedModel.regime.toUpperCase()} REGIME
            </span>
            <span className="text-slate-500 font-mono text-xs">|</span>
            <span className="text-xs font-mono text-slate-300">
              Mach <strong className="text-cyan-400 font-bold">{selectedModel.machNumber}</strong>
            </span>
            <span className="text-slate-500 font-mono text-xs">|</span>
            <span className="text-xs font-mono text-slate-300">
              Re = <strong className="text-slate-100 font-bold">{selectedModel.reynoldsNumber}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold font-display text-white tracking-wide flex items-center space-x-2">
            <span>{selectedModel.name}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">[{selectedModel.code}]</span>
          </h2>
          <p className="text-xs font-mono text-slate-400 max-w-3xl">
            {selectedModel.description}
          </p>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CFD Toggle */}
          <button
            onClick={() => setShowCFD(!showCFD)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              showCFD 
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-cyan-glow' 
                : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {showCFD ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>CFD Theory Overlay</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={exportCurrentModelCSV}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-xs font-mono transition-all hover:shadow-emerald-glow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Curves (CSV)</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
            viewMode === 'grid'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Full Analytics Quad (2x2)</span>
        </button>

        <button
          onClick={() => setViewMode('lift')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'lift'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CL vs α (Lift Polar)
        </button>

        <button
          onClick={() => setViewMode('drag')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'drag'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Drag Polar & Rise
        </button>

        <button
          onClick={() => setViewMode('moment')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'moment'
              ? 'bg-violet-950 text-violet-300 border border-violet-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CM vs α (Pitch Moment)
        </button>

        <button
          onClick={() => setViewMode('pressure')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'pressure'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cp vs x/c (Pressure Stations)
        </button>

        <button
          onClick={() => setViewMode('efficiency')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            viewMode === 'efficiency'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          L/D Efficiency (Glide)
        </button>
      </div>

      {/* Main Scientific Visualization Views */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[380px]">
            <LiftCurveChart 
              model={selectedModel} 
              currentAoA={currentTelemetry?.aoa} 
              showCFD={showCFD} 
            />
          </div>
          <div className="h-[380px]">
            <DragPolarChart 
              model={selectedModel} 
              currentAoA={currentTelemetry?.aoa} 
            />
          </div>
          <div className="h-[380px]">
            <PitchMomentChart 
              model={selectedModel} 
            />
          </div>
          <div className="h-[380px]">
            <PressureDistributionChart 
              model={selectedModel} 
              currentAoA={currentTelemetry?.aoa} 
            />
          </div>
        </div>
      )}

      {viewMode === 'lift' && (
        <div className="h-[520px]">
          <LiftCurveChart 
            model={selectedModel} 
            currentAoA={currentTelemetry?.aoa} 
            showCFD={showCFD} 
          />
        </div>
      )}

      {viewMode === 'drag' && (
        <div className="h-[520px]">
          <DragPolarChart 
            model={selectedModel} 
            currentAoA={currentTelemetry?.aoa} 
          />
        </div>
      )}

      {viewMode === 'moment' && (
        <div className="h-[520px]">
          <PitchMomentChart 
            model={selectedModel} 
          />
        </div>
      )}

      {viewMode === 'pressure' && (
        <div className="h-[520px]">
          <PressureDistributionChart 
            model={selectedModel} 
            currentAoA={currentTelemetry?.aoa} 
          />
        </div>
      )}

      {viewMode === 'efficiency' && (
        <div className="h-[520px]">
          <LiftToDragEfficiencyChart 
            model={selectedModel} 
          />
        </div>
      )}
    </div>
  );
}
