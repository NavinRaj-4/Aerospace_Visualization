import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import '../Charts/ChartSetup';
import { chartCommonOptions } from '../Charts/ChartSetup';
import { calculateAerodynamics } from '../../mockData/aerospaceData';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Zap, 
  Activity 
} from 'lucide-react';

export default function LiveTunnelSweep({
  selectedModel,
  onSaveSweepRuns,
  audioEnabled,
  setAudioEnabled
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAoA, setCurrentAoA] = useState(-4.0);
  const [sweepSpeed, setSweepSpeed] = useState(1.0); // deg/sec
  const [recordedPoints, setRecordedPoints] = useState([]);
  const [isStallActive, setIsStallActive] = useState(false);

  const audioCtxRef = useRef(null);
  const animIntervalRef = useRef(null);

  // Web Audio Tone Generator for authentic aerospace telemetry chirps and stall alarms
  const playTelemetryChirp = (freq = 440, type = 'sine', duration = 0.05) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context policy
    }
  };

  // Run automated sweep
  useEffect(() => {
    if (!isRunning) {
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
      return;
    }

    animIntervalRef.current = setInterval(() => {
      setCurrentAoA((prev) => {
        const next = prev + 0.5 * sweepSpeed;
        if (next > 20.0) {
          setIsRunning(false);
          return 20.0;
        }

        // Calculate data point
        const computed = calculateAerodynamics(selectedModel.id, next);
        setRecordedPoints((pts) => {
          // Avoid duplicate AoA points
          if (pts.some(p => Math.abs(p.aoa - next) < 0.2)) return pts;
          return [...pts, computed];
        });

        const isStalled = next >= selectedModel.stallAngle;
        setIsStallActive(isStalled);

        if (isStalled) {
          playTelemetryChirp(880, 'sawtooth', 0.12); // High frequency warning buzzer
        } else {
          playTelemetryChirp(350 + next * 25, 'sine', 0.04); // Rising telemetry blip
        }

        return next;
      });
    }, 200 / sweepSpeed);

    return () => clearInterval(animIntervalRef.current);
  }, [isRunning, sweepSpeed, selectedModel]);

  const handleStart = () => {
    if (currentAoA >= 20.0) {
      setCurrentAoA(-4.0);
      setRecordedPoints([]);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentAoA(-4.0);
    setRecordedPoints([]);
    setIsStallActive(false);
  };

  const handleSaveToInspector = () => {
    if (recordedPoints.length === 0) return;
    onSaveSweepRuns(recordedPoints);
    alert(`Successfully saved ${recordedPoints.length} sweep points to Flight Test Inspector!`);
  };

  // Live Chart Data
  const chartLabels = recordedPoints.map(p => `${p.aoa.toFixed(1)}°`);
  const liveClData = recordedPoints.map(p => p.cl);
  const liveCdData = recordedPoints.map(p => p.cd);

  const liveChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Live Lift Coefficient (CL)',
        data: liveClData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderWidth: 2.5,
        pointBackgroundColor: recordedPoints.map(p => p.stall !== 'LAMINAR_ATTACHED' ? '#ef4444' : '#06b6d4'),
        pointRadius: 4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Live Drag Coefficient (CD)',
        data: liveCdData,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        borderWidth: 2,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 3,
        fill: false,
        yAxisID: 'y1'
      }
    ]
  };

  const liveOptions = {
    ...chartCommonOptions,
    scales: {
      x: {
        ...chartCommonOptions.scales.x,
        title: {
          display: true,
          text: 'Sweep Angle of Attack α (deg)',
          color: '#cbd5e1',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        }
      },
      y: {
        ...chartCommonOptions.scales.y,
        title: {
          display: true,
          text: 'Lift Coefficient (CL)',
          color: '#06b6d4',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        },
        suggestedMin: -0.6,
        suggestedMax: 2.0
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#f59e0b', font: { family: 'JetBrains Mono, monospace' } },
        title: {
          display: true,
          text: 'Drag Coefficient (CD)',
          color: '#f59e0b',
          font: { family: 'JetBrains Mono, monospace', size: 11, weight: 'bold' }
        },
        suggestedMin: 0.0,
        suggestedMax: 0.4
      }
    }
  };

  const latestPt = recordedPoints[recordedPoints.length - 1] || calculateAerodynamics(selectedModel.id, currentAoA);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="aero-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              <h2 className="text-lg font-bold font-mono text-white uppercase tracking-wider">
                Automated Wind Tunnel Telemetry Sweep Generator
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400">
              Continuously pitch test article from -4° to +20° and record real-time aerodynamic polar points
            </p>
          </div>

          {/* Sweep Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow-emerald-glow flex items-center space-x-1.5 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{currentAoA >= 20.0 ? 'Restart Sweep' : 'Start Auto Sweep'}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold shadow-amber-glow flex items-center space-x-1.5 transition-all"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Sweep</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700 flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSaveToInspector}
              disabled={recordedPoints.length === 0}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center space-x-1.5 transition-all ${
                recordedPoints.length > 0
                  ? 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 shadow-cyan-glow'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save {recordedPoints.length} Points to Inspector</span>
            </button>
          </div>
        </div>

        {/* Sweep Progress & Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800/80 items-center">
          {/* Progress Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>AoA Sweep Progress:</span>
              <span className={`font-bold ${isStallActive ? 'text-rose-400' : 'text-cyan-300'}`}>
                {currentAoA.toFixed(1)}° / 20.0°
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-150 ${isStallActive ? 'bg-rose-500 shadow-red-glow' : 'bg-cyan-400 shadow-cyan-glow'}`}
                style={{ width: `${Math.min(100, Math.max(0, ((currentAoA + 4) / 24) * 100))}%` }}
              />
            </div>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
            <span>Sweep Rate:</span>
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSweepSpeed(s)}
                className={`px-2 py-1 rounded ${
                  sweepSpeed === s
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Audio Telemetry Toggle */}
          <div className="flex items-center justify-end space-x-2 text-xs font-mono text-slate-300">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700"
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              <span>{audioEnabled ? 'Acoustic Telemetry Active' : 'Muted'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Chart & Instant Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Polar Sweep Curve (2 cols on lg) */}
        <div className="lg:col-span-2 aero-card p-5 flex flex-col h-[420px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
                Live Polar Curve Telemetry Plot
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {recordedPoints.length} Live Samples Captured
            </span>
          </div>

          <div className="relative flex-1 min-h-[300px] w-full mt-3">
            {recordedPoints.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono text-xs space-y-2">
                <Radio className="w-8 h-8 text-slate-600 animate-pulse" />
                <span>Click "Start Auto Sweep" to begin recording live wind tunnel curves</span>
              </div>
            ) : (
              <Line data={liveChartData} options={liveOptions} />
            )}
          </div>
        </div>

        {/* Live Instant Gauges */}
        <div className="aero-card p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
                Instant Sweep Telemetry
              </h3>
              {isStallActive && (
                <span className="badge-red text-[10px] px-1.5 py-0.2 rounded font-bold animate-pulse">
                  STALL DETECTED
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Operating point @ α = {currentAoA.toFixed(1)}°
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-400">Lift Coefficient (CL):</span>
              <span className="text-xl font-bold text-cyan-300">{latestPt.cl?.toFixed(3) || '0.000'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-400">Drag Coefficient (CD):</span>
              <span className="text-xl font-bold text-amber-300">{latestPt.cd?.toFixed(4) || '0.0078'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-400">Glide Ratio (L/D):</span>
              <span className="text-xl font-bold text-emerald-400">{latestPt.ld?.toFixed(1) || '0.0'}</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-baseline font-mono">
              <span className="text-xs text-slate-400">Wake Separation:</span>
              <span className={`text-xl font-bold ${isStallActive ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                {latestPt.separationPct || 2}%
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            {isStallActive ? (
              <span className="text-rose-400 font-bold">
                ⚠️ BOUNDARY LAYER SEPARATION IN PROGRESS
              </span>
            ) : (
              <span className="text-emerald-400">
                ✓ LAMINAR ATTACHED BOUNDARY LAYER
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
