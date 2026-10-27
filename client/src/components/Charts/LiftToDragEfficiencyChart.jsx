import React from 'react';
import { Line } from 'react-chartjs-2';
import './ChartSetup';
import { chartCommonOptions } from './ChartSetup';
import { Zap, TrendingUp } from 'lucide-react';

export default function LiftToDragEfficiencyChart({ model }) {
  if (!model || !model.curves) return null;

  const labels = model.curves.map(c => `${c.aoa}°`);
  const ldData = model.curves.map(c => c.ld);

  const maxLdPoint = [...model.curves].reduce((max, p) => p.ld > max.ld ? p : max, model.curves[0]);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Glide Ratio / Aerodynamic Efficiency (L/D)',
        data: ldData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 2.5,
        pointBackgroundColor: model.curves.map(c => c.aoa === maxLdPoint.aoa ? '#10b981' : c.stall ? '#ef4444' : '#06b6d4'),
        pointBorderColor: '#ffffff',
        pointRadius: model.curves.map(c => c.aoa === maxLdPoint.aoa ? 7 : 4),
        pointHoverRadius: 8,
        tension: 0.3,
        fill: true
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
          text: 'Aerodynamic Efficiency (L/D Ratio)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="aero-card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Aerodynamic Efficiency [L/D vs α]
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Optimal glide range angle & post-stall collapse
            </p>
          </div>
        </div>

        <span className="badge-emerald text-[10px] font-mono px-2 py-0.5 rounded">
          (L/D)_max = {maxLdPoint.ld.toFixed(1)} @ α = {maxLdPoint.aoa}°
        </span>
      </div>

      <div className="relative flex-1 min-h-[280px] w-full mt-3">
        <Line data={chartData} options={options} />
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">PEAK L/D RATIO</span>
          <span className="text-emerald-400 font-bold">{maxLdPoint.ld.toFixed(1)}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">OPTIMAL CRUISE AoA</span>
          <span className="text-cyan-300 font-bold">α = {maxLdPoint.aoa}°</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">STALL PENALTY</span>
          <span className="text-rose-400 font-bold">-78% at α=18°</span>
        </div>
      </div>
    </div>
  );
}
