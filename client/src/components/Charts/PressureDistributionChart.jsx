import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './ChartSetup';
import { chartCommonOptions } from './ChartSetup';
import { getInterpolatedPressureProfile } from '../../mockData/aerospaceData';
import { Gauge, Sliders, ArrowDownUp, AlertTriangle } from 'lucide-react';

export default function PressureDistributionChart({ model, currentAoA = 4.0 }) {
  const [localAoA, setLocalAoA] = useState(currentAoA || 4.0);
  const [useLiveAoA, setUseLiveAoA] = useState(false);

  const effectiveAoA = useLiveAoA ? (currentAoA || 4.0) : localAoA;
  const profile = getInterpolatedPressureProfile(model.id, effectiveAoA);

  const labels = profile.map(p => `${Math.round(p.xc * 100)}%`);
  const upperData = profile.map(p => p.cpUpper);
  const lowerData = profile.map(p => p.cpLower);

  // Find peak suction (min Cp value)
  const minCpUpper = Math.min(...upperData);
  const isStalled = effectiveAoA >= model.stallAngle;

  // Approximate section lift from Cp integral
  let approxCl = 0;
  for (let i = 0; i < profile.length - 1; i++) {
    const dxc = profile[i + 1].xc - profile[i].xc;
    const avgDeltaCp = ((profile[i].cpLower - profile[i].cpUpper) + (profile[i + 1].cpLower - profile[i + 1].cpUpper)) / 2;
    approxCl += avgDeltaCp * dxc;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Upper Surface Suction (-Cp)',
        data: upperData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.20)',
        borderWidth: 2.5,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        tension: 0.35,
        fill: '+1' // Fill between upper and lower curves
      },
      {
        label: 'Lower Surface Pressure (+Cp)',
        data: lowerData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.10)',
        borderWidth: 2.5,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        tension: 0.35,
        fill: false
      }
    ]
  };

  const options = {
    ...chartCommonOptions,
    scales: {
      x: {
        ...chartCommonOptions.scales.x,
        title: {
          display: true,
          text: 'Chord Station x/c (% from Leading Edge to Trailing Edge)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        }
      },
      y: {
        ...chartCommonOptions.scales.y,
        reverse: true, // Standard aerodynamic convention: negative Cp plotted upward (suction on top!)
        title: {
          display: true,
          text: 'Pressure Coefficient Cp (Inverted Axis: -Cp Suction Upward)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        },
        suggestedMin: -6.0,
        suggestedMax: 1.2
      }
    }
  };

  return (
    <div className="aero-card p-4 flex flex-col h-full">
      {/* Header with AoA Selector Slider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide flex items-center space-x-2">
              <span>Chordwise Pressure Distribution [Cp vs x/c]</span>
              <span className="text-[10px] font-normal text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                -Cp Inverted
              </span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Upper surface suction peak & lower surface compression station
            </p>
          </div>
        </div>

        {/* Dynamic AoA Slider Control */}
        <div className="flex items-center space-x-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono text-slate-300">Station α:</span>
          <input
            type="range"
            min="0"
            max="18"
            step="0.5"
            value={effectiveAoA}
            onChange={(e) => {
              setLocalAoA(parseFloat(e.target.value));
              setUseLiveAoA(false);
            }}
            className="w-24 sm:w-32 aero-slider"
          />
          <span className="text-xs font-mono font-bold text-cyan-300 min-w-[40px]">
            {effectiveAoA.toFixed(1)}°
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 min-h-[290px] w-full mt-3">
        <Line data={chartData} options={options} />
      </div>

      {/* Scientific Diagnostics Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PEAK SUCTION (Cp,min)</span>
          <span className="text-cyan-300 font-bold">{minCpUpper.toFixed(2)}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">INTEGRATED SECTION CL</span>
          <span className="text-emerald-400 font-bold">{approxCl.toFixed(3)}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">SUCTION PEAK LOC</span>
          <span className="text-slate-200 font-bold">2.5% Chord</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PRESSURE STATE</span>
          <span className={isStalled ? 'text-rose-400 font-bold flex items-center justify-center space-x-1' : 'text-emerald-400 font-bold'}>
            {isStalled ? 'STALL COLLAPSE' : 'LAMINAR SUCTION'}
          </span>
        </div>
      </div>
    </div>
  );
}
