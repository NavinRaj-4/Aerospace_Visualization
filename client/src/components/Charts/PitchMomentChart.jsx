import React from 'react';
import { Line } from 'react-chartjs-2';
import './ChartSetup';
import { chartCommonOptions } from './ChartSetup';
import { Compass, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function PitchMomentChart({ model }) {
  if (!model || !model.curves) return null;

  const labels = model.curves.map(c => `${c.aoa}°`);
  const cmData = model.curves.map(c => c.cm);
  const zeroLine = model.curves.map(() => 0.0);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Pitching Moment Coefficient (CM, c/4)',
        data: cmData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        borderWidth: 2.5,
        pointBackgroundColor: model.curves.map(c => c.stall ? '#ef4444' : '#8b5cf6'),
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 8,
        tension: 0.25,
        fill: true
      },
      {
        label: 'Neutral Trim Axis (CM = 0)',
        data: zeroLine,
        borderColor: 'rgba(148, 163, 184, 0.5)',
        borderDash: [4, 4],
        borderWidth: 1.5,
        pointRadius: 0,
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
          text: 'Angle of Attack α (deg)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        }
      },
      y: {
        ...chartCommonOptions.scales.y,
        title: {
          display: true,
          text: 'Pitching Moment (CM, c/4)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        },
        suggestedMin: -0.3,
        suggestedMax: 0.1
      }
    }
  };

  // Determine stability: dCM/dalpha should be negative for pitch stability
  const dCmDalpha = (cmData[cmData.length - 4] - cmData[0]) / (model.curves[model.curves.length - 4].aoa - model.curves[0].aoa);
  const isStaticallyStable = dCmDalpha < 0;

  return (
    <div className="aero-card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-violet-950 border border-violet-500/40 text-violet-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Pitching Moment [CM vs α]
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Longitudinal aerodynamic stability & center of pressure
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isStaticallyStable ? (
            <span className="badge-emerald text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>STATICALLY STABLE (dCM/dα &lt; 0)</span>
            </span>
          ) : (
            <span className="badge-amber text-[10px] font-mono px-2 py-0.5 rounded flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3" />
              <span>NEUTRAL / RELAXED STABILITY</span>
            </span>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 min-h-[280px] w-full mt-3">
        <Line data={chartData} options={options} />
      </div>

      {/* Scientific Diagnostics Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">ZERO-LIFT MOMENT (CM0)</span>
          <span className="text-violet-300 font-bold">{model.cm0}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">STABILITY GRADIENT (dCM/dα)</span>
          <span className="text-emerald-400 font-bold">{dCmDalpha.toFixed(4)} / deg</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">AERO CENTER LOCATION</span>
          <span className="text-cyan-300 font-bold">25.0% Chord (c/4)</span>
        </div>
      </div>
    </div>
  );
}
