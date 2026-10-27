import React from 'react';
import { Line } from 'react-chartjs-2';
import './ChartSetup';
import { chartCommonOptions } from './ChartSetup';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LiftCurveChart({ model, currentAoA = null, showCFD = true }) {
  if (!model || !model.curves) return null;

  const labels = model.curves.map(c => `${c.aoa}°`);
  const clData = model.curves.map(c => c.cl);

  // Theoretical linear thin airfoil lift slope line: Cl = clAlpha * (aoa - aoa0)
  const aoa0 = model.id === 'supercritical_sc2' ? -1.8 : 0;
  const cfdLinearData = model.curves.map(c => {
    const linearCl = model.clAlpha * (c.aoa - aoa0);
    return Number(linearCl.toFixed(3));
  });

  const datasets = [
    {
      label: 'Wind Tunnel Measured (CL)',
      data: clData,
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.12)',
      borderWidth: 2.5,
      pointBackgroundColor: model.curves.map(c => c.stall ? '#ef4444' : '#06b6d4'),
      pointBorderColor: '#ffffff',
      pointRadius: model.curves.map(c => (currentAoA !== null && Math.abs(c.aoa - currentAoA) < 0.5 ? 7 : 4)),
      pointHoverRadius: 8,
      tension: 0.25,
      fill: true
    }
  ];

  if (showCFD) {
    datasets.push({
      label: 'Inviscid CFD Linear Slope (2πα)',
      data: cfdLinearData,
      borderColor: 'rgba(148, 163, 184, 0.65)',
      borderDash: [5, 5],
      borderWidth: 1.8,
      pointRadius: 0,
      tension: 0,
      fill: false
    });
  }

  const chartData = {
    labels,
    datasets
  };

  const options = {
    ...chartCommonOptions,
    plugins: {
      ...chartCommonOptions.plugins,
      title: {
        display: false
      },
      tooltip: {
        ...chartCommonOptions.plugins.tooltip,
        callbacks: {
          afterBody: (context) => {
            const index = context[0].dataIndex;
            const pt = model.curves[index];
            if (!pt) return '';
            return [
              `L/D Ratio: ${pt.ld}`,
              `Stall State: ${pt.stall ? 'FLOW SEPARATION / STALL' : 'Attached Flow'}`
            ];
          }
        }
      }
    },
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
          text: 'Lift Coefficient (CL)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        },
        suggestedMin: -0.6,
        suggestedMax: 2.0
      }
    }
  };

  return (
    <div className="aero-card p-4 flex flex-col h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
              Lift Polar Curve [CL vs α]
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Linear lift slope & post-stall boundary separation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="badge-cyan text-[10px] font-mono px-2 py-0.5 rounded">
            α_stall = {model.stallAngle}°
          </span>
          <span className="badge-emerald text-[10px] font-mono px-2 py-0.5 rounded">
            CL_max = {model.clMax}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-1 min-h-[280px] w-full mt-3">
        <Line data={chartData} options={options} />
      </div>

      {/* Scientific Diagnostics Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">LIFT SLOPE (CLα)</span>
          <span className="text-cyan-300 font-bold">{model.clAlpha} / deg</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">ZERO-LIFT AoA (α₀)</span>
          <span className="text-slate-200 font-bold">{aoa0.toFixed(1)}°</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">MAX LIFT (CL,max)</span>
          <span className="text-emerald-400 font-bold">{model.clMax}</span>
        </div>
        <div className="bg-slate-900/60 p-2 rounded border border-slate-800">
          <span className="text-slate-400 text-[10px] block">STALL MARGIN</span>
          <span className={currentAoA && currentAoA >= model.stallAngle ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
            {currentAoA !== null ? `${(model.stallAngle - currentAoA).toFixed(1)}° to stall` : `${model.stallAngle}°`}
          </span>
        </div>
      </div>
    </div>
  );
}
