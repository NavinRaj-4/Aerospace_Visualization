import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AeroApi } from '../../services/api';
import { 
  Compass, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Sliders, 
  Layers, 
  Wind, 
  Flame 
} from 'lucide-react';

export default function CreateModelModal({ isOpen, onClose, onModelCreated }) {
  const { user, can } = useAuth();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [regime, setRegime] = useState('Subsonic');
  const [machNumber, setMachNumber] = useState(0.20);
  const [reynoldsNumber, setReynoldsNumber] = useState('4.5 × 10⁶');
  const [chord, setChord] = useState(0.35);
  const [span, setSpan] = useState(1.10);
  const [aspectRatio, setAspectRatio] = useState(3.14);
  const [thicknessRatio, setThicknessRatio] = useState('14%');
  const [stallAngle, setStallAngle] = useState(16.0);
  const [clMax, setClMax] = useState(1.62);
  const [clAlpha, setClAlpha] = useState(0.110);
  const [cd0, setCd0] = useState(0.0082);
  const [cm0, setCm0] = useState(-0.015);
  const [maxLOverD, setMaxLOverD] = useState(72.0);
  const [meshType, setMeshType] = useState('airfoil_symmetric');
  const [description, setDescription] = useState('');
  const [flowCharacteristics, setFlowCharacteristics] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Model name is required');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const modelPayload = {
        name,
        code: code || `AERO-${regime.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
        regime,
        machNumber: Number(machNumber),
        reynoldsNumber,
        reynoldsNumberValue: parseFloat(reynoldsNumber.replace(/[^0-9.]/g, '')) * 1000000 || 4500000,
        chord: Number(chord),
        span: Number(span),
        aspectRatio: Number(aspectRatio),
        thicknessRatio,
        stallAngle: Number(stallAngle),
        clMax: Number(clMax),
        clAlpha: Number(clAlpha),
        cd0: Number(cd0),
        cm0: Number(cm0),
        maxLOverD: Number(maxLOverD),
        facilityId: regime === 'Subsonic' ? 'TUNNEL-SUB-01' : regime === 'Transonic' ? 'TUNNEL-TRANS-02' : 'TUNNEL-SUPER-03',
        meshType,
        description: description || `Engineered ${regime} test article calibrated for wind tunnel precision studies.`,
        flowCharacteristics: flowCharacteristics || `Boundary layer transition nominal with stall threshold at α = ${stallAngle}°.`,
        foilCoordinates: [
          { x: 1.000, yt: 0.0015 },
          { x: 0.900, yt: 0.0210 },
          { x: 0.800, yt: 0.0380 },
          { x: 0.600, yt: 0.0620 },
          { x: 0.400, yt: 0.0750 },
          { x: 0.200, yt: 0.0650 },
          { x: 0.100, yt: 0.0450 },
          { x: 0.000, yt: 0.0000 }
        ]
      };

      const newModel = await AeroApi.createModel(modelPayload);
      if (onModelCreated) onModelCreated(newModel);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create aerospace model');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden aero-hud-bar">
        {/* Reticles */}
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-aero-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Compass className="w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white tracking-wide">
                REGISTER AEROSPACE TEST ARTICLE
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Authorized Aerodynamicist & Flight Director CAD Specification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Model Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Clark-Y General Aviation Airfoil"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Engineering Code
              </label>
              <input
                type="text"
                placeholder="e.g. CLK-Y-SUB-01"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Regime & Mesh Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Flow Regime
              </label>
              <select
                value={regime}
                onChange={(e) => setRegime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              >
                <option value="Subsonic">Subsonic (Mach &lt; 0.7)</option>
                <option value="Transonic">Transonic (Mach 0.7 – 1.2)</option>
                <option value="Supersonic">Supersonic (Mach &gt; 1.2)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Design Mach Speed
              </label>
              <input
                type="number"
                step="0.01"
                value={machNumber}
                onChange={(e) => setMachNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                Mesh Geometry Profile
              </label>
              <select
                value={meshType}
                onChange={(e) => setMeshType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none"
              >
                <option value="airfoil_symmetric">Symmetric Foil Profile</option>
                <option value="airfoil_cambered_supercritical">Cambered Supercritical Wing</option>
                <option value="delta_wing_high_aoa">Delta Wing / Swept Planform</option>
              </select>
            </div>
          </div>

          {/* Row 3: Aerodynamic Coefficients */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Stall Angle (α_stall)
              </label>
              <input
                type="number"
                step="0.1"
                value={stallAngle}
                onChange={(e) => setStallAngle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Max Lift (C_L,max)
              </label>
              <input
                type="number"
                step="0.01"
                value={clMax}
                onChange={(e) => setClMax(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Parasite Drag (C_D0)
              </label>
              <input
                type="number"
                step="0.0001"
                value={cd0}
                onChange={(e) => setCd0(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Max L/D Ratio
              </label>
              <input
                type="number"
                step="0.5"
                value={maxLOverD}
                onChange={(e) => setMaxLOverD(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Dimensions */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Chord (m)
              </label>
              <input
                type="number"
                step="0.01"
                value={chord}
                onChange={(e) => setChord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Span (m)
              </label>
              <input
                type="number"
                step="0.01"
                value={span}
                onChange={(e) => setSpan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">
                Thickness %
              </label>
              <input
                type="text"
                value={thicknessRatio}
                onChange={(e) => setThicknessRatio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Description & Flow Characteristics
            </label>
            <textarea
              rows={2}
              placeholder="Boundary layer behavior, suction peak notes, or experimental objectives..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-cyan-glow transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Model...' : 'Register Aerospace Article'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
