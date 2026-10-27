import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import './ChartSetup';
import { chartCommonOptions } from './ChartSetup';
import { Compass, Flame, ArrowUpRight } from 'lucide-react';

export default function DragPolarChart({ model, currentAoA = null }) {
  const [viewMode, setViewMode] = useState('CL_vs_CD'); // 'CL_vs_CD' or 'CD_vs_AoA'

  if (!model || !model.curves) return null;

  let chartData, options;

  if (viewMode === 'CL_vs_CD') {
    // Sort by CD
    const sortedPoints = [...model.curves].sort((a, b) => a.cd - b.cd);
    const labels = sortedPoints.map(p => p.cd.toFixed(4));
    const clValues = sortedPoints.map(p => p.cl);

    // Theoretical parabolic polar fit: CD = CD0 + k * CL^2
    const cd0 = model.cd0;
    const k = (sortedPoints[sortedPoints.length - 1].cd - cd0) / Math.pow(model.clMax, 2);
    const parabolicFit = sortedPoints.map(p => {
      const estimatedCl = Math.sqrt(Math.max(0, (p.cd - cd0) / (k || 0.05)));
      return Number(p.cl.toFixed(3));
    });

    chartData = {
      labels,
      datasets: [
        {
          label: 'Drag Polar [CL vs CD]',
          data: clValues,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: sortedPoints.map(p => p.stall ? '#ef4444' : '#10b981'),
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 8,
          tension: 0.3,
          fill: true
        }
      ]
    };

    options = {
      ...chartCommonOptions,
      scales: {
        x: {
          ...chartCommonOptions.scales.x,
          title: {
            display: true,
            text: 'Drag Coefficient (CD)',
            color: '#cbd5e1',
            font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
          }
        },
        y: {
          ...chartCommonOptions.scales.y,
          title: {
            display: true,
            text: 'Lift Coefficient (CL)',
            color: '#cbd5e1',
            font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
          }
        }
      }
    };
  } else {
    // CD vs AoA
    const labels = model.curves.map(c => `${c.aoa}°`);
    const cdValues = model.curves.map(c => c.cd);
    const cd0Baseline = model.curves.map(() => model.cd0);

    chartData = {
      labels,
      datasets: [
        {
          label: 'Total Measured Drag (CD)',
          data: cdValues,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          borderWidth: 2.5,
          pointBackgroundColor: model.curves.map(c => c.stall ? '#ef4444' : '#f59e0b'),
          pointBorderColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 8,
          tension: 0.25,
          fill: true
        },
        {
          label: `Zero-Lift Parasitic Baseline (CD0 = ${model.cd0})`,
          data: cd0Baseline,
          borderColor: 'rgba(148, 163, 184, 0.6)',
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false
        }
      ]
    };

    options = {
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
            text: 'Drag Coefficient (CD)',
            color: '#cbd5e1',
            font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
          }
        }
      }
    };
  }

  return (
    <div className="aero-card p-4 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              {viewMode === 'CL_vs_CD' ? 'Drag Polar [CL vs CD]' : 'Drag Rise [CD vs α]'}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Parasitic zero-lift drag & induced wave resistance
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px] font-mono">
          <button
            onClick={() => setViewMode('CL_vs_CD')}
            className={`px-2.5 py-1 rounded transition-all ${
              viewMode === 'CL_vs_CD'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-emerald-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CL vs CD
          </button>
          <button
            onClick={() => setViewMode('CD_vs_AoA')}
            className={`px-2.5 py-1 rounded transition-all ${
              viewMode === 'CD_vs_AoA'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-emerald-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            CD vs α
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 min-h-[280px] w-full mt-3">
        <Line data={chartData} options={options} />
      </div>

      {/* Scientific Diagnostics Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">MIN DRAG (CD0)</span>
          <span className="text-emerald-400 font-bold">{model.cd0}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">MAX L/D EFFICIENCY</span>
          <span className="text-cyan-300 font-bold">{(model.maxLOverD || 50).toFixed(1)}:1</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">DRAG RISE ONSET</span>
          <span className="text-amber-400 font-bold">α = {model.stallAngle > 15 ? '12.0°' : '10.0°'}</span>
        </div>
      </div>
    </div>
  );
}
